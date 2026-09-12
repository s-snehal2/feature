"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface CategorySliderProps {
  title: string;
  images: string[];
}

export default function CategorySlider({ title, images }: CategorySliderProps) {
  const [current, setCurrent] = useState(0);

  return (
    <div className="mt-2 mb-0 w-full">
      {/* Title */}
      <h3 className="mb-1 text-sm font-normal text-muted-foreground md:text-base landscape:md:text-sm">
        {title}
      </h3>

      {/* Card */}
      <div className="relative w-full rounded-lg border border-gray-200 bg-gray-100 shadow-sm">
        <Carousel
          opts={{ loop: false }}
          setApi={(api) => {
            if (!api) return;

            setCurrent(api.selectedScrollSnap());

            api.on("select", () => {
              setCurrent(api.selectedScrollSnap());
            });
          }}
        >
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="relative h-[230px] w-full sm:h-[300px] md:h-[400px]   landscape:sm:h-[300px] landscape:lg:h-[400px]">
                  <Image
                    src={image}
                    alt={`${title}-${index + 1}`}
                    fill
                    priority={index === 0}
                    className="rounded-lg"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {images.length > 1 && (
            <>
              <CarouselPrevious className="left-3 z-20 h-10 w-10 border bg-white shadow-md" />
              <CarouselNext className="right-3 z-20 h-10 w-10 border bg-white shadow-md" />
            </>
          )}
        </Carousel>
      </div>

      {/* Counter */}
      <p className="mt-2 text-center text-xs text-gray-500">
        {current + 1} of {images.length}
      </p>
    </div>
  );
}
