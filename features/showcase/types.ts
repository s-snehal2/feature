export type GalleryOption = {
  color: string;
  quality: string;
};

export type StoredImage = {
  name: string;
  path: string;
  url: string;
  /** Original filename as chosen by the user, persisted in object metadata. */
  originalName?: string;
};

/** A single image in the preview lightbox (local blob or public URL). */
export type PreviewItem = {
  url: string;
  name: string;
  originalName?: string;
};

export type PendingStatus =
  | "ready"
  | "uploading"
  | "done"
  | "error"
  | "skipped";

/** A file queued for upload, with a local preview and its current status. */
export type PendingUpload = {
  id: string;
  file: File;
  previewUrl: string;
  status: PendingStatus;
  message?: string;
};
