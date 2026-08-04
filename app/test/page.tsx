"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import CardSection from "../gallery-screen/card-section/cardsection";

const images = [
  "/cmc-images/image1.webp",
  "/cmc-images/image2.webp",
  "/cmc-images/image3.webp",
  "/cmc-images/image4.webp",
  "/cmc-images/image5.webp",
  "/cmc-images/image6.webp",
  "/cmc-images/image8.webp",
  "/cmc-images/image9.webp",
];

export default function StaticScreen() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const duration = 5000;

  const firstBatchCount = 3;

  useEffect(() => {
    if (paused || index >= firstBatchCount) return;
    const timer = setTimeout(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, duration);
    return () => clearTimeout(timer);
  }, [index, paused]);

  useEffect(() => {
    if (!showControls) return;
    const timer = setTimeout(() => setShowControls(false), 3000);
    return () => clearTimeout(timer);
  }, [showControls]);

  const nextImage = () => setIndex((prev) => (prev + 1) % images.length);
  const prevImage = () =>
    setIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="relative w-full">
      <div
        className="relative w-full h-screen overflow-hidden"
        onClick={() => setShowControls(true)}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            prevImage();
          }}
          className="absolute left-2 sm:left-4 top-1/2 z-10 -translate-y-1/2 hover:bg-black/40 rounded-full p-1 sm:p-2"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            nextImage();
          }}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 hover:bg-black/40 rounded-full p-1 sm:p-2"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </Button>

        {showControls && (
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              setPaused((p) => !p);
            }}
            className="absolute z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 rounded-full p-2 sm:p-3"
          >
            {paused ? (
              <Play className="w-5 h-5 sm:w-7 sm:h-7" />
            ) : (
              <Pause className="w-5 h-5 sm:w-7 sm:h-7" />
            )}
          </Button>
        )}

        {/* Slideshow Image */}
        <motion.div
          key={images[index]}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <Image
            src={images[index]}
            alt={`Slide ${index + 1}`}
            fill
            priority
            className="object-contain lg:object-fill p-2 sm:p-4"
            onClick={(e) => {
              setShowControls(true);
              e.stopPropagation();
              setPaused((p) => !p);
            }}
          />
          {index === firstBatchCount && (
            <div className="w-full  bg-gray-50">
              <CardSection />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
