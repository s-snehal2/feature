"use client";

import { useRef } from "react";
import { ImagePlus, UploadCloud } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import { ACCEPT_IMAGE_ATTR } from "@/features/showcase/lib/constants";

import { Section } from "./section";

type Props = {
  uploading: boolean;
  replaceExisting: boolean;
  onFiles: (files: FileList | null) => void;
  onReplaceChange: (value: boolean) => void;
};

/** "Add image(s)" dropzone, hidden multi-file input, and the replace toggle. */
export function UploadControls({
  uploading,
  replaceExisting,
  onFiles,
  onReplaceChange,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Section
      icon={UploadCloud}
      title="Upload images"
      description="Add one or more images, then arrange them before uploading."
    >
      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className="border-input bg-muted/40 hover:border-ring hover:bg-accent/50 focus-visible:border-ring focus-visible:ring-ring/50 flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed px-4 py-4 text-center transition-colors focus-visible:ring-[3px] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="bg-background flex size-10 items-center justify-center rounded-full shadow-xs">
          <ImagePlus className="text-muted-foreground size-5" />
        </span>
        <span className="text-sm font-medium">Add image(s)</span>
        <span className="text-muted-foreground text-xs">
          PNG, JPG, JPEG or WEBP · max 5 MB each
        </span>
      </button>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ACCEPT_IMAGE_ATTR}
        className="hidden"
        onChange={(event) => {
          onFiles(event.target.files);
          event.target.value = "";
        }}
      />

      <div className="bg-muted/30 mt-4 flex items-center justify-between gap-4 rounded-lg border px-3 py-2.5">
        <div className="space-y-0.5">
          <Label htmlFor="replace-existing" className="text-sm font-medium">
            Replace existing files
          </Label>
          <p className="text-muted-foreground text-xs">
            Delete the matching file first, then upload the new one.
          </p>
        </div>

        <Switch
          id="replace-existing"
          checked={replaceExisting}
          onCheckedChange={onReplaceChange}
          disabled={uploading}
        />
      </div>
    </Section>
  );
}
