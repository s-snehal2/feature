import { createClient } from "@/lib/supabase/client";
import type { StoredImage } from "../types";
import {
  ALLOWED_IMAGE_EXTENSIONS,
  STORAGE_BUCKET,
  STORAGE_FOLDER,
} from "./constants";
import { buildShowcaseFilename } from "./filename";

function objectPath(fileName: string): string {
  return `${STORAGE_FOLDER}/${fileName}`;
}

function isImageName(name: string): boolean {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  return (ALLOWED_IMAGE_EXTENSIONS as readonly string[]).includes(ext);
}

export async function listShowcaseImages(): Promise<StoredImage[]> {
  const supabase = createClient();

  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .list(STORAGE_FOLDER, {
      sortBy: { column: "name", order: "asc" },
    });

  if (error) throw error;

  return (data ?? [])
    .filter((item) => item.id !== null && isImageName(item.name))
    .map((item) => {
      const publicUrl = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(objectPath(item.name)).data.publicUrl;
      // Cache-bust with the object's updated_at so a replaced/reordered file
      // is never served from a stale CDN/browser cache.
      const version = item.updated_at ?? String(Date.now());
      const originalName = item.metadata?.originalName;
      return {
        name: item.name,
        path: objectPath(item.name),
        url: `${publicUrl}?v=${encodeURIComponent(version)}`,
        originalName:
          typeof originalName === "string" ? originalName : undefined,
      };
    });
}

/**
 * Fetch the user's original filename for the given objects via the Info
 * endpoint. `list()` does not return custom metadata, so we read it per file
 * (fine for the small groups this editor deals with). Names without stored
 * metadata map to `undefined`.
 */
export async function getOriginalNames(
  fileNames: string[],
): Promise<Record<string, string | undefined>> {
  const supabase = createClient();

  const entries = await Promise.all(
    fileNames.map(async (fileName) => {
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .info(objectPath(fileName));

      if (error) return [fileName, undefined] as const;

      const originalName = data?.metadata?.originalName;
      return [
        fileName,
        typeof originalName === "string" ? originalName : undefined,
      ] as const;
    }),
  );

  return Object.fromEntries(entries);
}

export async function uploadShowcaseFile(
  file: File,
  fileName: string,
): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(objectPath(fileName), file, {
      contentType: file.type || undefined,
      upsert: false,
      // Keep the user's original filename alongside the auto-generated one.
      metadata: { originalName: file.name },
    });

  if (error) throw error;
}

export async function deleteShowcaseFile(fileName: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .remove([objectPath(fileName)]);

  if (error) throw error;
}

/** Replace = delete the existing object first, then upload the new one. */
export async function replaceShowcaseFile(
  file: File,
  fileName: string,
): Promise<void> {
  await deleteShowcaseFile(fileName);
  await uploadShowcaseFile(file, fileName);
}

/** Move an object within the bucket (used to rename files during reorder). */
async function moveShowcaseFile(
  fromName: string,
  toName: string,
): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .move(objectPath(fromName), objectPath(toName));

  if (error) throw error;
}

function extensionOf(fileName: string): string {
  return fileName.split(".").pop()?.toLowerCase() ?? "";
}

/**
 * Renumber stored images to match `ordered` (position 0 -> serial 01, etc.)
 * by renaming each object on storage. Uses a two-phase move: every file is
 * first parked under a unique temp name so final names never collide, then
 * promoted to its final serial. On failure, already-applied moves are
 * reversed best-effort.
 */
export async function reorderShowcaseImages(
  ordered: StoredImage[],
  color: string,
  quality: string,
): Promise<void> {
  if (ordered.length === 0) return;

  const applied: { from: string; to: string }[] = [];

  const move = async (from: string, to: string) => {
    if (from === to) return;
    await moveShowcaseFile(from, to);
    applied.push({ from, to });
  };

  const parked = ordered.map((image, index) => {
    const extension = extensionOf(image.name);
    return {
      temp: `__tmp_${Date.now()}_${index}.${extension.toUpperCase()}`,
      target: buildShowcaseFilename(color, quality, index + 1, extension),
    };
  });

  try {
    // Phase 1: park each file under a unique temp name.
    for (const [index, image] of ordered.entries()) {
      await move(image.name, parked[index].temp);
    }

    // Phase 2: promote temp files to their final serial names.
    for (const { temp, target } of parked) {
      await move(temp, target);
    }
  } catch (error) {
    for (const { from, to } of applied.reverse()) {
      try {
        await moveShowcaseFile(to, from);
      } catch {
        // Best-effort rollback; ignore secondary failures.
      }
    }
    throw error;
  }
}
