import React from "react";
import { headerData } from "./data";
import { Eye, File, Heart } from "lucide-react";

function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-none bg-white/95 backdrop-blur-md">
      {headerData.map((d, index) => (
        <div
          key={index}
          className="mx-auto max-w-7xl px-3 py-2 sm:px-4 md:px-6"
        >
          {/* ===================================================== */}
          {/* Portrait (Mobile + Tablet + Desktop) */}
          {/* ===================================================== */}
          <div className="landscape:hidden">
            {/* Product */}
            <div className="flex w-full items-center justify-center text-center">
              <p className="truncate text-sm font-light sm:text-xl md:text-xl lg:text-xl">
                <span className="text-foreground">{d.lotno}</span>

                <span className="mx-2 text-muted-foreground">|</span>

                <span className="font-medium text-amber-500">
                  {d.productName}
                </span>

                <span className="ml-2 text-[10px] text-muted-foreground sm:text-xs md:text-sm">
                  {d.shade}
                </span>
              </p>
            </div>

            {/* Size */}
            <div className="mt-1 text-center text-[13px] text-gray-500 sm:text-base md:text-lg">
              {d.size} &nbsp;|&nbsp; {d.mm} &nbsp;|&nbsp; {d.peice}
            </div>

            {/* Qty */}
            <div className="relative mt-1 flex w-full items-center justify-center">
              <div className="flex gap-3 text-[13px] text-gray-500 sm:text-base md:text-lg">
                <span>Qty: {d.qty}</span>
                <span>H: {d.hold}</span>
                <span>S: {d.sold}</span>
                <span>Bal: {d.bal}</span>
              </div>

              <div className="absolute right-0 flex items-center gap-2 text-gray-500">
                <Eye size={16} />
                <File size={16} />
                <Heart size={16} />
              </div>
            </div>
          </div>

          {/* ===================================================== */}
          {/* Landscape (Mobile + Tablet only) */}
          {/* ===================================================== */}
          <div className="hidden landscape:block lg:landscape:block">
            {/* First Row - SAME as portrait */}
            <div className="flex w-full items-center justify-center text-center">
              <p className="ml-2 text-sm font-light md:text-base">
                <span className="text-foreground">{d.lotno}</span>

                <span className="mx-2 text-muted-foreground">|</span>

                <span className="font-medium text-amber-500">
                  {d.productName}
                </span>

                <span className="ml-2 text-[10px] text-muted-foreground">
                  {d.shade}
                </span>
              </p>
            </div>

            {/* Second Row - Size + Qty + Icons */}
            <div className="relative mt-1 flex w-full items-center justify-center">
              <div className="flex flex-wrap items-center justify-center gap-2 text-[14px] text-gray-500">
                <span>{d.size}</span>

                <span>|</span>

                <span>{d.mm}</span>

                <span>|</span>

                <span>{d.peice}</span>
                <span>|</span>

                <span>Qty: {d.qty}</span>

                <span>H: {d.hold}</span>

                <span>S: {d.sold}</span>

                <span>Bal: {d.bal}</span>
              </div>

              <div className="absolute right-0 flex items-center gap-2 text-gray-500">
                <Eye size={15} />
                <File size={15} />
                <Heart size={15} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </header>
  );
}

export default Header;
