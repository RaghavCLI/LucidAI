import React from "react";
import { Button } from "../ui/button";

function Header() {
  return (
    <div className="p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold p-1">LucidAI</h1>
      <div className="flex gap-5">
        <button className="inline-flex h-10 items-center justify-center rounded-md border border-gray-600 bg-transparent py-2 px-4 font-medium text-sm text-gray-300 hover:bg-gray-800/20 hover:border-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-black">
          Sign In
        </button>
        <button className="inline-flex h-10 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] py-2 px-4 font-medium text-sm text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
          Get Started
        </button>
      </div>
    </div>
  );
}

export default Header;
