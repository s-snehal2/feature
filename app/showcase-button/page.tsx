"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import ShowcaseEditDialog from "@/features/showcase/components/showcase-edit-dialog";

function Page() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Button size="lg" onClick={() => setOpen(true)}>
        <Pencil className="mr-1 h-4 w-4" />
        Edit
      </Button>

      <ShowcaseEditDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}

export default Page;
