"use client";
import Lookup from "@/app/data/Lookup";
import { UserDetailContext } from "@/context/UserDetailContext";
import React, { useContext } from "react";
import CosmicBackground from "@/components/ui/CosmicBackground";
import PricingModel from "@/components/customs/pricingModel";

function Pricing() {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  return (
    <div>
      <CosmicBackground className="z-0" />
      <div className="mt-9 flex flex-col items-center w-full p-10 md:px-32 lg:px-48">
        <h2 className="text-5xl font-bold text-center">Pricing</h2>
        <p className="text-gray-400 max-w-xl text-center"></p>
        {Lookup.PRICING_DESC}
        <div className="p-5 border rounded-xl w-full flex justify-between mt-7 items-center">
          <h2>{userDetail?.token}</h2>
          <div className="">
            <h2 className="font-medium">Need more Token?</h2>
            <p>Upgrade to a premium plan for more tokens.</p>
          </div>
        </div>
        <PricingModel />
      </div>
    </div>
  );
}

export default Pricing;
