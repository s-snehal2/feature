"use client";

import { useEffect, useState } from "react";
import { Upload, Loader2, FileText } from "lucide-react";
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
import { Label } from "@/components/ui/label";

const PdfViewer = dynamic(() => import("./pdfviewer"), {
  ssr: false,
});

type DialogIconProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  currentFileName: string;
  pdfFile: File | null;

  setCurrentFileName: React.Dispatch<React.SetStateAction<string>>;
  setPdfFile: React.Dispatch<React.SetStateAction<File | null>>;
};

export function DialogIcon({
  open,
  onOpenChange,
  currentFileName,
  pdfFile,
  setCurrentFileName,
  setPdfFile,
}: DialogIconProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [pdfViewerOpen, setPdfViewerOpen] = useState(false);
  const [converting, setConverting] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  // Select image folder
  const handleFolderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    const images = files.filter((file) =>
      ["image/png", "image/jpeg", "image/jpg"].includes(file.type),
    );

    if (images.length === 0) {
      alert("No PNG or JPG images found.");
      return;
    }

    // Sort images naturally: 1, 2, 3, 10...
    images.sort((a, b) =>
      a.name.localeCompare(b.name, undefined, {
        numeric: true,
      }),
    );

    setImageFiles(images);
    setCurrentFileName(`${images.length} images`);

    // Remove old PDF
    setPdfFile(null);

    event.target.value = "";
  };

  // Open Edit
  const handleEdit = () => {
    onOpenChange(false);
    setEditOpen(true);
  };

  // Open PDF Viewer
  const handleView = () => {
    if (!pdfFile) {
      alert("Please select an image folder and save it first.");
      return;
    }

    onOpenChange(false);
    setPdfViewerOpen(true);
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
        img.onerror = () => reject(new Error(`Failed to load ${image.name}`));
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Fit image inside PDF page
      const ratio = Math.min(pageWidth / img.width, pageHeight / img.height);

      const width = img.width * ratio;
      const height = img.height * ratio;

      const x = (pageWidth - width) / 2;
      const y = (pageHeight - height) / 2;

      // Add new page after first image
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
    if (imageFiles.length === 0) {
      alert("Please select an image folder first.");
      return;
    }

    try {
      setConverting(true);

      // Convert folder images → PDF
      const pdf = await convertImagesToPdf(imageFiles);

      // Store generated PDF
      setPdfFile(pdf);

      setCurrentFileName(`${imageFiles.length} images`);

      // Close Edit
      setEditOpen(false);

      // Open main dialog
      onOpenChange(true);
    } catch (error) {
      console.error(error);
      alert("Failed to convert images to PDF.");
    } finally {
      setConverting(false);
    }
  };

  // Load default showcase folder
  useEffect(() => {
    const loadDefaultFolder = async () => {
      try {
        const imageNames = [
          "Slide1.png",
          "Slide2.png",
          "Slide3.png",
          "Slide4.png",
          "Slide5.png",
          "Slide6.png",
          "Slide7.png",
          "Slide8.png",
        ];

        const files: File[] = [];

        for (const name of imageNames) {
          const response = await fetch(`/acqua-bella/${name}`);

          if (!response.ok) {
            throw new Error(`Failed to load ${name}`);
          }

          const blob = await response.blob();

          files.push(
            new File([blob], name, {
              type: blob.type,
            }),
          );
        }

        setImageFiles(files);
        setCurrentFileName(`${files.length} images`);

        const pdf = await convertImagesToPdf(files);

        setPdfFile(pdf);
      } catch (error) {
        console.error("Failed to load default showcase:", error);
      }
    };

    loadDefaultFolder();
  }, []);
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
              Select an image folder using Edit.
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
              Select a folder containing PNG or JPG images
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <Field>
              <Label>Current Showcase</Label>

              <div className="rounded-xl border p-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-gray-500" />

                  <div className="min-w-0">
                    <p className="font-medium">Image Folder</p>

                    <p className="truncate text-sm text-gray-500">
                      {currentFileName || "No folder selected"}
                    </p>
                  </div>
                </div>
              </div>
            </Field>

            <Field>
              <Label>Upload Image Folder</Label>

              <label
                htmlFor="folder-upload"
                className="flex h-40 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 transition hover:bg-gray-50"
              >
                <Upload className="mb-3 h-8 w-8" />

                <span className="font-medium">Choose Image Folder</span>

                <span className="mt-1 text-xs text-gray-500">
                  PNG or JPG images
                </span>

                <input
                  id="folder-upload"
                  type="file"
                  multiple
                  accept="image/png,image/jpeg"
                  className="hidden"
                  {...({
                    webkitdirectory: "",
                  } as React.InputHTMLAttributes<HTMLInputElement>)}
                  onChange={handleFolderChange}
                />
              </label>

              {imageFiles.length > 0 && (
                <p className="mt-3 text-sm text-gray-600">
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
              disabled={imageFiles.length === 0 || converting}
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

      {/* PDF Viewer */}

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
