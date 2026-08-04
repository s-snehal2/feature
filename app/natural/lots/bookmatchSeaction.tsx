// BookMatchSection.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BookMatchSectionProps {
  images: string[];
}

type LayoutType = "grid2" | "grid4" | "interactive";

interface LayoutItem {
  img: number;
  transform?: string;
}

export default function BookMatchSection({ images }: BookMatchSectionProps) {
  const totalSlides = 7;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [rotation, setRotation] = useState<number[]>(images.map(() => 0));

  const rotateImage = (index: number) => {
    setRotation((prev) => {
      const next = [...prev];
      next[index] = next[index] === 0 ? 180 : 0;
      return next;
    });
  };

  const slideLayouts: {
    type: LayoutType;
    items: LayoutItem[];
  }[] = [
    {
      type: "grid4",
      items: [
        { img: 0, transform: "rotate(0deg) scale(1.2)" },
        { img: 1, transform: "rotate(180deg) scale(1.2) scaleY(-1)" },
        { img: 2, transform: "rotate(180deg) scale(1.2) scaleX(-1)" },
        { img: 3, transform: "rotate(180deg) scale(1.2)" },
      ],
    },
    {
      type: "grid4",
      items: [
        { img: 0, transform: "rotate(180deg) scale(1.2 )scaleX(-1)" },
        { img: 1, transform: "rotate(180deg) scale(1.2) scaleX(1)" },
        { img: 2, transform: "rotate(360deg) scale(1.2) scaleX(1)" },
        { img: 3, transform: "rotate(360deg) scale(1.2) scaleX(-1)" },
      ],
    },
    {
      type: "grid4",
      items: [
        { img: 0, transform: "rotate(180deg) scale(1.2) scaleY(-1)" },
        { img: 1, transform: "rotate(360deg) scale(1.2) scaleX(1)" },
        { img: 2, transform: "rotate(180deg) scale(1.2) scaleY(1)" },
        { img: 3, transform: "rotate(360deg) scale(1.2) scaleY(-1)" },
      ],
    },
    {
      type: "grid4",
      items: [
        { img: 0, transform: "rotate(180deg) scale(1.2)" },
        { img: 1, transform: "rotate(180deg) scale(1.2) scaleX(-1)" },
        { img: 2, transform: "rotate(180deg) scale(1.2) scaleY(-1)" },
        { img: 3, transform: "rotate(0deg) scale(1.2)" },
      ],
    },
    {
      type: "grid2",
      items: [
        { img: 2, transform: "rotate(270deg) scale(1.8) scaleX(-1)" },
        { img: 2, transform: "rotate(90deg) scale(1.8)" },
      ],
    },
    {
      type: "grid2",
      items: [
        { img: 2, transform: "rotate(90deg) scale(1.8)" },
        { img: 1, transform: "rotate(270deg) scale(1.8) scaleX(-1)" },
      ],
    },

    {
      type: "interactive",
      items: [
        { img: 0, transform: "rotate(180deg) scale(1.5)" },
        { img: 1, transform: "rotate(0deg) scale(1.5) scaleX(-1)" },
        { img: 2, transform: "rotate(180deg) scale(1.5) scaleY(-1)" },
        { img: 3, transform: "rotate(0deg) scale(1.5)" },
      ],
    },
  ];

  const layout = slideLayouts[currentSlide];

  return (
    <div className="w-full">
      <div className="mb-1 flex items-center justify-between">
        <h3 className=" text-sm font-normal md:text-base text-muted-foreground">
          Bookmatches
        </h3>
      </div>

      <Card className="relative rounded-xl p-0 overflow-hidden  h-[230px] w-full sm:h-[300px] md:h-[400px]  landscape:sm:h-[300px] landscape:lg:h-[400px] ">
        <button
          onClick={() =>
            setCurrentSlide(
              currentSlide === 0 ? totalSlides - 1 : currentSlide - 1,
            )
          }
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white p-2 shadow"
        >
          <ChevronLeft size={20} />
        </button>

        <button
          onClick={() => setCurrentSlide((currentSlide + 1) % totalSlides)}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white p-2 shadow"
        >
          <ChevronRight size={20} />
        </button>

        {layout.type === "grid4" && (
          <div className="grid h-full  grid-cols-2 ">
            {layout.items.map((item, i) => (
              <div
                key={i}
                className="relative h-full overflow-hidden  border-none"
              >
                <Image
                  src={images[item.img]}
                  alt=""
                  fill
                  className=" p-2 md:p-4 lg:p-4 xl:p-4 landscape:p-3  w-full"
                  style={{
                    transform: item.transform,
                    transformOrigin: "center",
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {layout.type === "grid2" && (
          <div className="grid h-full  grid-cols-3 ">
            {layout.items.map((item, i) => (
              <div key={i} className="relative h-full overflow-hidden p-0">
                <Image
                  src={images[item.img]}
                  alt=""
                  fill
                  className="object-contain w-full"
                  style={{
                    transform: item.transform,
                    transformOrigin: "center",
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {layout.type === "interactive" && (
          <div className="grid h-full grid-cols-2 ">
            {layout.items.map((item, i) => (
              <div key={i} className="relative h-full overflow-hidden border">
                <Image
                  src={images[item.img]}
                  alt=""
                  fill
                  className="object-contain w-full"
                  style={{
                    transform: item.transform,
                    transformOrigin: "center",
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </Card>

      <p className="mt-3 text-center text-sm text-gray-500">
        {currentSlide + 1} of {totalSlides}
      </p>
    </div>
  );
}
