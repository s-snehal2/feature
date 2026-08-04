"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CategorySliderProps {
  title: string;
  images: string[];
}

export default function CategorySlider({ title, images }: CategorySliderProps) {
  const [current, setCurrent] = useState(0);

  const prev = () => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const next = () => {
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="mb-0 mt-2 w-full ">
      {/* Title */}
      <h3 className="mb-1 text-sm font-normal md:text-base landscape:md:text-sm text-muted-foreground">
        {title}
      </h3>

      {/* Fixed Card */}
      <div className="relative w-full rounded-lg border border-gray-200 bg-gray-100 shadow-sm ">
        {/* Fixed Height */}
        <div className="relative h-[230px] w-full sm:h-[300px] md:h-[400px]  landscape:sm:h-[300px] landscape:lg:h-[400px]">
          {/* Previous Button */}
          {images.length > 1 && (
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white p-2 shadow-md"
            >
              <ChevronLeft size={20} />
            </button>
          )}

          {/* Image */}
          <div className=" flex items-center justify-center overflow-hidden rounded-lg p-0">
            <Image
              src={images[current]}
              alt={title}
              fill
              className="rounded-lg p-0"
              priority
            />
          </div>

          {/* Next Button */}
          {images.length > 1 && (
            <button
              onClick={next}
              className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white p-2 shadow-md"
            >
              <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Counter */}
      <p className="mt-2 text-center text-xs text-gray-500">
        {current + 1} of {images.length}
      </p>
    </div>
  );
}
