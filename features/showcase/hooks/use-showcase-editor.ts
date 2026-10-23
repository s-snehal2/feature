"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { arrayMove } from "@dnd-kit/sortable";
import { toast } from "sonner";

import {
  galleryOptions,
  getColors,
  getQualities,
} from "@/features/showcase/lib/constants";
import {
  isAllowedImageFile,
  isValidShowcaseFilename,
} from "@/features/showcase/lib/filename";
import {
  deleteShowcaseFile,
  getOriginalNames,
  listShowcaseImages,
  reorderShowcaseImages,
  replaceShowcaseFile,
  uploadShowcaseFile,
} from "@/features/showcase/lib/storage";
import { buildTargetName } from "@/features/showcase/lib/upload";
import type {
  PendingUpload,
  PreviewItem,
  StoredImage,
} from "@/features/showcase/types";

type PreviewState = {
  items: PreviewItem[];
  index: number;
};

type Options = {
  open: boolean;
  onChanged?: () => void;
};

/**
 * Owns all state and side effects for the showcase editor: the colour/quality
 * selection, the pending upload queue, the stored image list, and the upload /
 * delete flows. The dialog component is a thin view over this.
 */
export function useShowcaseEditor({ open, onChanged }: Options) {
  const colors = useMemo(() => getColors(), []);

  const [color, setColor] = useState("");
  const [quality, setQuality] = useState("");
  const [replaceExisting, setReplaceExisting] = useState(false);

  const [stored, setStored] = useState<StoredImage[]>([]);
  const [pending, setPending] = useState<PendingUpload[]>([]);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingName, setDeletingName] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<StoredImage | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [preview, setPreview] = useState<PreviewState | null>(null);
  const [rearrangeMode, setRearrangeMode] = useState(false);
  const [draftOrder, setDraftOrder] = useState<StoredImage[]>([]);
  const [savingOrder, setSavingOrder] = useState(false);
  // Original filenames looked up per object via the Info endpoint; key presence
  // marks a name as already resolved (value may be undefined).
  const [originalNames, setOriginalNames] = useState<
    Record<string, string | undefined>
  >({});

  // Mirror of `pending` so unmount cleanup can revoke object URLs.
  const pendingRef = useRef<PendingUpload[]>([]);
  useEffect(() => {
    pendingRef.current = pending;
  }, [pending]);

  useEffect(() => {
    return () => {
      pendingRef.current.forEach((item) =>
        URL.revokeObjectURL(item.previewUrl),
      );
    };
  }, []);

  const resetPending = () => {
    setPreview(null);
    setPending((current) => {
      current.forEach((item) => URL.revokeObjectURL(item.previewUrl));
      return [];
    });
  };

  // Colour drives the quality list; picking a colour resets quality to its first
  // option so the two selects never end up on an invalid pair.
  const handleColorChange = (value: string) => {
    setColor(value);
    setQuality(getQualities(value)[0]?.quality ?? "");
  };

  // Quality drives the colour: every quality belongs to a colour, so selecting
  // one switches the colour to match it.
  const handleQualityChange = (value: string) => {
    setQuality(value);
    const owner = galleryOptions.find((option) => option.quality === value);
    if (owner) setColor(owner.color);
  };

  const refreshStored = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      setStored(await listShowcaseImages());
    } catch (error) {
      console.error(error);
      setLoadError(
        "Could not load images. Check your Supabase connection and policies.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) return;

    refreshStored();

    setPending((current) => {
      current.forEach((item) => URL.revokeObjectURL(item.previewUrl));
      return [];
    });
    setPreview(null);
    setRearrangeMode(false);
    setDraftOrder([]);
    setOriginalNames({});
    setDeleteTarget(null);
    setLoadError(null);
  }, [open]);

  // Only show stored files that belong to the selected colour/quality.
  const filteredStored = useMemo(
    () =>
      stored.filter((image) =>
        isValidShowcaseFilename(image.name, color, quality),
      ),
    [stored, color, quality],
  );

  // Reset pending uploads when the selection changes (names depend on it).
  useEffect(() => {
    setPending((current) => {
      current.forEach((item) => URL.revokeObjectURL(item.previewUrl));
      return [];
    });
    setPreview(null);
    setRearrangeMode(false);
    setDraftOrder([]);
    setOriginalNames({});
  }, [color, quality]);

  // Resolve original filenames for the selected group (list() omits them).
  useEffect(() => {
    const missing = filteredStored
      .filter((image) => !(image.name in originalNames))
      .map((image) => image.name);
    if (missing.length === 0) return;

    let cancelled = false;
    getOriginalNames(missing)
      .then((found) => {
        if (!cancelled) {
          setOriginalNames((current) => ({ ...current, ...found }));
        }
      })
      .catch((error) => console.error(error));

    return () => {
      cancelled = true;
    };
  }, [filteredStored, originalNames]);

  // Merge resolved originals into the list shown to the user.
  const displayedStored = useMemo(
    () =>
      filteredStored.map((image) => ({
        ...image,
        originalName: image.originalName ?? originalNames[image.name],
      })),
    [filteredStored, originalNames],
  );

  const existingNames = useMemo(
    () => new Set(stored.map((image) => image.name)),
    [stored],
  );

  const addFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    if (!color || !quality) {
      toast.error("Select a colour and quality first.");
      return;
    }

    const added: PendingUpload[] = [];
    const rejected: string[] = [];

    Array.from(fileList).forEach((file, index) => {
      if (!isAllowedImageFile(file)) {
        rejected.push(`${file.name} (only PNG, JPG, JPEG, WEBP)`);
        return;
      }

      added.push({
        id: `${file.name}-${file.lastModified}-${Date.now()}-${index}`,
        file,
        previewUrl: URL.createObjectURL(file),
        status: "ready",
      });
    });

    setPending((current) => [...current, ...added]);

    if (added.length) {
      toast.success(`${added.length} file(s) ready to upload.`);
    }
    if (rejected.length) {
      toast.error(`${rejected.length} file(s) rejected.`, {
        description: rejected.slice(0, 4).join(", "),
      });
    }
  };

  const removePending = (id: string) => {
    setPending((current) => {
      const target = current.find((item) => item.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return current.filter((item) => item.id !== id);
    });
  };

  const clearPending = () => resetPending();

  // The grid owns the drag mechanics and hands back the reordered list.
  const reorder = (next: PendingUpload[]) => setPending(next);

  const handleUpload = async () => {
    if (pending.length === 0) {
      toast.error("Nothing to upload.");
      return;
    }

    setUploading(true);

    let uploaded = 0;
    let overridden = 0;
    let skipped = 0;
    let failed = 0;

    for (const [index, item] of pending.entries()) {
      const targetName = buildTargetName(color, quality, index, item.file);
      const exists = existingNames.has(targetName);

      if (exists && !replaceExisting) {
        skipped += 1;
        setPending((current) =>
          current.map((entry) =>
            entry.id === item.id
              ? { ...entry, status: "skipped", message: "Already exists" }
              : entry,
          ),
        );
        continue;
      }

      setPending((current) =>
        current.map((entry) =>
          entry.id === item.id ? { ...entry, status: "uploading" } : entry,
        ),
      );

      try {
        if (exists && replaceExisting) {
          await replaceShowcaseFile(item.file, targetName);
          overridden += 1;
        } else {
          await uploadShowcaseFile(item.file, targetName);
          uploaded += 1;
        }

        setPending((current) =>
          current.map((entry) =>
            entry.id === item.id ? { ...entry, status: "done" } : entry,
          ),
        );
      } catch (error) {
        console.error(error);
        failed += 1;
        setPending((current) =>
          current.map((entry) =>
            entry.id === item.id
              ? {
                  ...entry,
                  status: "error",
                  message:
                    error instanceof Error ? error.message : "Upload failed",
                }
              : entry,
          ),
        );
      }
    }

    setUploading(false);
    await refreshStored();

    const summary = [
      `${uploaded} uploaded`,
      overridden ? `${overridden} replaced` : null,
      skipped ? `${skipped} skipped` : null,
      failed ? `${failed} failed` : null,
    ]
      .filter(Boolean)
      .join(", ");

    if (failed) {
      toast.error(summary);
    } else {
      toast.success(summary);
    }

    // Keep only failed files for a retry; release previews for the rest.
    setPending((current) => {
      current.forEach((item) => {
        if (item.status !== "error") URL.revokeObjectURL(item.previewUrl);
      });
      return current.filter((item) => item.status === "error");
    });

    onChanged?.();
  };

  const handleDelete = (image: StoredImage) => setDeleteTarget(image);

  const cancelDelete = () => setDeleteTarget(null);

  const confirmDelete = async () => {
    const image = deleteTarget;
    if (!image) return;

    setDeleteTarget(null);
    setDeletingName(image.name);
    try {
      await deleteShowcaseFile(image.name);
      setStored((current) =>
        current.filter((entry) => entry.name !== image.name),
      );
      toast.success(`Deleted ${image.name}`);
      onChanged?.();
    } catch (error) {
      console.error(error);
      toast.error("Could not delete the file.");
    } finally {
      setDeletingName(null);
    }
  };

  const openPreview = (items: PreviewItem[], index: number) =>
    setPreview({ items, index });

  const closePreview = () => setPreview(null);

  const showPrev = () =>
    setPreview((current) =>
      current ? { ...current, index: Math.max(0, current.index - 1) } : current,
    );

  const showNext = () =>
    setPreview((current) =>
      current
        ? { ...current, index: Math.min(current.items.length - 1, current.index + 1) }
        : current,
    );

  const startRearrange = () => {
    setDraftOrder(displayedStored);
    setRearrangeMode(true);
  };

  const cancelRearrange = () => {
    setRearrangeMode(false);
    setDraftOrder([]);
  };

  const moveStored = (from: number, to: number) =>
    setDraftOrder((current) => arrayMove(current, from, to));

  const saveRearrange = async () => {
    if (draftOrder.length < 2) {
      cancelRearrange();
      return;
    }

    setSavingOrder(true);
    try {
      await reorderShowcaseImages(draftOrder, color, quality);
      await refreshStored();
      setRearrangeMode(false);
      setDraftOrder([]);
      toast.success("Image order updated.");
      onChanged?.();
    } catch (error) {
      console.error(error);
      toast.error("Could not reorder images.");
    } finally {
      setSavingOrder(false);
    }
  };

  const canRearrange =
    Boolean(color) &&
    Boolean(quality) &&
    filteredStored.length > 1 &&
    !loading &&
    !savingOrder;

  return {
    colors,
    color,
    quality,
    handleColorChange,
    handleQualityChange,
    replaceExisting,
    setReplaceExisting,
    pending,
    addFiles,
    removePending,
    clearPending,
    reorder,
    uploading,
    handleUpload,
    filteredStored: displayedStored,
    loading,
    loadError,
    refreshStored,
    deletingName,
    deleteTarget,
    handleDelete,
    confirmDelete,
    cancelDelete,
    preview,
    openPreview,
    closePreview,
    showPrev,
    showNext,
    rearrangeMode,
    draftOrder,
    savingOrder,
    canRearrange,
    startRearrange,
    cancelRearrange,
    moveStored,
    saveRearrange,
  };
}
