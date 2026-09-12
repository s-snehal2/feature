"use client";

import React, { useState } from "react";
import { headerData } from "./data";
import { Eye, File, Heart, Play } from "lucide-react";
import { DialogIcon } from "./dialog";

function Header() {
  const [dialogOpen, setDialogOpen] = useState(false);

  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [currentFileName, setCurrentFileName] = useState("");

  const [pdfFile, setPdfFile] = useState<File | null>(null);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white/95 backdrop-blur-md">
      {headerData.map((d, index) => (
        <div
          key={index}
          className="mx-auto max-w-7xl px-3 py-2 sm:px-4 md:px-6"
        >
          <div className="block sm:landscape:hidden md:landscape:hidden xl:landscape:block">
            <div className="flex w-full items-center justify-center text-center">
              <p className="text-sm font-light sm:text-lg md:text-lg md:landscape:text-xl">
                <span className="text-foreground">{d.lotno}</span>

                <span className="mx-2 text-muted-foreground">|</span>

                <span className="font-normal text-amber-400">
                  {d.productName}
                </span>

                <span className="ml-1 text-[9px] text-muted-foreground sm:text-xs md:text-sm">
                  {d.shade}
                </span>
              </p>
            </div>

            <div className="mt-0.5 text-center text-[13px] text-gray-500 sm:text-[15px] md:text-[16px]">
              <span className="font-semibold">{d.size}</span> cms
              <span className="font-normal">&nbsp;|&nbsp;</span>
              <span className="font-semibold">{d.mm}</span> mm
              <span className="font-normal">&nbsp;|&nbsp;</span>
              <span className="font-semibold">{d.peice}</span> pcs
            </div>

            <div className="relative mt-0.5 flex w-full items-center justify-center text-[13px] text-gray-500 sm:text-[15px] md:text-[16px]">
              <div className="flex gap-1 text-[13px] font-normal text-gray-500 sm:text-[15px]">
                <span>
                  Qty: <span className="font-semibold">{d.qty}</span>
                </span>
                |
                <span>
                  H: <span className="font-semibold">{d.hold}</span>
                </span>
                |
                <span>
                  S: <span className="font-semibold">{d.sold}</span>
                </span>
                |
                <span>
                  Bal: <span className="font-semibold">{d.bal}</span> sqft
                </span>
              </div>

              <div className="absolute right-1 flex items-center gap-1.5 text-gray-500 md:right-4">
                <Play
                  size={17}
                  className="cursor-pointer"
                  onClick={() => setDialogOpen(true)}
                />

                <Eye size={17} />
                <File size={17} />
                <Heart size={17} />
              </div>
            </div>
          </div>

          <div className="hidden landscape:block xl:landscape:hidden">
            <div className="flex w-full items-center justify-center text-center">
              <p className="truncate text-sm font-light">
                <span>{d.lotno}</span>

                <span className="mx-2 text-gray-400">|</span>

                <span className="font-medium text-amber-500">
                  {d.productName}
                </span>

                <span className="ml-1 text-xs text-gray-500">{d.shade}</span>
              </p>
            </div>

            <div className="relative mt-1 flex w-full items-center justify-center">
              <div className="flex flex-wrap items-center justify-center gap-1.5 text-[13px] font-normal text-gray-500 lg:gap-0.5">
                <span>
                  <span className="font-semibold">{d.size}</span> cms
                </span>
                <span>|</span>
                <span>
                  <span className="font-semibold">{d.mm}</span> mm
                </span>
                <span>|</span>
                <span>
                  <span className="font-semibold">{d.peice}</span> pcs
                </span>
                <span>|</span>
                <span>
                  Qty: <span className="font-semibold">{d.qty}</span>
                </span>
                |
                <span>
                  H: <span className="font-semibold">{d.hold}</span>
                </span>
                |
                <span>
                  S: <span className="font-semibold">{d.sold}</span>
                </span>
                |
                <span>
                  Bal: <span className="font-semibold">{d.bal}</span> sqft
                </span>
              </div>

              <div className="absolute right-4 flex items-center gap-2 text-gray-500">
                <Play
                  size={17}
                  className="cursor-pointer"
                  onClick={() => setDialogOpen(true)}
                />

                <Eye size={16} />
                <File size={16} />
                <Heart size={16} />
              </div>
            </div>
          </div>
        </div>
      ))}

      <DialogIcon
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        currentFile={currentFile}
        currentFileName={currentFileName}
        pdfFile={pdfFile}
        setCurrentFile={setCurrentFile}
        setCurrentFileName={setCurrentFileName}
        setPdfFile={setPdfFile}
      />
    </header>
  );
}

export default Header;
