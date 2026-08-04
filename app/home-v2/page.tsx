import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="mx-4  grid auto-rows-min gap-4 md:mx-2 md:grid-cols-3 min-h-[calc(100vh-4rem)]">
      <Link href="/natural">
        <div className="relative aspect-video cursor-pointer overflow-hidden rounded-md bg-[url('/images/natural.png')] bg-center md:bg-cover md:aspect-auto md:h-[calc(100vh-3rem)] ">
          <div className="absolute top-5 left-5 bg-white/80 rounded-xs w-24 p-2">
            <Image
              src="/CMC-Logo-1-1.png"
              alt="CMCLOGO"
              width={100}
              height={100}
              className="object-fill"
            />
          </div>
          <div className="flex justify-center items-end h-full bg-linear-to-t from-black/80 to-transparent  text-white">
            <div className="absolute bottom-5 left-5 flex flex-col font-bold text-2xl ">
              Natural Marble
              <div className="  mt-2">
                <Button className="group flex items-center rounded-none bg-transprent border-2 border-primary text-primary hover:text-foreground">
                  Explore
                  <span className="group-hover:translate-x-2 transition-all duration-300 delay-100">
                    <ArrowRight />
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Link>

      <Link href="/engineered">
        <div className="relative aspect-video cursor-pointer overflow-hidden rounded-md bg-[url('/images/engineered.png')] bg-center md:bg-cover md:aspect-auto md:h-[calc(100vh-3rem)] ">
          <div className="absolute top-5 left-5 bg-black/80 rounded-xs w-24 p-2">
            <Image
              src="/kalinga_logo.png"
              alt="KALINGASTONE_LOGO"
              width={100}
              height={100}
              className="object-fill"
            />
          </div>
          <div className="flex justify-center items-end h-full bg-linear-to-t from-black/80  to-transparent  text-white">
            <div className="absolute bottom-5 left-5 flex flex-col font-bold text-2xl">
              Engineered Marble
              <div className="  mt-2">
                <Button className="group flex items-center rounded-none bg-transprent border-2 border-primary text-primary hover:text-foreground">
                  Explore
                  <span className="group-hover:translate-x-2 transition-all duration-300 delay-100">
                    <ArrowRight />
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Link>

      <Link href="/diamme">
        <div className="relative aspect-video cursor-pointer overflow-hidden rounded-md bg-[url('/images/diamme.png')] bg-cover md:aspect-auto md:h-[calc(100vh-3rem)] ">
          <div className="absolute top-5 left-5 bg-black/80 rounded-xs w-24 p-2">
            <Image
              src="/diamme_logo.jpg"
              alt="DIAMME_LOGO"
              width={100}
              height={100}
              className="object-fill"
            />
          </div>
          <div className="flex justify-center items-end h-full bg-linear-to-t from-black/80 to-transparent  text-white">
            <div className="absolute bottom-5 left-5 flex flex-col font-bold text-2xl">
              Diamme
              <div className="  mt-2">
                <Button className="group flex items-center rounded-none bg-transprent border-2 border-primary text-primary hover:text-foreground">
                  Explore
                  <span className="group-hover:translate-x-2 transition-all duration-300 delay-100">
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
