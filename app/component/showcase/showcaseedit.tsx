"use client";

import { Upload, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ShowcaseEditProps {
  currentFile: File | null;
  onSave: (file: File) => void;
  onCancel: () => void;
}

export default function ShowcaseEdit({
  currentFile,
  onSave,
  onCancel,
}: ShowcaseEditProps) {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    const allowedTypes = [
      "application/pdf",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      alert("Only PDF, PPT and PPTX files are allowed.");
      return;
    }

    setFile(selectedFile);
  };

  const handleSave = () => {
    if (!file) {
      alert("Please select a file.");
      return;
    }

    onSave(file);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Edit Work Showcase</h2>

            <p className="text-sm text-muted-foreground">
              Upload a new PPT or PDF
            </p>
          </div>

          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X />
          </Button>
        </div>

        {/* Current file */}
        <div className="mb-5 rounded-lg border p-4">
          <p className="text-sm font-medium">Current File</p>

          <p className="mt-1 text-sm text-muted-foreground">
            {currentFile?.name || "No file available"}
          </p>
        </div>

        {/* Upload */}
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 text-center hover:bg-muted">
          <Upload className="mb-3 h-8 w-8" />

          <p className="font-medium">Choose PPT / PPTX / PDF</p>

          <p className="mt-1 text-sm text-muted-foreground">
            Click to browse files
          </p>

          <Input
            type="file"
            accept=".pdf,.ppt,.pptx"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {/* Selected file */}
        {file && (
          <div className="mt-4 rounded-lg bg-muted p-3 text-sm">
            Selected: <strong>{file.name}</strong>
          </div>
        )}

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>

          <Button onClick={handleSave}>Save</Button>
        </div>
      </div>
    </div>
  );
}
