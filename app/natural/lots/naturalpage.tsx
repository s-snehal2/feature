import React from "react";
import Header from "./header";
import CardData from "./card";

function NaturalPage() {
  return (
    <div className="h-screen max-w-2xl  landscape:lg:max-w-2xl  landscape:sm:max-w-xl  mx-auto ">
      <div>
        <Header />
      </div>
      <div className="mt-16 md:mt-18 landscape:md:mt-10 px-2 sm:px-0 md:px-2">
        <CardData />
      </div>
    </div>
  );
}

export default NaturalPage;
