import React from "react";
import { headerData } from "./data";
import { Eye, File, Heart } from "lucide-react";

function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white/95 backdrop-blur-md">
      {headerData.map((d, index) => (
        <div
          key={index}
          className="mx-auto max-w-7xl px-3 py-2 sm:px-4 md:px-6"
        >
          {/* ===================================================== */}
          {/* Portrait Layout (Default + Desktop) */}
          {/* ===================================================== */}
          <div className="block max-lg:landscape:hidden">
            {/* Product */}
            <div className="flex w-full items-center justify-center text-center">
              <p className="truncate text-sm font-light sm:text-lg md:text-xl md:landscape:text-2xl">
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

            {/* Size */}
            <div className="mt-0.5 text-center text-[13px] text-gray-500 sm:text-[15px] md:text-[16px]">
              <span className="font-semibold">{d.size}</span> cms
              <span className="font-normal">&nbsp;|&nbsp;</span>
              <span className="font-semibold">{d.mm}</span> mm
              <span className="font-normal">&nbsp;|&nbsp;</span>
              <span className="font-semibold">{d.peice}</span> pcs
            </div>

            {/* Qty */}
            <div className="mt-0.5 text-center text-[13px] text-gray-500 sm:text-[15px] md:text-[16px]  flex w-full items-center justify-center">
              <div className="flex gap-2 text-[13px] text-gray-500 sm:text-[15px] font-normal">
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

              <div className="absolute right-1 md:right-4 flex items-center gap-2 text-gray-500">
                <Eye size={17} />
                <File size={17} />
                <Heart size={17} />
              </div>
            </div>
          </div>

          {/* ===================================================== */}
          {/* Landscape Layout (Mobile + Tablet ONLY) */}
          {/* ===================================================== */}
          <div className="hidden max-lg:landscape:block">
            {/* First Row */}
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

            {/* Second Row */}
            <div className="relative mt-1 flex w-full items-center justify-center">
              <div className="flex flex-wrap items-center justify-center gap-1.5 lg:gap-0.5 text-[13px] text-gray-500 font-normal">
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
                <Eye size={16} />
                <File size={16} />
                <Heart size={16} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </header>
  );
}

export default Header;
