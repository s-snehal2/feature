"use client";

import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  name: string;
  code: string;
  image: string;
  onView: () => void;
}

export default function ProductCard({
  name,
  code,
  image,
  onView,
}: ProductCardProps) {
  return (
    <div className="w-full max-w-sm overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="relative">
        <img src={image} alt={name} className="h-64 w-full object-cover" />

        <Button
          size="icon"
          onClick={onView}
          className="absolute bottom-4 right-4 rounded-full"
        >
          <Play className="h-5 w-5 fill-current" />
        </Button>
      </div>

      <div className="p-4">
        <h2 className="font-semibold text-lg">{name}</h2>
        <p className="text-sm text-muted-foreground">{code}</p>
      </div>
    </div>
  );
}
