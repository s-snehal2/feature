"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Loader2, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

import { formatSize } from "@/features/showcase/lib/upload";
import type { PendingUpload } from "@/features/showcase/types";

type Props = {
  item: PendingUpload;
  name: string;
  index: number;
  disabled: boolean;
  onRemove: (id: string) => void;
};

/** A single draggable pending-upload tile; the whole tile is the drag handle. */
export function SortableThumbnail({
  item,
  name,
  index,
  disabled,
  onRemove,
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id, disabled });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
      {...listeners}
      className={cn(
        "group bg-card relative cursor-grab touch-none overflow-hidden rounded-lg border select-none transition-shadow active:cursor-grabbing",
        isDragging
          ? "ring-ring z-10 opacity-80 shadow-lg ring-2"
          : "hover:shadow-md",
      )}
    >
      <div className="bg-muted relative aspect-square w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.previewUrl}
          alt={name}
          className="h-full w-full object-cover"
        />

        <span className="bg-background/80 text-foreground absolute top-1.5 left-1.5 rounded-md px-1.5 py-0.5 text-[11px] font-semibold backdrop-blur-sm">
          {String(index + 1).padStart(2, "0")}
        </span>

        <span
          aria-hidden="true"
          className="bg-background/80 text-muted-foreground pointer-events-none absolute top-1.5 right-1.5 rounded-md p-1 backdrop-blur-sm"
        >
          <GripVertical className="h-3.5 w-3.5" />
        </span>
      </div>

      <div className="space-y-1.5 p-2.5">
        <p
          className="text-muted-foreground text-[11px] leading-tight"
          title={item.file.name}
        >
          <span className="font-medium">Original:</span>{" "}
          <span className="break-all">{item.file.name}</span>
        </p>

        <p className="text-xs leading-tight font-medium" title={name}>
          <span className="text-muted-foreground text-[11px] font-normal">
            Saved as:
          </span>{" "}
          <span className="break-all">{name}</span>
        </p>

        <div className="flex items-center justify-between gap-2">
          <span className="text-muted-foreground text-[11px]">
            {formatSize(item.file.size)}
          </span>

          <div className="flex items-center gap-1">
            {item.status === "uploading" && (
              <Loader2 className="text-muted-foreground h-3.5 w-3.5 animate-spin" />
            )}
            {item.status === "done" && <Badge variant="secondary">Done</Badge>}
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
                disabled={disabled}
                aria-label={`Remove ${item.file.name}`}
                onPointerDown={(event) => event.stopPropagation()}
                onClick={() => onRemove(item.id)}
                className="text-muted-foreground hover:text-destructive h-6 w-6"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>

        {item.message && (
          <p className="text-destructive truncate text-[11px]">
            {item.message}
          </p>
        )}
      </div>
    </div>
  );
}
