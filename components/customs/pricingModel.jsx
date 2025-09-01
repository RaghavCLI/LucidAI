import Lookup from "../../app/data/Lookup";
import React from "react";
import { Button } from "../ui/button";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useContext, useState } from "react";
import { UserDetailContext } from "@/context/UserDetailContext";

function PricingModel() {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const UpdateToken = useMutation(api.users.UpdateToken);
  const [selectedOption, setSelectedOption] = useState();
  const onPaymentSuccess = async (pricing) => {
    const token = userDetail?.token + Number(selectedOption?.value);
    console.log(token);
    await UpdateToken({
      token: token,
      userId: userDetail?._id,
    });
  };

  return (
    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 ">
      {Lookup.PRICING_OPTIONS.map((pricing, index) => (
        <div
          key={index}
          className="border p-6 rounded-lg mt-5 flex flex-col h-full"
          onClick={() => setSelectedOption(pricing)}
        >
          <h2 className="font-bold text-lg mb-2">{pricing.name}</h2>
          <h2 className="font-bold text-2xl mb-4">{pricing.tokens}</h2>
          <p className="font-medium text-gray-500 mb-6 flex-grow">
            {pricing.desc}
          </p>
          <div className="mt-auto">
            <h2 className="font-bold text-4xl text-center mb-4">
              $ {pricing.price}
            </h2>
            {/* <Button className="w-full bg-blue-600/60 hover:bg-blue-700/80 text-white font-semibold py-2 px-4 rounded-lg transition-colors backdrop-blur-sm">
              Upgrade to {pricing.name}
            </Button> */}
            <PayPalButtons
              disabled={!userDetail}
              onApprove={() => onPaymentSuccess()}
              onCancel={() => console.log("Payment cancelled.")}
              style={{ layout: "horizontal" }}
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [
                    {
                      amount: {
                        value: pricing.price,
                        currency_code: "USD",
                      },
                    },
                  ],
                });
              }}
            ></PayPalButtons>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PricingModel;
