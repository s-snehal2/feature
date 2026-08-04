"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { carddata } from "../data";
import { CirclePlay } from "lucide-react";

export default function MainCardV2() {
  const imageSections = carddata.filter((d) => !d.code);
  const cardSections = carddata.filter((d) => d.code);

  const topImages = imageSections.slice(0, imageSections.length - 4);
  const bottomImages = imageSections.slice(-4);

  return (
    <div className="w-screen h-screen ">
      {topImages.map((d) => (
        <motion.div
          key={d.id}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{}}
          className="relative h-[40vh] md:h-[80vh] lg:h-screen"
        >
          <Image src={d.image} alt={d.title} fill priority className="p-1 " />
        </motion.div>
      ))}

      <div className="p-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-2">
        {cardSections.map((card) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0.3 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ amount: 0.3 }}
          >
            <Card className="relative bg-[#F1E2D2] md:h-[60vh]">
              <CardHeader className="space-y-1">
                <CardTitle className="text-center text-base md:text-lg">
                  {card.title}
                </CardTitle>
                <div className="absolute  top-15 right-2 ">
                  <CirclePlay className="w-7 h-7  hover:scale-110 transition-transform duration-200" />
                </div>

                <div className="text-sm text-center">
                  {card.code} | {card.size} | {card.area}
                </div>

                <div className="text-xs md:text-lg text-center">{card.req}</div>
              </CardHeader>

              <CardContent className="relative w-full h-[35vh] md:h-[60vh]">
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

      {bottomImages.map((d, index) => (
        <motion.div
          key={d.id}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{}}
          className="relative h-[40vh] md:h-[50vh] lg:h-screen"
        >
          <Image src={d.image} alt={d.title} fill className="p-1 " />
        </motion.div>
      ))}
    </div>
  );
}
