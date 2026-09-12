import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="mx-4 flex flex-col gap-2 md:mx-2 md:h-[calc(100vh-6.4rem)] md:landscape:h-[calc(100vh-3rem)] md:landscape:grid md:landscape:grid-cols-3 xl:grid xl:grid-cols-3 xl:h-full">
      <Link href="/natural">
        <div
          className="
            relative aspect-video cursor-pointer overflow-hidden rounded-md
            bg-[url('/images/natural.png')]
            bg-center md:bg-[center_60%] xl:bg-center
            bg-cover
            md:aspect-auto
            md:h-[calc((100vh-6.4rem-1rem)/3)]
            md:landscape:h-[calc(100vh-3rem)]
            xl:h-full
          "
        >
          <div className="absolute top-5 left-5 w-24 rounded-xs">
            <Image
              src="/CMC1.png"
              alt="CMC logo"
              width={100}
              height={100}
              priority
              className="w-16 bg-white object-fill "
            />
          </div>

          <div className="flex h-full items-end justify-center bg-linear-to-t from-black/80 to-transparent text-white">
            <div className="absolute bottom-5 left-5 flex flex-col text-2xl font-bold md:bottom-6 md:landscape:bottom-[10vh] xl:landscape:bottom-[3vh]">
              Natural Marble
              <div className="mt-2">
                <Button className="group flex items-center rounded-none border-2 border-primary bg-transparent text-primary hover:text-foreground">
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
        <div
          className="
            relative aspect-video cursor-pointer overflow-hidden rounded-md
            bg-[url('/images/engineered.png')]
            bg-center md:bg-[center_75%] xl:bg-center
            bg-cover
            md:aspect-auto
            md:h-[calc((100vh-6.4rem-1rem)/3)]
            md:landscape:h-[calc(100vh-3rem)]
            xl:h-full
          "
        >
          <div className="absolute top-5 left-5 w-24 rounded-xs">
            <Image
              src="/kalinga2.png"
              alt="kalingastone logo"
              width={100}
              height={100}
              priority
              className="w-20 md:w-40 bg-white object-fill "
            />
          </div>

          <div className="flex h-full items-end justify-center bg-linear-to-t from-black/80 to-transparent text-white">
            <div className="absolute bottom-5 left-5 flex flex-col text-2xl font-bold md:bottom-6 md:landscape:bottom-[10vh] xl:landscape:bottom-[3vh]">
              Engineered Marble
              <div className="mt-2">
                <Button className="group flex items-center rounded-none border-2 border-primary bg-transparent text-primary hover:text-foreground">
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
        <div
          className="
            relative aspect-video cursor-pointer overflow-hidden rounded-md
            bg-[url('/images/diamme.png')]
            bg-center md:bg-[center_50%] xl:bg-center
            bg-cover
            md:aspect-auto
            md:h-[calc((100vh-6.4rem-1rem)/3)]
            md:landscape:h-[calc(100vh-3rem)]
            xl:h-full
          "
        >
          <div className="absolute top-5 left-5 w-24 rounded-xs">
            <Image
              src="/diamme_logo.jpg"
              alt="diamme logo"
              width={100}
              height={100}
              className="w-16 md:w-26 bg-white object-fill "
            />
          </div>

          <div className="flex h-full items-end justify-center bg-linear-to-t from-black/80 to-transparent text-white">
            <div className="absolute bottom-5 left-5 flex flex-col text-2xl font-bold md:bottom-6 md:landscape:bottom-[10vh] xl:landscape:bottom-[3vh]">
              Diamme
              <div className="mt-2">
                <Button className="group flex items-center rounded-none border-2 border-primary bg-transparent text-primary hover:text-foreground">
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
