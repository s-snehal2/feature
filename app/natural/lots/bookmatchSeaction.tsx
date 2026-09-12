"use client";

import { useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

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
  const [api, setApi] = useState<CarouselApi>();

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
        { img: 0, transform: "rotate(180deg) scale(1.2) scaleX(-1)" },
        { img: 1, transform: "rotate(180deg) scale(1.2)" },
        { img: 2, transform: "rotate(360deg) scale(1.2)" },
        { img: 3, transform: "rotate(360deg) scale(1.2) scaleX(-1)" },
      ],
    },
    {
      type: "grid4",
      items: [
        { img: 0, transform: "rotate(180deg) scale(1.2) scaleY(-1)" },
        { img: 1, transform: "rotate(360deg) scale(1.2)" },
        { img: 2, transform: "rotate(180deg) scale(1.2)" },
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
        { img: 0, transform: "rotate(180deg) scale(1.2)" },
        { img: 1, transform: "rotate(0deg) scale(1.2) scaleX(-1)" },
        { img: 2, transform: "rotate(180deg) scale(1.2) scaleY(-1)" },
        { img: 3, transform: "rotate(0deg) scale(1.2)" },
      ],
    },
  ];

  return (
    <div className="w-full">
      <div className="mb-1 flex items-center justify-between">
        <h3 className="text-sm font-normal text-muted-foreground md:text-base">
          Bookmatches
        </h3>
      </div>

      <Card className="overflow-hidden rounded-xl p-0">
        <Carousel
          opts={{ loop: false }}
          setApi={(carouselApi) => {
            if (!carouselApi) return;

            setCurrentSlide(carouselApi.selectedScrollSnap());

            carouselApi.on("select", () => {
              setCurrentSlide(carouselApi.selectedScrollSnap());
            });
          }}
        >
          <CarouselContent>
            {slideLayouts.map((layout, slideIndex) => (
              <CarouselItem key={slideIndex}>
                <div className="h-[230px] w-full sm:h-[300px] md:h-[400px] landscape:sm:h-[300px] landscape:lg:h-[400px]">
                  {/* ---------- Grid 4 ---------- */}
                  {layout.type === "grid4" && (
                    <div className="grid h-full grid-cols-2">
                      {layout.items.map((item, i) => (
                        <div
                          key={i}
                          className="relative h-full overflow-hidden"
                        >
                          <Image
                            src={images[item.img]}
                            alt={`Bookmatch ${i + 1}`}
                            fill
                            className="w-full p-2 md:p-4 lg:p-4 xl:p-4 landscape:p-3"
                            style={{
                              transform: item.transform,
                              transformOrigin: "center",
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* ---------- Grid 2 ---------- */}
                  {layout.type === "grid2" && (
                    <div className="grid h-full grid-cols-3">
                      {layout.items.map((item, i) => (
                        <div
                          key={i}
                          className="relative h-full overflow-hidden"
                        >
                          <Image
                            src={images[item.img]}
                            alt={`Bookmatch ${i + 1}`}
                            fill
                            className="object-contain"
                            style={{
                              transform: item.transform,
                              transformOrigin: "center",
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* ---------- Interactive ---------- */}
                  {layout.type === "interactive" && (
                    <div className="grid h-full grid-cols-2">
                      {layout.items.map((item, i) => (
                        <div
                          key={i}
                          onClick={() => rotateImage(i)}
                          className="relative h-full cursor-pointer overflow-hidden"
                        >
                          <Image
                            src={images[item.img]}
                            alt={`Bookmatch ${i + 1}`}
                            fill
                            className="w-full p-2 md:p-4 lg:p-4 xl:p-4 landscape:p-3 transition-transform duration-500"
                            style={{
                              transform: `${item.transform} rotate(${rotation[i]}deg)`,
                              transformOrigin: "center",
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="left-3 z-20 h-10 w-10 bg-white shadow-md" />

          <CarouselNext className="right-3 z-20 h-10 w-10 bg-white shadow-md" />
        </Carousel>
      </Card>

      <p className="mt-3 text-center text-sm text-gray-500">
        {currentSlide + 1} of {totalSlides}
      </p>
    </div>
  );
}
