import {
  ALLOWED_IMAGE_EXTENSIONS,
  ALLOWED_IMAGE_MIME_TYPES,
} from "./constants";

/** Normalise a name part: trim, spaces -> "-", UPPERCASE. */
function normalizeNamePart(value: string): string {
  return value.trim().replace(/\s+/g, "-").toUpperCase();
}

function getFileExtension(fileName: string): string {
  const ext = fileName.split(".").pop() ?? "";
  return ext.toLowerCase();
}

export function isAllowedImageFile(file: File): boolean {
  const ext = getFileExtension(file.name);
  const extensionOk = (ALLOWED_IMAGE_EXTENSIONS as readonly string[]).includes(
    ext,
  );
  const mimeOk =
    file.type === "" ||
    (ALLOWED_IMAGE_MIME_TYPES as readonly string[]).includes(file.type);
  return extensionOk && mimeOk;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Build a showcase filename from the gallery selection.
 * Example: ("EXOTIC", "ACQUA BELLA", 1, "png") -> "EXOTIC-ACQUA-BELLA-01.PNG"
 */
export function buildShowcaseFilename(
  color: string,
  quality: string,
  sequence: number,
  extension: string,
): string {
  const padded = String(sequence).padStart(2, "0");
  return `${normalizeNamePart(color)}-${normalizeNamePart(quality)}-${padded}.${extension.toUpperCase()}`;
}

/**
 * Regex that verifies a stored filename for a given colour/quality.
 * Example: /^EXOTIC-ACQUA-BELLA-\d{2,}\.(PNG|JPG|JPEG|WEBP)$/
 */
function showcaseFilenameRegex(color: string, quality: string): RegExp {
  const colorPart = escapeRegExp(normalizeNamePart(color));
  const qualityPart = escapeRegExp(normalizeNamePart(quality));
  return new RegExp(
    `^${colorPart}-${qualityPart}-(\\d{2,})\\.(PNG|JPG|JPEG|WEBP)$`,
  );
}

/** Verify a filename against the pattern for the given colour/quality. */
export function isValidShowcaseFilename(
  fileName: string,
  color: string,
  quality: string,
): boolean {
  return showcaseFilenameRegex(color, quality).test(fileName);
}
