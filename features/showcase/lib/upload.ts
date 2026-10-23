import { buildShowcaseFilename } from "./filename";

/** Human-readable byte size, e.g. 1536 -> "2 KB", 2_500_000 -> "2.4 MB". */
export function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.round(bytes / 1024)} KB`;
}

/** Lowercase extension of a file, without the dot. */
function getFileExtension(file: File): string {
  return file.name.split(".").pop()?.toLowerCase() ?? "";
}

/**
 * Auto-generate the storage name from the gallery selection and the image's
 * position in the list: `COLOR-QUALITY-NN.EXT`. Serial numbers are 1-based and
 * follow the arranged order, so reordering renumbers automatically.
 */
export function buildTargetName(
  color: string,
  quality: string,
  position: number,
  file: File,
): string {
  return buildShowcaseFilename(
    color,
    quality,
    position + 1,
    getFileExtension(file),
  );
}
