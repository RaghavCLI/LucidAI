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
    const msg = {
      role: "msg",
      content: input,
    };
    setMessages(msg);

    const workspaceId = await CreateWorkspace({
      user: userDetail._id,
      messages: [msg],
    });
    console.log("Workspace created with ID:", workspaceId);
    router.push("/workspace/" + workspaceId);
  };
  return (
    <div className="flex flex-col items-center mt-16 xl:mt-36 gap-4">
      <h2 className="text-4xl font-bold">{Lookup.HERO_HEADING}</h2>
      <p className="">{Lookup.HERO_DESC}</p>

      <div className="relative rounded-xl max-w-xl w-full mt-6 p-[1px] bg-gradient-to-br from-white/30 via-white/10 to-transparent">
        <div className="bg-black rounded-xl p-5 relative">
          <div className="flex gap-2">
            <textarea
              onChange={(event) => setUserInput(event.target.value)}
              placeholder={Lookup.INPUT_PLACEHOLDER}
              className="outline-none bg-transparent w-full h-32 max-h-56 resize"
            />
            {userInput && (
              <ArrowRight
                onClick={() => onGenerate(userInput)}
                className="p-2 h-9 w-9 text-white/70 hover:text-white rounded-md cursor-pointer hover:bg-white/10 transition-all duration-200"
              />
            )}
          </div>
          <div>
            <Link className=" h-5 w-5" />
          </div>
        </div>
      </div>
      <div className="flex mt-8 flex-wrap max-w-2xl items-center justify-center gap-3">
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
