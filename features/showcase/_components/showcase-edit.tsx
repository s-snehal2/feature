"use client";

import { Loader2, UploadCloud } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useShowcaseEditor } from "@/features/showcase/hooks/use-showcase-editor";

import { DeleteImage } from "./delete-image";
import { ImagePreview } from "./image-preview";
import { PendingUploadGrid } from "./pending-upload-grid";
import { ShowcaseSelection } from "./showcase-selection";
import { StoredImageList } from "./stored-image-list";
import { UploadControls } from "./upload-controls";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChanged?: () => void;
};

export default function ShowcaseEdit({ open, onOpenChange, onChanged }: Props) {
  const {
    colors,
    color,
    quality,
    handleColorChange,
    handleQualityChange,
    replaceExisting,
    setReplaceExisting,
    pending,
    addFiles,
    removePending,
    clearPending,
    reorder,
    uploading,
    handleUpload,
    filteredStored,
    loading,
    loadError,
    refreshStored,
    deletingName,
    deleteTarget,
    handleDelete,
    confirmDelete,
    cancelDelete,
    preview,
    openPreview,
    closePreview,
    showPrev,
    showNext,
    rearrangeMode,
    draftOrder,
    savingOrder,
    canRearrange,
    startRearrange,
    cancelRearrange,
    moveStored,
    saveRearrange,
  } = useShowcaseEditor({ open, onChanged });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex h-full w-full max-w-none flex-col gap-0 overflow-hidden rounded-none border-0 p-0 sm:max-w-none"
      >
        <DialogHeader className="shrink-0 border-b px-4 py-2 text-left gap-0">
          <DialogTitle className="text-base">Edit Work Showcase</DialogTitle>

          <DialogDescription className="">
            Upload PNG / JPG / JPEG / WEBP images (max 5 MB each). Names are
            generated automatically as COLOUR-QUALITY-SERIAL, following the
            order of the images.
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-100vw space-y-4 p-4">
            <ShowcaseSelection
              color={color}
              quality={quality}
              colors={colors}
              onColorChange={handleColorChange}
              onQualityChange={handleQualityChange}
            />

            <UploadControls
              uploading={uploading}
              replaceExisting={replaceExisting}
              onFiles={addFiles}
              onReplaceChange={setReplaceExisting}
            />

            {pending.length > 0 && (
              <PendingUploadGrid
                pending={pending}
                color={color}
                quality={quality}
                uploading={uploading}
                onReorder={reorder}
                onRemove={removePending}
                onClear={clearPending}
                onPreview={openPreview}
              />
            )}

            <StoredImageList
              images={filteredStored}
              loading={loading}
              error={loadError}
              color={color}
              quality={quality}
              deletingName={deletingName}
              onRefresh={refreshStored}
              onDelete={handleDelete}
              onPreview={openPreview}
              rearrangeMode={rearrangeMode}
              draftOrder={draftOrder}
              savingOrder={savingOrder}
              canRearrange={canRearrange}
              onStartRearrange={startRearrange}
              onCancelRearrange={cancelRearrange}
              onMoveStored={moveStored}
              onSaveRearrange={saveRearrange}
            />
          </div>
        </div>

        {!rearrangeMode && (
          <DialogFooter className="shrink-0 border-t px-6 py-4 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={uploading}
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>

            <Button
              type="button"
              disabled={pending.length === 0 || uploading}
              onClick={handleUpload}
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading…
                </>
              ) : (
                <>
                  <UploadCloud className="mr-2 h-4 w-4" />
                  Upload {pending.length > 0 ? `(${pending.length})` : ""}
                </>
              )}
            </Button>
          </DialogFooter>
        )}

        <DeleteImage
          open={deleteTarget !== null}
          name={deleteTarget?.name}
          onCancel={cancelDelete}
          onConfirm={confirmDelete}
        />

        <ImagePreview
          open={preview !== null}
          items={preview?.items ?? []}
          index={preview?.index ?? 0}
          onPrev={showPrev}
          onNext={showNext}
          onClose={closePreview}
        />
      </DialogContent>
    </Dialog>
  );
}
