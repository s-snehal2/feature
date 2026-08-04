import Link from "next/link";

export default function HomePage() {
  return (
    <div className="mx-4 grid auto-rows-min gap-4 md:mx-2 md:grid-cols-3">
      {/* <div className="h-[calc(100vh-3rem)] rounded-md bg-[url('/images/natural.webp')]" />
       <div className="h-[calc(100vh-3rem)] rounded-md bg-[url('/images/engineered.webp')] bg-cover" />
       <div className="h-[calc(100vh-3rem)] rounded-md bg-[url('/images/techlam.webp')] bg-cover" /> */}

      <Link href={"/natural"} className="bg-red-600">
        <div className="group relative aspect-video cursor-pointer overflow-hidden rounded-md bg-[url('/images/natural.png')] bg-cover md:aspect-auto md:h-[calc(100vh-3rem)]">
          <div className="absolute inset-x-0 -bottom-2 z-50 flex cursor-pointer items-end rounded-xl bg-gradient-to-t from-black/80 to-transparent pt-30 text-white opacity-0 transition duration-300 ease-in-out group-hover:opacity-100">
            <div className="translate-y-4 transform transform-gpu space-y-3 p-4 pb-10 text-xl transition duration-300 ease-in-out group-hover:translate-y-0 group-hover:opacity-100">
              <div className="font-bold">Natural Marble</div>

              <div className="text-sm opacity-60">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Distinctio dolores error iure, perferendis sequi totam. Ad
                aliquam aperiam atque deleniti dolor dolorem enim esse et in,
                inventore itaque, pariatur reprehenderit.
              </div>
            </div>
          </div>
        </div>
      </Link>

      <Link href={"/engineered"}>
        <div className="group relative aspect-video cursor-pointer overflow-hidden rounded-md bg-[url('/images/engineered.png')] bg-cover md:aspect-auto md:h-[calc(100vh-3rem)]">
          <div className="absolute inset-x-0 -bottom-2 z-50 flex cursor-pointer items-end rounded-xl bg-gradient-to-t from-black/80 to-transparent pt-30 text-white opacity-0 transition duration-300 ease-in-out group-hover:opacity-100">
            <div className="translate-y-4 transform transform-gpu space-y-3 p-4 pb-10 text-xl transition duration-300 ease-in-out group-hover:translate-y-0 group-hover:opacity-100">
              <div className="font-bold">Engineered Marble</div>

              <div className="text-sm opacity-60">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Distinctio dolores error iure, perferendis sequi totam. Ad
                aliquam aperiam atque deleniti dolor dolorem enim esse et in,
                inventore itaque, pariatur reprehenderit.
              </div>
            </div>
          </div>
        </div>
      </Link>

      <Link href={"/techlam"}>
        <div className="group relative aspect-video cursor-pointer overflow-hidden rounded-md bg-[url('/images/slim.png')] bg-cover md:aspect-auto md:h-[calc(100vh-3rem)]">
          <div className="absolute inset-x-0 -bottom-2 z-50 flex cursor-pointer items-end rounded-xl bg-gradient-to-t from-black/80 to-transparent pt-30 text-white opacity-0 transition duration-300 ease-in-out group-hover:opacity-100">
            <div className="translate-y-4 transform transform-gpu space-y-3 p-4 pb-10 text-xl transition duration-300 ease-in-out group-hover:translate-y-0 group-hover:opacity-100">
              <div className="font-bold">Slim</div>

              <div className="text-sm opacity-60">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Distinctio dolores error iure, perferendis sequi totam. Ad
                aliquam aperiam atque deleniti dolor dolorem enim esse et in,
                inventore itaque, pariatur reprehenderit.
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
