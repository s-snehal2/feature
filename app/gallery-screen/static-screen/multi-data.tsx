import React from "react";
import { carddata } from "../data";
import { motion } from "framer-motion";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Data } from "../card-section/cardsection";

interface MultiDataProps {
  carddata: Data[];
  startval: number;
  endval: number;
}

export default function MultiData({
  carddata,
  startval,
  endval,
}: MultiDataProps) {
  return (
    <div className="w-full h-full">
      {carddata.slice(startval, endval).map((d) => (
        <Card key={d.id} className="w-full p-0 ">
          <CardHeader>
            <CardTitle className="text-center">{d.title}</CardTitle>
            <div className="text-sm text-gray-500 text-center">
              {d.code} | {d.size} | {d.area}
            </div>
            <div className="text-sm text-center">{d.req}</div>
          </CardHeader>
          <CardContent className="relative h-[400px]">
            <Image src={d.image} alt={d.title} fill className="" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
