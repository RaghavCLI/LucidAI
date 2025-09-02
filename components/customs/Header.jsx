"use client";

import React, { useContext, useState } from "react";
import { Button } from "../ui/button";
import { UserDetailContext } from "@/context/UserDetailContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SignInDialog from "./SignInDialog";
import Image from "next/image";

function Header() {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const pathname = usePathname();
  const [openDialog, setOpenDialog] = useState(false);
  const isWorkspace =
    pathname === "/workspace" || pathname.startsWith("/workspace/");

  return (
    <div
      className={`pl-5 pr-4 py-2 flex justify-between items-center backdrop-blur-sm relative ${
        isWorkspace
          ? "border-b after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-white/20"
          : ""
      }`}
    >
      {/* Left side - Logo/Title */}
      <div className="flex items-center">
        <Link href="/">
          <h1 className="text-2xl font-bold p-0">LucidAI</h1>
        </Link>
      </div>

      {/* Right side - Get Started Button or User Profile */}
      {!userDetail?.name ? (
        <div className="flex items-center ml-auto">
          <button
            onClick={() => setOpenDialog(true)}
            className="inline-flex h-10 animate-shimmer items-center justify-center rounded-md border bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] py-2 px-4 font-medium text-sm text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
          >
            Get Started
          </button>
        </div>
      ) : (
        <div className="flex items-center ml-auto">
          {userDetail?.picture && (
            <Image
              src={userDetail.picture}
              alt="Profile Picture"
              width={32}
              height={32}
              className="w-8 h-8 rounded-full border-2 border-white/20"
            />
          )}
        </div>
      )}

      <SignInDialog openDialog={openDialog} CloseDialog={setOpenDialog} />
    </div>
  );
}

export default Header;
