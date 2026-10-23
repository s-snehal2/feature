"use client";

import { Palette } from "lucide-react";

import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { galleryOptions } from "@/features/showcase/lib/constants";

import { Section } from "./section";

type Props = {
  color: string;
  quality: string;
  colors: string[];
  onColorChange: (value: string) => void;
  onQualityChange: (value: string) => void;
};

/** The linked colour / quality pickers. */
export function ShowcaseSelection({
  color,
  quality,
  colors,
  onColorChange,
  onQualityChange,
}: Props) {
  return (
    <Section
      icon={Palette}
      title="Gallery selection"
      description="Choose the colour and quality these images belong to."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="showcase-colour">Colour</Label>
          <Select value={color} onValueChange={onColorChange}>
            <SelectTrigger id="showcase-colour" className="w-full">
              <SelectValue placeholder="Select colour" />
            </SelectTrigger>
            <SelectContent>
              {colors.map((value) => (
                <SelectItem key={value} value={value}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="showcase-quality">Quality</Label>
          <Select value={quality} onValueChange={onQualityChange}>
            <SelectTrigger id="showcase-quality" className="w-full">
              <SelectValue placeholder="Select quality" />
            </SelectTrigger>
            <SelectContent>
              {galleryOptions.map((option) => (
                <SelectItem
                  key={`${option.color}-${option.quality}`}
                  value={option.quality}
                >
                  {option.quality}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </Section>
  );
}
