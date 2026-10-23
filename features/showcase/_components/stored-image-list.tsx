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
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  Database,
  Eye,
  GripVertical,
  ImageOff,
  Loader2,
  RefreshCw,
  Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import type { PreviewItem, StoredImage } from "@/features/showcase/types";

import { Section } from "./section";
import { SortableStoredRow } from "./sortable-stored-row";

type Props = {
  images: StoredImage[];
  loading: boolean;
  error: string | null;
  color: string;
  quality: string;
  deletingName: string | null;
  onRefresh: () => void;
  onDelete: (image: StoredImage) => void;
  onPreview: (items: PreviewItem[], index: number) => void;
  rearrangeMode: boolean;
  draftOrder: StoredImage[];
  savingOrder: boolean;
  canRearrange: boolean;
  onStartRearrange: () => void;
  onCancelRearrange: () => void;
  onMoveStored: (from: number, to: number) => void;
  onSaveRearrange: () => void;
};

function toPreviewItems(images: StoredImage[]): PreviewItem[] {
  return images.map((image) => ({
    url: image.url,
    name: image.name,
    originalName: image.originalName,
  }));
}

/** Header + Refresh, load/empty states, the stored rows, and rearrange mode. */
export function StoredImageList({
  images,
  loading,
  error,
  color,
  quality,
  deletingName,
  onRefresh,
  onDelete,
  onPreview,
  rearrangeMode,
  draftOrder,
  savingOrder,
  canRearrange,
  onStartRearrange,
  onCancelRearrange,
  onMoveStored,
  onSaveRearrange,
}: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const from = draftOrder.findIndex((image) => image.name === active.id);
    const to = draftOrder.findIndex((image) => image.name === over.id);
    if (from === -1 || to === -1) return;

    onMoveStored(from, to);
  };

  return (
    <Section
      icon={Database}
      title="Stored images"
      description={
        color || quality ? `Files for ${color} / ${quality}.` : undefined
      }
      badge={<Badge variant="secondary">{images.length}</Badge>}
      actions={
        <>
          {canRearrange && !rearrangeMode && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onStartRearrange}
            >
              <GripVertical className="mr-2 h-4 w-4" />
              Rearrange
            </Button>
          )}

          {!rearrangeMode && (
            <>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={loading || images.length === 0}
                onClick={() => onPreview(toPreviewItems(images), 0)}
              >
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={loading}
                onClick={onRefresh}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </>
          )}
        </>
      }
    >
      {error && (
        <p className="border-destructive/30 bg-destructive/10 text-destructive mb-3 rounded-lg border p-3 text-sm">
          {error}
        </p>
      )}

      {rearrangeMode ? (
        <div className="space-y-3">
          <p className="text-muted-foreground text-xs">
            Drag rows to set the order. On save, serial numbers{" "}
            <span className="text-foreground font-medium">
              01–{draftOrder.length}
            </span>{" "}
            are assigned by renaming the stored files.
          </p>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={draftOrder.map((image) => image.name)}
              strategy={verticalListSortingStrategy}
            >
              <div className="max-h-80 space-y-2 overflow-y-auto pr-3">
                {draftOrder.map((image, index) => (
                  <SortableStoredRow
                    key={image.name}
                    image={image}
                    index={index}
                    disabled={savingOrder}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          <div className="relative z-10 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={savingOrder}
              onClick={onCancelRearrange}
            >
              Cancel
            </Button>

            <Button
              type="button"
              size="sm"
              disabled={savingOrder}
              onClick={onSaveRearrange}
            >
              {savingOrder ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : (
                "Save order"
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-16 w-full rounded-lg" />
            ))
          ) : images.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
              <ImageOff className="text-muted-foreground h-8 w-8" />
              <p className="text-muted-foreground text-sm">
                No images for {color} / {quality}.
              </p>
            </div>
          ) : (
            images.map((image) => (
              <div
                key={image.name}
                className="bg-card hover:bg-accent/50 flex items-center gap-3 rounded-lg border p-2.5 text-sm transition-colors"
              >
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
                  <p className="text-muted-foreground truncate text-xs">
                    {image.path}
                  </p>
                </div>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={deletingName === image.name}
                      onClick={() => onDelete(image)}
                      aria-label={`Delete ${image.name}`}
                      className="text-muted-foreground hover:text-destructive shrink-0"
                    >
                      {deletingName === image.name ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Delete</TooltipContent>
                </Tooltip>
              </div>
            ))
          )}
        </div>
      )}
    </Section>
  );
}
