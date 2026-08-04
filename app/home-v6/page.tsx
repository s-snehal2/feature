import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="mx-4 grid auto-rows-min gap-4 md:mx-2 md:grid-cols-3">
      <Link href="/natural">
        <div className="relative aspect-video cursor-pointer overflow-hidden rounded-md bg-[url('/images/natural.png')] bg-center md:aspect-auto md:h-[calc(100vh-3rem)] md:bg-cover">
          <div className="absolute top-5 left-5 w-24 rounded-xs">
            <Image
              src="/cmc-logo.png"
              alt="cmc logo"
              width={100}
              height={100}
              className="object-fill"
            />
          </div>
          <div className="flex h-full items-end justify-center bg-linear-to-t from-black/80 to-transparent text-white">
            <div className="absolute bottom-5 left-5 flex flex-col text-2xl font-bold">
              Natural Marble
              <div className="mt-2">
                <Button className="group bg-transprent border-primary text-primary hover:text-foreground flex items-center rounded-none border-2">
                  Explore
                  <span className="transition-all delay-100 duration-300 group-hover:translate-x-2">
                    <ArrowRight />
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Link>

      <Link href="/engineered">
        <div className="relative aspect-video cursor-pointer overflow-hidden rounded-md bg-[url('/images/engineered.png')] bg-center md:aspect-auto md:h-[calc(100vh-3rem)] md:bg-cover">
          <div className="absolute top-5 left-5 w-24 rounded-xs">
            <Image
              src="/kalinga-stone.png"
              alt="kalingastone logo"
              width={100}
              height={100}
              className="object-fill"
            />
          </div>
          <div className="flex h-full items-end justify-center bg-linear-to-t from-black/80 to-transparent text-white">
            <div className="absolute bottom-5 left-5 flex flex-col text-2xl font-bold">
              Engineered Marble
              <div className="mt-2">
                <Button className="group bg-transprent border-primary text-primary hover:text-foreground flex items-center rounded-none border-2">
                  Explore
                  <span className="transition-all delay-100 duration-300 group-hover:translate-x-2">
                    <ArrowRight />
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Link>

      <Link href="https://kalingastone.com/diamme/">
        <div className="relative aspect-video cursor-pointer overflow-hidden rounded-md bg-[url('/images/diamme.png')] bg-cover md:aspect-auto md:h-[calc(100vh-3rem)]">
          <div className="absolute top-5 left-5 w-24 rounded-xs">
            <Image
              src="/diamme_logo.jpg"
              alt="diamme logo"
              width={100}
              height={100}
              className="object-fill"
            />
          </div>
          <div className="flex h-full items-end justify-center bg-linear-to-t from-black/80 to-transparent text-white">
            <div className="absolute bottom-5 left-5 flex flex-col text-2xl font-bold">
              Diamme
              <div className="mt-2">
                <Button className="group bg-transprent border-primary text-primary hover:text-foreground flex items-center rounded-none border-2">
                  Explore
                  <span className="transition-all delay-100 duration-300 group-hover:translate-x-2">
                    <ArrowRight />
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
