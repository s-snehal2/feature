"use client";

import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

type PdfViewerProps = {
  file: File;
  open: boolean;
  onClose: () => void;
};

export default function PdfViewer({ file, open, onClose }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [containerWidth, setContainerWidth] = useState(800);

  useEffect(() => {
    if (!open) return;

    const updateWidth = () => {
      setContainerWidth(Math.min(window.innerWidth - 24, 1000));
    };

    updateWidth();

    window.addEventListener("resize", updateWidth);

    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/80">
      <div className="flex h-[100dvh] w-full flex-col bg-gray-100">
        {/* Header */}
        <div className="flex h-12 shrink-0 items-center justify-between border-b bg-white px-3 sm:h-14 sm:px-5">
          <p className="max-w-[80%] truncate text-sm font-medium sm:text-base">
            {file.name}
          </p>

          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 shrink-0 sm:h-9 sm:w-9"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Scrollable PDF */}
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
          <div className="flex min-h-full justify-center p-3 sm:p-5">
            <Document
              file={file}
              onLoadSuccess={({ numPages }) => {
                setNumPages(numPages);
              }}
              loading={
                <div className="py-10 text-center text-sm text-gray-500">
                  Loading PDF...
                </div>
              }
              error={
                <div className="py-10 text-center text-sm text-red-500">
                  Failed to load PDF.
                </div>
              }
            >
              <div className="flex flex-col items-center gap-4">
                {Array.from(new Array(numPages), (_, index) => (
                  <div
                    key={`page_${index + 1}`}
                    className="overflow-hidden bg-white shadow-md"
                  >
                    <Page
                      pageNumber={index + 1}
                      width={containerWidth}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                    />
                  </div>
                ))}
              </div>
            </Document>
          </div>
        </div>
      </div>
    </div>
  );
}
