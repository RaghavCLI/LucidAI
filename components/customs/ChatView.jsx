"use client";
import { MessagesContext } from "@/context/MessagesContext";
import { UserDetailContext } from "@/context/UserDetailContext";
import { api } from "@/convex/_generated/api";
import { useConvex } from "convex/react";
import { useParams } from "next/navigation";
import React, { useContext, useEffect } from "react";
import Image from "next/image";
import Lookup from "@/app/data/Lookup";
import { ArrowRight, Link } from "lucide-react";
import { useState } from "react";

function ChatView() {
  const { id } = useParams();
  const convex = useConvex();
  const { userDetail, setuserDetail } = useContext(UserDetailContext);
  const { messages, setMessages } = useContext(MessagesContext);
  const [userInput, setUserInput] = useState();

  useEffect(() => {
    id && GetWorkspaceData();
  }, [id]);

  const GetWorkspaceData = async () => {
    const result = await convex.query(api.workspace.GetWorkspace, {
      workspaceId: id,
    });
    console.log("Workspace Data:", result);
    setMessages(result?.messages);
  };
  return (
    <div className="relative h-[85vh] flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
        {messages?.map((msg, index) => (
          <div
            key={index}
            className="p-3 rounded-lg mb-2 flex gap-3 items-start"
          >
            {msg?.role == "msg" && (
              <Image
                src={userDetail?.picture}
                alt="User Avatar"
                width={35}
                height={35}
                className="rounded-full"
              />
            )}
            <h2>{msg?.content}</h2>
          </div>
        ))}
      </div>
      <div>
        {/* Message Input Area */}
        <div className="relative rounded-xl max-w-xl w-full mt-3 p-[1px] bg-gradient-to-br from-white/30 via-white/10 to-transparent">
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
      </div>
    </div>
  );
}

export default ChatView;
