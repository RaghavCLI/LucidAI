import Lookup from "../../app/data/Lookup";
import React from "react";
import { Button } from "../ui/button";

function PricingModel() {
  return (
    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 ">
      {Lookup.PRICING_OPTIONS.map((pricing, index) => (
        <div
          key={index}
          className="border p-6 rounded-lg mt-5 flex flex-col h-full"
        >
          <h2 className="font-bold text-lg mb-2">{pricing.name}</h2>
          <h2 className="font-bold text-2xl mb-4">{pricing.tokens}</h2>
          <p className="font-medium text-gray-500 mb-6 flex-grow">
            {pricing.desc}
          </p>
          <div className="mt-auto">
            <h2 className="font-bold text-4xl text-center mb-4">
              ₹ {pricing.price}
            </h2>
            <Button className="w-full bg-blue-600/60 hover:bg-blue-700/80 text-white font-semibold py-2 px-4 rounded-lg transition-colors backdrop-blur-sm">
              Upgrade to {pricing.name}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PricingModel;
