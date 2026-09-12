"use client";

import { Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShowcaseViewerProps {
  file: File | null;
  authorized: boolean;
  onClose: () => void;
  onEdit: () => void;
}

export default function ShowcaseViewer({
  file,
  authorized,
  onClose,
  onEdit,
}: ShowcaseViewerProps) {
  if (!file) return null;

  const fileUrl = URL.createObjectURL(file);

  const isPdf = file.type === "application/pdf";

  return (
    <div className="fixed inset-0 z-50 bg-black/70 p-4">
      <div className="mx-auto flex h-full max-w-6xl flex-col overflow-hidden rounded-xl bg-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div>
            <h2 className="font-semibold">{file.name}</h2>
            <p className="text-sm text-muted-foreground">Work Showcase</p>
          </div>

          <div className="flex gap-2">
            {authorized && (
              <Button variant="outline" onClick={onEdit}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Button>
            )}

            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Viewer */}
        <div className="flex flex-1 items-center justify-center bg-muted p-4">
          {isPdf ? (
            <iframe
              src={fileUrl}
              className="h-full w-full rounded-lg bg-white"
              title="PDF Viewer"
            />
          ) : (
            <div className="rounded-xl border bg-white p-10 text-center shadow-sm">
              <p className="text-lg font-semibold">PowerPoint file selected</p>

              <p className="mt-2 text-sm text-muted-foreground">
                PPT/PPTX will be converted to PDF in the backend.
              </p>

              <p className="mt-4 text-sm">{file.name}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
