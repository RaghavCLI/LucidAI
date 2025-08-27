"use client";
import { MessagesContext } from "@/context/MessagesContext";
import { UserDetailContext } from "@/context/UserDetailContext";
import { api } from "@/convex/_generated/api";
import { useConvex } from "convex/react";
import { useParams } from "next/navigation";
import React, { use, useContext, useEffect } from "react";
import Image from "next/image";
import Lookup from "@/app/data/Lookup";
import { ArrowRight, Link } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import prompt from "@/app/data/Prompt";
import { LoaderFive } from "@/components/ui/loader";
import colors from "@/app/data/Colors";
import { useMutation } from "convex/react";
import ReactMarkdown from "react-markdown";

function ChatView() {
  const { id } = useParams();
  const convex = useConvex();
  const { userDetail, setuserDetail } = useContext(UserDetailContext);
  const { messages = [], setMessages } = useContext(MessagesContext);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const UpdateMessages = useMutation(api.workspace.UpdateMessages);

  useEffect(() => {
    id && GetWorkspaceData();
  }, [id]);

  const GetWorkspaceData = async () => {
    const result = await convex.query(api.workspace.GetWorkspace, {
      workspaceId: id,
    });
    setMessages(result?.messages);
  };

  // When a user message is added, trigger AI response
  useEffect(() => {
    if (messages?.length > 0) {
      const role = messages[messages?.length - 1].role;
      if (role === "msg") {
        GetAiResponse();
      }
    }
  }, [messages]);

  const GetAiResponse = async () => {
    try {
      setLoading(true);
      const PROMPT = JSON.stringify(messages) + prompt.CHAT_PROMPT;
      const result = await axios.post("/api/ai-chat", { prompt: PROMPT });
      if (result.data.result) {
        setMessages((prev) => [
          ...prev,
          { role: "ai", content: result.data.result },
        ]);
        await UpdateMessages({
          messages: [...messages, { role: "ai", content: result.data.result }],
          workspaceId: id,
        });
        setLoading(false);
      }
    } catch (error) {
      console.error("Error getting AI response:", error);
      // Optionally show error to user
    }
  };

  // Send user message
  const onGenerate = async (input) => {
    if (!input?.trim()) return;
    setMessages((prev) => [...prev, { role: "msg", content: input }]);
    setUserInput("");
  };

  return (
    <div className="relative h-[85vh] flex flex-row pl-11">
      {/* Sticky avatar column */}
      <div className="fixed left-0 top-0 h-full flex flex-col items-center justify-end pl-2.5 py-3 z-20 w-10">
        <div className="ml-px flex items-center">
          <button className="bg-transparent cursor-default flex flex-col items-center p-0 m-0">
            <div className="flex select-none items-center justify-center w-6 h-6 overflow-hidden rounded-full shrink-0 bg-white">
              {userDetail && (
                <Image
                  src={userDetail?.picture}
                  alt="user-avatar"
                  width={50}
                  height={50}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-panel-left-icon lucide-panel-left mt-2 text-gray-400"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M9 3v18" />
            </svg>
          </button>
        </div>
      </div>
      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex-col gap-6 overflow-y-scroll pt-2 mx-0 scrollbar-hide">
          {Array.isArray(messages) &&
            messages.map((msg, index) => (
              <div
                key={index}
                className="p-3 rounded-lg mb-2 flex gap-3 items-start"
                style={
                  msg?.role !== "ai"
                    ? { backgroundColor: colors.CHAT_BACKGROUND }
                    : {}
                }
              >
                {msg?.role === "msg" && (
                  <Image
                    src={userDetail?.picture}
                    alt="user-avatar"
                    width={35}
                    height={35}
                    className="rounded-full"
                  />
                )}
                <div>
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            ))}
          {loading && (
            <div className="p-3">
              <LoaderFive text="Generating AI Response..." />
            </div>
          )}
        </div>
        <div>
          {/* Message Input Area */}
          <div className="relative rounded-sm max-w-xl w-full mt-3 p-[1px] bg-gradient-to-br from-white/30 via-white/10 to-transparent">
            <div className="bg-black rounded-xl p-5 relative">
              <div className="flex gap-2">
                <textarea
                  value={userInput}
                  onChange={(event) => setUserInput(event.target.value)}
                  placeholder={Lookup.INPUT_PLACEHOLDER}
                  className="outline-none bg-transparent w-full h-20 max-h-40 resize"
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
    </div>
  );
}

export default ChatView;
