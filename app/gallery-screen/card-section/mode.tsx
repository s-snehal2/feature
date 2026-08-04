"use client";

import { MoonStar, SunDim } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ModeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []); // run only once on mount

  if (!mounted) {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className="relative rounded-full bg-muted"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "light" ? (
        <SunDim className="h-5 w-5" />
      ) : (
        <MoonStar className="h-5 w-5" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
