"use client";

import { useState } from "react";
import { FileText, Upload, Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import { jsPDF } from "jspdf";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PdfViewer = dynamic(() => import("./pdfviewer"), {
  ssr: false,
});

type DialogIconProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  currentFile: File | null;
  currentFileName: string;
  pdfFile: File | null;

  setCurrentFile: React.Dispatch<React.SetStateAction<File | null>>;
  setCurrentFileName: React.Dispatch<React.SetStateAction<string>>;
  setPdfFile: React.Dispatch<React.SetStateAction<File | null>>;
};

export function DialogIcon({
  open,
  onOpenChange,
  currentFile,
  currentFileName,
  pdfFile,
  setCurrentFile,
  setCurrentFileName,
  setPdfFile,
}: DialogIconProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [pdfViewerOpen, setPdfViewerOpen] = useState(false);
  const [converting, setConverting] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  // PDF / PPTX selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const extension = file.name.split(".").pop()?.toLowerCase();

    if (extension !== "pdf" && extension !== "pptx") {
      alert("Please upload a PDF or PPTX file.");
      return;
    }

    setCurrentFile(file);
    setCurrentFileName(file.name);
    setImageFiles([]);
    setPdfFile(null);

    event.target.value = "";
  };

  // Image folder selection
  const handleFolderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    const images = files.filter((file) =>
      ["image/png", "image/jpeg", "image/jpg"].includes(file.type),
    );

    if (images.length === 0) {
      alert("No PNG or JPG images found.");
      return;
    }

    images.sort((a, b) =>
      a.name.localeCompare(b.name, undefined, {
        numeric: true,
      }),
    );

    setImageFiles(images);
    setCurrentFile(null);
    setCurrentFileName(`${images.length} images`);
    setPdfFile(null);

    event.target.value = "";
  };

  // Open Edit
  const handleEdit = () => {
    onOpenChange(false);
    setEditOpen(true);
  };

  // Open Viewer
  const handleView = () => {
    if (!pdfFile) {
      alert("Please upload and save a file first.");
      return;
    }

    onOpenChange(false);
    setPdfViewerOpen(true);
  };

  // Convert PPTX to PDF
  const convertPptxToPdf = async (file: File) => {
    const formData = new FormData();

    formData.append("file", file);

    const response = await fetch("/api/pptx-to-pdf", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to convert PPTX to PDF.");
    }

    const blob = await response.blob();

    return new File([blob], file.name.replace(/\.pptx$/i, ".pdf"), {
      type: "application/pdf",
    });
  };

  // Convert images to PDF
  const convertImagesToPdf = async (images: File[]) => {
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: "a4",
    });

    for (let i = 0; i < images.length; i++) {
      const image = images[i];

      const url = URL.createObjectURL(image);
      const img = new Image();

      img.src = url;

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Failed to load image."));
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const ratio = Math.min(pageWidth / img.width, pageHeight / img.height);

      const width = img.width * ratio;
      const height = img.height * ratio;

      const x = (pageWidth - width) / 2;
      const y = (pageHeight - height) / 2;

      if (i > 0) {
        pdf.addPage();
      }

      pdf.addImage(
        img,
        image.type === "image/png" ? "PNG" : "JPEG",
        x,
        y,
        width,
        height,
      );

      URL.revokeObjectURL(url);
    }

    const blob = pdf.output("blob");

    return new File([blob], "image-folder.pdf", {
      type: "application/pdf",
    });
  };

  // Save
  const handleSave = async () => {
    if (!currentFile && imageFiles.length === 0) {
      alert("Please select a file or image folder.");
      return;
    }

    try {
      setConverting(true);

      let pdf: File;

      if (imageFiles.length > 0) {
        pdf = await convertImagesToPdf(imageFiles);
        setCurrentFileName(`${imageFiles.length} images`);
      } else if (currentFile) {
        const extension = currentFile.name.split(".").pop()?.toLowerCase();

        if (extension === "pdf") {
          pdf = currentFile;
        } else {
          pdf = await convertPptxToPdf(currentFile);
        }
      } else {
        return;
      }

      setPdfFile(pdf);
      setEditOpen(false);
      onOpenChange(true);
    } catch (error) {
      console.error(error);
      alert("Failed to save file.");
    } finally {
      setConverting(false);
    }
  };

  return (
    <>
      {/* Main Dialog */}

      <Dialog open={open && !pdfViewerOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Work Showcase</DialogTitle>
            <DialogDescription>Choose an option</DialogDescription>
          </DialogHeader>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              className="flex-1 bg-yellow-400 text-black hover:bg-yellow-500"
              onClick={handleEdit}
            >
              Edit
            </Button>

            <Button
              type="button"
              variant="outline"
              className="flex-1"
              disabled={!pdfFile}
              onClick={handleView}
            >
              View
            </Button>
          </div>

          {pdfFile ? (
            <p className="mt-2 text-center text-xs text-green-600">
              ✓ PDF ready to view
            </p>
          ) : (
            <p className="mt-2 text-center text-xs text-gray-500">
              Upload a PDF, PPTX, or image folder using Edit.
            </p>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit Work Showcase</DialogTitle>

            <DialogDescription>
              Upload a PDF, PPTX, or image folder
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <Field>
              <Label>Current File</Label>

              <div className="rounded-xl border p-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-gray-500" />

                  <div className="min-w-0">
                    <p className="font-medium">Current File</p>

                    <p className="truncate text-sm text-gray-500">
                      {currentFileName || "No file available"}
                    </p>
                  </div>
                </div>
              </div>
            </Field>

            <Field>
              <Label>Upload</Label>

              <div className="grid gap-3 sm:grid-cols-2">
                {/* PDF / PPTX */}

                <label
                  htmlFor="file-upload"
                  className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 hover:bg-gray-50"
                >
                  <FileText className="mb-2 h-6 w-6" />

                  <span className="font-medium">Choose File</span>

                  <span className="text-xs text-gray-500">PDF or PPTX</span>

                  <Input
                    id="file-upload"
                    type="file"
                    accept=".pdf,.pptx"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>

                {/* Image Folder */}

                <label
                  htmlFor="folder-upload"
                  className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 hover:bg-gray-50"
                >
                  <Upload className="mb-2 h-6 w-6" />

                  <span className="font-medium">Choose Image Folder</span>

                  <span className="text-xs text-gray-500">PNG or JPG</span>

                  <input
                    id="folder-upload"
                    type="file"
                    multiple
                    className="hidden"
                    {...({
                      webkitdirectory: "",
                    } as React.InputHTMLAttributes<HTMLInputElement>)}
                    onChange={handleFolderChange}
                  />
                </label>
              </div>

              {currentFileName && (
                <p className="mt-3 text-sm text-gray-600">
                  Selected: {currentFileName}
                </p>
              )}

              {imageFiles.length > 0 && (
                <p className="mt-1 text-sm text-gray-600">
                  {imageFiles.length} images selected
                </p>
              )}
            </Field>
          </FieldGroup>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={converting}>
                Cancel
              </Button>
            </DialogClose>

            <Button
              type="button"
              onClick={handleSave}
              disabled={(!currentFile && imageFiles.length === 0) || converting}
              className="bg-yellow-400 text-black hover:bg-yellow-500"
            >
              {converting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Converting...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* React PDF Viewer */}

      {pdfViewerOpen && pdfFile && (
        <PdfViewer
          file={pdfFile}
          open={pdfViewerOpen}
          onClose={() => {
            setPdfViewerOpen(false);
            onOpenChange(true);
          }}
        />
      )}
    </>
  );
}

export default DialogIcon;
