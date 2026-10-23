"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

import { cn } from "@/lib/utils";

import type { StoredImage } from "@/features/showcase/types";

type Props = {
  image: StoredImage;
  index: number;
  disabled: boolean;
};

/** A draggable stored-image row used while rearranging. */
export function SortableStoredRow({ image, index, disabled }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.name, disabled });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "bg-card flex items-center gap-3 rounded-lg border p-2.5 text-sm transition-shadow",
        isDragging
          ? "ring-ring z-10 opacity-80 shadow-lg ring-2"
          : "hover:shadow-md",
      )}
    >
      <span
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
        className="text-muted-foreground hover:text-foreground cursor-grab touch-none select-none active:cursor-grabbing"
      >
        <GripVertical className="h-4 w-4" />
      </span>

      <span className="text-muted-foreground w-6 shrink-0 text-center text-xs font-semibold tabular-nums">
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image.url}
        alt={image.name}
        className="ring-border h-12 w-12 shrink-0 rounded-md object-cover ring-1"
      />

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium break-all">{image.name}</p>
        <p className="text-muted-foreground text-xs break-all">
          <span className="font-medium">Original:</span>{" "}
          {image.originalName ?? "—"}
        </p>
        <p className="text-muted-foreground truncate text-xs">{image.path}</p>
      </div>
    </div>
  );
}
