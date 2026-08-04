// "use client";

// import { carddata } from "../data";
// import SingleData from "./single-data";
// import MultiData from "./multi-data";

// export type Data = {
//   id: number;
//   title: string;
//   code?: string;
//   size?: string;
//   area?: string;
//   req?: string;
//   image: string;
// };

// export default function StaticScreen() {
//   return (
//     <div className="flex flex-col gap-10 p-6 h-screen">
//       <SingleData carddata={carddata} startval={0} endval={3} />

//       <div className="flex flex-wrap justify-center gap-6 ">
//         <MultiData carddata={carddata} startval={4} endval={12} />
//       </div>

//       <div className="flex flex-col gap-10 p-6 h-screen">
//         <SingleData carddata={carddata} startval={13} endval={16} />
//       </div>
//     </div>
//   );
// }





// "use client";

// import Image from "next/image";
// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { carddata } from "../data";

// export default function MainCardV2() {
//   const [index, setIndex] = useState(0);
//   const [paused, setPaused] = useState(false);

//   const d = carddata[index];
//   const duration = d.code ? 8000 : 5000;

//   useEffect(() => {
//     if (paused) return;
//     const timer = setTimeout(() => {
//       setIndex((prev) => (prev + 1) % carddata.length);
//     }, duration);
//     return () => clearTimeout(timer);
//   }, [index, paused, duration]);

//   const nextImage = () => setIndex((prev) => (prev + 1) % carddata.length);
//   const prevImage = () =>
//     setIndex((prev) => (prev - 1 + carddata.length) % carddata.length);

//   return (
//     <div className="relative w-full h-screen overflow-hidden flex flex-col justify-center items-center bg-black">
//       {/* === Controls === */}
//       <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2 bg-black/40 backdrop-blur-md rounded-full px-2 py-1">
//         <Button
//           variant="ghost"
//           size="icon"
//           onClick={prevImage}
//           className="rounded-full hover:bg-white/20"
//         >
//           <ChevronLeft className="w-5 h-5 text-white" />
//         </Button>
//         <Button
//           variant="ghost"
//           size="icon"
//           onClick={() => setPaused((p) => !p)}
//           className="rounded-full hover:bg-white/20"
//         >
//           {paused ? (
//             <Play className="w-5 h-5 text-white" />
//           ) : (
//             <Pause className="w-5 h-5 text-white" />
//           )}
//         </Button>
//         <Button
//           variant="ghost"
//           size="icon"
//           onClick={nextImage}
//           className="rounded-full hover:bg-white/20"
//         >
//           <ChevronRight className="w-5 h-5 text-white" />
//         </Button>
//       </div>

//       {/* === Slides === */}
//       <motion.div
//         key={d.id}
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 1 }}
//         className="w-full flex justify-center items-center"
//       >
//         {!d.code ? (
//           <div className="relative w-[90%]  h-screen rounded-none overflow-hidden">
//             <Image
//               src={d.image}
//               alt={d.title}
//               fill
//               priority
//               className="object-contain p-4"
//             />
//           </div>
//         ) : (
//           <Card className=" w-full">
//             <div className="">
//               <CardHeader className="">
//                 <CardTitle className="">{d.title}</CardTitle>
//                 <div className="">
//                   {d.code} | {d.size} | {d.area}
//                 </div>
//                 <div className="">{d.req}</div>
//               </CardHeader>

//               <CardContent className="relative h-[500px]  overflow-hidden">
//                 <Image
//                   src={d.image}
//                   alt={d.title}
//                   fill
//                   className="object-contain"
//                 />
//               </CardContent>
//             </div>
//           </Card>
//         )}
//       </motion.div>
//     </div>
//   );
// }

