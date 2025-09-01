"use client";

import Lookup from "@/app/data/Lookup";
import { ArrowRight, Link } from "lucide-react";
import React, { useState, useContext } from "react";
import { MessagesContext } from "../../context/MessagesContext";
import { UserDetailContext } from "../../context/UserDetailContext";
import SignInDialog from "./SignInDialog";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

function Hero() {
  const [userInput, setUserInput] = useState();
  const { messages, setMessages } = useContext(MessagesContext);
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [openDialog, setOpenDialog] = useState(false);
  const CreateWorkspace = useMutation(api.workspace.CreateWorkSpace);
  const router = useRouter();
  const onGenerate = async (input) => {
    if (!userDetail?.name) {
      setOpenDialog(true);
      return;
    }
    if (userDetail?.token < 10) {
      toast("Not enough tokens");
      return;
    }
    const msg = {
      role: "msg",
      content: input,
    };
    setMessages(msg);

    if (!userDetail || !userDetail._id) {
      setOpenDialog(true); // ask the user to sign in
      return; // stop execution
    }

    const workspaceId = await CreateWorkspace({
      user: userDetail._id, // must be a valid Convex user ID
      messages: [msg],
    });

    console.log("Workspace created with ID:", workspaceId);
    router.push("/workspace/" + workspaceId);
  };
  return (
    <div className="flex flex-col items-center min-h-[calc(100vh-5rem)] md:min-h-0 md:h-auto relative">
      {/* Top section with heading and description */}
      <div className="flex flex-col items-center mt-8 md:mt-16 xl:mt-36 gap-4">
        <h2 className="text-3xl md:text-[44px] font-bold text-center px-4">
          {Lookup.HERO_HEADING}
        </h2>
        <p className="text-center px-4 text-gray-400">{Lookup.HERO_DESC}</p>
      </div>

      {/* Input section*/}
      <div className="fixed md:relative bottom-4 inset-x-3 md:inset-x-auto md:bottom-auto md:mt-6 md:max-w-xl w-full">
        <div className="relative">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 via-white/5 to-transparent blur-sm opacity-50"></div>
          <div className="relative rounded-2xl bg-black/40 backdrop-blur-xl border border-white/5">
            <div className="p-4 md:p-5">
              <div className="flex gap-3">
                <textarea
                  onChange={(event) => setUserInput(event.target.value)}
                  placeholder={Lookup.INPUT_PLACEHOLDER}
                  className="outline-none bg-transparent w-full h-24 md:h-32 max-h-50 resize-none md:resize text-[15px] placeholder:text-gray-500/80 leading-relaxed"
                />
                {userInput && (
                  <button
                    onClick={() => onGenerate(userInput)}
                    className="flex-shrink-0 group p-2 h-9 w-9 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200"
                  >
                    <ArrowRight className="h-5 w-5 text-white/70 group-hover:text-white/90 transition-colors" />
                  </button>
                )}
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-[10px] text-gray-500">
                <Link className="h-3.5 w-3.5" />
                <span>Powered by LucidAI</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Suggestions - hidden on mobile, shown on desktop */}
      <div className="hidden md:flex mt-8 flex-wrap max-w-2xl items-center justify-center gap-3 px-4">
        {Lookup?.SUGGSTIONS?.map((suggestion, index) => (
          <h2
            className="p-1 px-2 border rounded-full border-gray-600 font-extralight text-sm text-gray-400 hover:text-white cursor-pointer"
            key={index}
            onClick={() => onGenerate(suggestion)}
          >
            {suggestion}
          </h2>
        ))}
      </div>
      <SignInDialog
        openDialog={openDialog}
        CloseDialog={(v) => setOpenDialog(false)}
      />
    </div>
  );
}

export default Hero;
