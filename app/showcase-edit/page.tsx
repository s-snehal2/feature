"use client";

import { useState } from "react";

import ShowcaseEdit from "@/features/showcase/_components/showcase-edit";

function Page() {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex w-full items-center justify-center">
      <ShowcaseEdit open={open} onOpenChange={setOpen} />
    </div>
  );
}

export default Page;
