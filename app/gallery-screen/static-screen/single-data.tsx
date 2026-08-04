import React from "react";

import { motion } from "framer-motion";
import Image from "next/image";
import { Data } from "../card-section/cardsection";

interface SingledataProps {
  carddata: Data[];
  startval: number;
  endval: number;
}
export default function SingleData({
  carddata,
  startval,
  endval,
}: SingledataProps) {
  return (
    <div>
      <div className="flex flex-wrap justify-center gap-4">
        {carddata.slice(startval, endval).map((d) => (
          <motion.div
            key={d.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="relative w-full h-[550px] rounded-lg overflow-hidden"
          >
            <Image src={d.image} alt={d.title} fill className="" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
