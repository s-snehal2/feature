import { createClient } from "@/lib/supabase/client";
import type { StoredImage } from "../types";
import {
  ALLOWED_IMAGE_EXTENSIONS,
  STORAGE_BUCKET,
  STORAGE_FOLDER,
} from "./constants";

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
      limit: 1000,
      sortBy: { column: "name", order: "asc" },
    });

  if (error) throw error;

  return (data ?? [])
    .filter((item) => item.id !== null && isImageName(item.name))
    .map((item) => ({
      name: item.name,
      path: objectPath(item.name),
      url: supabase.storage.from(STORAGE_BUCKET).getPublicUrl(objectPath(item.name))
        .data.publicUrl,
    }));
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
