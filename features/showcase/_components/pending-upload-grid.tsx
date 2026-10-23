"use client";

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { Eye, Images } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { buildTargetName } from "@/features/showcase/lib/upload";
import type { PendingUpload, PreviewItem } from "@/features/showcase/types";

import { Section } from "./section";
import { SortableThumbnail } from "./sortable-thumbnail";

type Props = {
  pending: PendingUpload[];
  color: string;
  quality: string;
  uploading: boolean;
  onReorder: (next: PendingUpload[]) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  onPreview: (items: PreviewItem[], index: number) => void;
};

/** Header, Clear button, and the drag-to-reorder grid of pending tiles. */
export function PendingUploadGrid({
  pending,
  color,
  quality,
  uploading,
  onReorder,
  onRemove,
  onClear,
  onPreview,
}: Props) {
  const previewItems: PreviewItem[] = pending.map((item, index) => ({
    url: item.previewUrl,
    name: buildTargetName(color, quality, index, item.file),
    originalName: item.file.name,
  }));

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = pending.findIndex((item) => item.id === active.id);
    const newIndex = pending.findIndex((item) => item.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    onReorder(arrayMove(pending, oldIndex, newIndex));
  };

  return (
    <Section
      icon={Images}
      title="Ready to upload"
      description="Drag tiles to reorder. Names follow this order."
      badge={<Badge variant="secondary">{pending.length}</Badge>}
      actions={
        <>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={pending.length === 0}
            onClick={() => onPreview(previewItems, 0)}
          >
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={uploading}
            onClick={onClear}
          >
            Clear
          </Button>
        </>
      }
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={pending.map((item) => item.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {pending.map((item, index) => (
              <SortableThumbnail
                key={item.id}
                item={item}
                index={index}
                name={buildTargetName(color, quality, index, item.file)}
                disabled={uploading}
                onRemove={onRemove}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </Section>
  );
}
