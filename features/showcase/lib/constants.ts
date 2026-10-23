import type { GalleryOption } from "../types";

/**
 * Colour / quality names users must pick from. All names are stored in
 * UPPERCASE and spaces are converted to "-" when building a filename.
 */
export const galleryOptions: GalleryOption[] = [
  { color: "EXOTIC", quality: "ACQUA BELLA" },
  { color: "EXOTIC", quality: "ALPHINE WHITE" },
  { color: "WHITE", quality: "AMETHYST WHITE" },
];

export const STORAGE_BUCKET = "qual-info";
export const STORAGE_FOLDER = "images";

export const ALLOWED_IMAGE_EXTENSIONS = ["png", "jpg", "jpeg", "webp"] as const;

export const ALLOWED_IMAGE_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
] as const;

export const ACCEPT_IMAGE_ATTR =
  ".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp";

export function getColors(): string[] {
  return Array.from(new Set(galleryOptions.map((option) => option.color)));
}

export function getQualities(color: string): GalleryOption[] {
  return galleryOptions.filter((option) => option.color === color);
}
