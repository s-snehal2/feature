"use client";

import { useEffect } from "react";

import { ChevronLeft, ChevronRight, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

import type { PreviewItem } from "@/features/showcase/types";

type Props = {
  open: boolean;
  items: PreviewItem[];
  index: number;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
};

/** Large lightbox preview for pending (blob) and stored (public) images. */
export function ImagePreview({
  open,
  items,
  index,
  onPrev,
  onNext,
  onClose,
}: Props) {
  const current = items[index];
  const hasPrev = index > 0;
  const hasNext = index < items.length - 1;

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") onPrev();
      if (event.key === "ArrowRight") onNext();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onPrev, onNext]);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="flex h-[95dvh] w-[90vw] max-w-5xl flex-col items-center gap-4 overflow-hidden rounded-xl border border-white/10 bg-neutral-950/95 p-5 text-white shadow-2xl backdrop-blur-md sm:max-w-5xl"
      >
        <div className="flex w-full items-center justify-between gap-4">
          <DialogTitle className="min-w-0 flex-1">
            <span className="block break-all text-sm font-medium text-white">
              {current?.name ?? ""}
            </span>
            {current?.originalName && (
              <span className="block break-all text-xs font-normal text-white/60">
                Original: {current.originalName}
              </span>
            )}
          </DialogTitle>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close preview"
            className="shrink-0 rounded-full p-1.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="relative flex w-full flex-1 min-h-0 items-center justify-center overflow-hidden">
          {items.length > 1 && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={!hasPrev}
              onClick={onPrev}
              aria-label="Previous image"
              className="absolute left-0 z-10 size-10 rounded-full bg-black/50 text-white hover:bg-black/70 disabled:opacity-30"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          )}

          {current && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={current.url}
              alt={current.name}
              className="max-h-full w-auto max-w-full object-contain"
            />
          )}

          {items.length > 1 && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={!hasNext}
              onClick={onNext}
              aria-label="Next image"
              className="absolute right-0 z-10 size-10 rounded-full bg-black/50 text-white hover:bg-black/70 disabled:opacity-30"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          )}
        </div>
        {items.length > 1 && (
          <p className="text-xs text-white/60">
            {index + 1} / {items.length}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
