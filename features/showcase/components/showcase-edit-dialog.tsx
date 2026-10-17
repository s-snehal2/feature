"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ImagePlus,
  Loader2,
  RefreshCw,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";

import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  ACCEPT_IMAGE_ATTR,
  galleryOptions,
  getColors,
  getQualities,
} from "@/features/showcase/lib/constants";
import {
  buildShowcaseFilename,
  isAllowedImageFile,
  isValidShowcaseFilename,
  normalizeShowcaseFilename,
} from "@/features/showcase/lib/filename";
import {
  deleteShowcaseFile,
  listShowcaseImages,
  replaceShowcaseFile,
  uploadShowcaseFile,
} from "@/features/showcase/lib/storage";
import type { StoredImage } from "@/features/showcase/types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChanged?: () => void;
};

type PendingUpload = {
  id: string;
  file: File;
  targetName: string;
  status: "ready" | "uploading" | "done" | "error" | "skipped";
  message?: string;
};

function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.round(bytes / 1024)} KB`;
}

export default function ShowcaseEditDialog({
  open,
  onOpenChange,
  onChanged,
}: Props) {
  const colors = useMemo(() => getColors(), []);

  const [color, setColor] = useState(colors[0] ?? "");
  const [quality, setQuality] = useState(
    getQualities(colors[0] ?? "")[0]?.quality ?? "",
  );
  const [replaceExisting, setReplaceExisting] = useState(false);

  const [stored, setStored] = useState<StoredImage[]>([]);
  const [pending, setPending] = useState<PendingUpload[]>([]);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingName, setDeletingName] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<StoredImage | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const singleInputRef = useRef<HTMLInputElement>(null);

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

    const first = getColors()[0];
    setColor((current) => current || first || "");
    setPending([]);
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

  // Reset pending uploads when the selection changes.
  useEffect(() => {
    setPending([]);
  }, [color, quality]);

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

    const files = Array.from(fileList).sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { numeric: true }),
    );

    const added: PendingUpload[] = [];
    const rejected: string[] = [];
    const skipped: string[] = [];

    const batchNames = new Set<string>();

    files.forEach((file, index) => {
      if (!isAllowedImageFile(file)) {
        rejected.push(`${file.name} (only PNG, JPG, JPEG, WEBP)`);
        return;
      }

      // Normalise the incoming name ("_"/spaces -> "-", drop a doubled
      // extension, uppercase), then verify it follows COLOR-QUALITY-SERIALNO
      // for the selected colour/quality.
      const targetName = normalizeShowcaseFilename(file.name);
      if (!targetName) {
        rejected.push(`${file.name} (only PNG, JPG, JPEG, WEBP)`);
        return;
      }

      if (!isValidShowcaseFilename(targetName, color, quality)) {
        const expected = buildShowcaseFilename(color, quality, 1, "png");
        rejected.push(`${file.name} (name must be like ${expected})`);
        return;
      }

      // Duplicate skip: already stored, or twice in the same batch.
      if (existingNames.has(targetName) || batchNames.has(targetName)) {
        skipped.push(targetName);
        return;
      }

      batchNames.add(targetName);

      added.push({
        id: `${targetName}-${file.lastModified}-${index}`,
        file,
        targetName,
        status: "ready",
      });
    });

    setPending((current) => [...current, ...added]);

    if (added.length) {
      toast.success(`${added.length} file(s) ready to upload.`);
    }
    if (skipped.length) {
      toast.warning(`Skipped ${skipped.length} duplicate(s).`, {
        description: skipped.slice(0, 4).join(", "),
      });
    }
    if (rejected.length) {
      toast.error(`${rejected.length} file(s) rejected.`, {
        description: rejected.slice(0, 4).join(", "),
      });
    }
  };

  const removePending = (id: string) => {
    setPending((current) => current.filter((item) => item.id !== id));
  };

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

    for (const item of pending) {
      const exists = existingNames.has(item.targetName);

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
          await replaceShowcaseFile(item.file, item.targetName);
          overridden += 1;
        } else {
          await uploadShowcaseFile(item.file, item.targetName);
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

    setPending((current) =>
      current.filter((item) => item.status === "error"),
    );

    onChanged?.();
  };

  const handleDelete = (image: StoredImage) => {
    setDeleteTarget(image);
  };

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[95vh] flex-col sm:max-w-3xl">
        <DialogHeader className="shrink-0">
          <DialogTitle>Edit Work Showcase</DialogTitle>

          <DialogDescription>
            Upload PNG / JPG / JPEG / WEBP images (max 5 MB each) using the
            gallery colour and quality.
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
          {/* Selection */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Colour</Label>
              <Select value={color} onValueChange={handleColorChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select colour" />
                </SelectTrigger>
                <SelectContent>
                  {colors.map((value) => (
                    <SelectItem key={value} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Quality</Label>
              <Select value={quality} onValueChange={handleQualityChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select quality" />
                </SelectTrigger>
                <SelectContent>
                  {galleryOptions.map((option) => (
                    <SelectItem
                      key={`${option.color}-${option.quality}`}
                      value={option.quality}
                    >
                      {option.quality}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Upload button */}
          <div>
            <Button
              type="button"
              variant="outline"
              className="h-16 w-full"
              disabled={uploading}
              onClick={() => singleInputRef.current?.click()}
            >
              <ImagePlus className="mr-2 h-5 w-5" />
              Add image(s)
            </Button>

            <input
              ref={singleInputRef}
              type="file"
              multiple
              accept={ACCEPT_IMAGE_ATTR}
              className="hidden"
              onChange={(event) => {
                addFiles(event.target.files);
                event.target.value = "";
              }}
            />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={replaceExisting}
              onChange={(event) => setReplaceExisting(event.target.checked)}
              className="h-4 w-4"
            />
            Replace existing files (delete first, then upload)
          </label>

          {/* Pending uploads */}
          {pending.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">
                  To upload ({pending.length})
                </p>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={uploading}
                  onClick={() => setPending([])}
                >
                  Clear
                </Button>
              </div>

              <div className="max-h-48 space-y-1.5 overflow-y-auto">
                {pending.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-lg border p-2 text-sm"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">{item.targetName}</p>
                      <p className="text-xs text-gray-500">
                        {formatSize(item.file.size)}
                        {item.message ? ` · ${item.message}` : ""}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-1">
                      {item.status === "uploading" && (
                        <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                      )}
                      {item.status === "done" && (
                        <Badge variant="secondary">Done</Badge>
                      )}
                      {item.status === "skipped" && (
                        <Badge variant="outline">Skipped</Badge>
                      )}
                      {item.status === "error" && (
                        <Badge variant="destructive">Error</Badge>
                      )}

                      {item.status === "ready" && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          disabled={uploading}
                          onClick={() => removePending(item.id)}
                          className="text-red-500 hover:bg-red-50 hover:text-red-600"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stored images */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">
                Stored images ({filteredStored.length})
              </p>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={loading}
                onClick={refreshStored}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>

            {loadError && (
              <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                {loadError}
              </p>
            )}

            <div className="max-h-60 space-y-1.5 overflow-y-auto">
              {loading ? (
                <p className="py-6 text-center text-sm text-gray-500">
                  Loading…
                </p>
              ) : filteredStored.length === 0 ? (
                <p className="py-6 text-center text-sm text-gray-500">
                  No images for {color} / {quality}.
                </p>
              ) : (
                filteredStored.map((image) => (
                  <div
                    key={image.name}
                    className="flex items-center justify-between rounded-lg border p-2 text-sm"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">{image.name}</p>
                      <p className="truncate text-xs text-gray-500">
                        {image.path}
                      </p>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={deletingName === image.name}
                      onClick={() => handleDelete(image)}
                      className="shrink-0 text-red-500 hover:bg-red-50 hover:text-red-600"
                    >
                      {deletingName === image.name ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="shrink-0">
          <Button
            type="button"
            variant="outline"
            disabled={uploading}
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>

          <Button
            type="button"
            disabled={pending.length === 0 || uploading}
            onClick={handleUpload}
            className="bg-yellow-400 text-black hover:bg-yellow-500"
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading…
              </>
            ) : (
              <>
                <UploadCloud className="mr-2 h-4 w-4" />
                Upload {pending.length > 0 ? `(${pending.length})` : ""}
              </>
            )}
          </Button>
        </DialogFooter>

        <AlertDialog
          open={deleteTarget !== null}
          onOpenChange={(next) => {
            if (!next) setDeleteTarget(null);
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete image?</AlertDialogTitle>
              <AlertDialogDescription>
                This permanently deletes “{deleteTarget?.name}” from storage.
                This can’t be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DialogContent>
    </Dialog>
  );
}
