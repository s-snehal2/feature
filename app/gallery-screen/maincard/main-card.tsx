"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { carddata } from "../data";
import { CirclePlay } from "lucide-react";

export default function MainCard() {
  const imageSections = carddata.filter((d) => !d.code);
  const cardSections = carddata.filter((d) => d.code);

  const topImages = imageSections.slice(0, imageSections.length - 4);
  const bottomImages = imageSections.slice(-4);

  return (
    <div className="w-screen h-screen ">
      {topImages.map((d) => (
        <motion.div
          key={d.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative h-[40vh] md:h-[50vh] lg:h-screen"
        >
          <Image
            src={d.image}
            alt={d.title}
            fill
            priority
            className="p-1 md:p-2"
          />
        </motion.div>
      ))}

      <div className="p-2 grid grid-cols-1 lg:grid-cols-2 gap-2">
        {cardSections.map((card) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="relative bg-[#F1E2D2] ">
              <CardHeader className="space-y-1">
                <CardTitle className="text-center text-base md:text-lg">
                  {card.title}
                </CardTitle>
                <div className="absolute  top-15 right-1 md:right-2">
                  <CirclePlay className="w-7 h-7  hover:scale-110 transition-transform duration-200" />
                </div>

                <div className="text-lg text-center">
                  {card.code} | {card.size} | {card.area}
                </div>

                <div className="text-xs md:text-lg text-center">{card.req}</div>
              </CardHeader>

              <CardContent className="relative w-full h-[35vh]">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-fill h-[80vh]"
                />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {bottomImages.map((d) => (
        <motion.div
          key={d.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative h-[40vh] md:h-[50vh] lg:h-screen"
        >
          <Image src={d.image} alt={d.title} fill className=" p-1 md:p-2" />
        </motion.div>
      ))}
    </div>
  );
}
