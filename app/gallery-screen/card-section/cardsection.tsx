import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import React from "react";
import { carddata } from "../data";

export type Data = {
  id: number;
  title: string;
  code?: string;
  size?: string;
  area?: string;
  req?: string;
  image: string;
};

export default function CardSection() {
  return (
    <div className="flex flex-wrap gap-6 p-4 justify-center">
      {carddata.map((d) => (
        <Card
          key={d.id}
          className="relative overflow-hidden w-full  h-[550px] bg-primary/30"
        >
          <CardHeader className="flex flex-col justify-center items-center w-full">
            <CardTitle>{d.title}</CardTitle>
            <div className="flex flex-wrap gap-2 text-sm text-center">
              <span>{d.code}</span> | <span>{d.area}</span> |
              <span>{d.size}</span> | <span>{d.req}</span>
            </div>
          </CardHeader>
          <CardContent className="relative w-full h-[500px] p-2">
            <Image src={d.image} alt={d.title} fill />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
