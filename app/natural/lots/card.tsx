import BookMatchSection from "./bookmatchSeaction";
import CategorySlider from "./categoryslider";
import { cardData } from "./data";

export default function CardData() {
  const data = cardData[0];

  return (
    <div className="space-y-2">
      {/* Crop & Full */}
      <CategorySlider title="Crop & Full" images={data.cropfull} />

      {/* Bookmatch */}
      <BookMatchSection images={data.bookmatches} />

      {/* Backlit */}
      <CategorySlider title="Backlit" images={data.backlit} />

      {/* Application */}
      <CategorySlider title="Application" images={data.application} />

      {/* Production */}
      <CategorySlider title="Production" images={data.production} />
    </div>
  );
}
