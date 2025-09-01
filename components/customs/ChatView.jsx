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

export const countToken = (inputText) => {
  return inputText
    .trim()
    .split(/\s+/)
    .filter((word) => word).length;
};

function ChatView() {
  const { id } = useParams();
  const convex = useConvex();
  const { userDetail, setuserDetail } = useContext(UserDetailContext);
  const { messages = [], setMessages } = useContext(MessagesContext);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const UpdateMessages = useMutation(api.workspace.UpdateMessages);
  const UpdateToken = useMutation(api.users.UpdateToken);

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
        const token =
          Number(userDetail?.token) -
          Number(countToken(JSON.stringify(result.data.result)));
        // update into db
        await UpdateToken({
          userId: userDetail?._id,
          token: token,
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
    <div className="relative h-[85vh] flex flex-row pl-9 pr-1">
      {/* Sticky avatar column */}
      <div className="fixed left-0 top-0 h-full flex flex-col items-center justify-end pl-2.5 py-3 pb-10 z-20 w-10">
        <div className="ml-px flex items-center">
          <button className="bg-transparent cursor-default flex flex-col items-center p-0 m-0 group">
            <div className="flex select-none items-center justify-center w-7 h-7 overflow-hidden rounded-full shrink-0 bg-white ring-2 ring-gray-700 group-hover:ring-gray-600 transition-all duration-200">
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
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-panel-left-icon lucide-panel-left mt-3 text-gray-500 group-hover:text-gray-400 transition-colors duration-200"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M9 3v18" />
            </svg>
          </button>
        </div>
      </div>
      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex-col gap-4 overflow-y-auto mx-0 scrollbar-hide">
          {Array.isArray(messages) &&
            messages.map((msg, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg mb-3 flex gap-4 items-start group hover:bg-gray-800/20 transition-colors duration-200 ${
                  msg?.role === "ai" ? "bg-gray-800/10" : ""
                }`}
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
                    width={36}
                    height={36}
                    className="rounded-full ring-1 ring-gray-600 flex-shrink-0"
                  />
                )}
                {msg?.role === "ai" && (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-semibold">AI</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => (
                          <p className="mb-2 last:mb-0 leading-relaxed">
                            {children}
                          </p>
                        ),
                        code: ({ children }) => (
                          <code className="bg-gray-700 px-2 py-1 rounded text-sm font-mono">
                            {children}
                          </code>
                        ),
                        pre: ({ children }) => (
                          <pre className="bg-gray-800 p-3 rounded-lg overflow-x-auto text-sm">
                            {children}
                          </pre>
                        ),
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
          {loading && (
            <div className="p-4 mb-3">
              <div className="flex gap-4 items-start">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 animate-pulse">
                  <span className="text-white text-sm font-semibold">AI</span>
                </div>
                <div className="flex-1">
                  <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
                    <LoaderFive text="Generating AI Response..." />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div>
          {/* Message Input Area */}
          <div className="relative rounded-sm max-w-xl w-full mt-4 p-[1px] bg-gradient-to-br from-white/30 via-white/10 to-transparent">
            <div className="bg-black/80 backdrop-blur-sm rounded-xl p-4 relative border border-white/5">
              <div className="flex gap-3 items-end">
                <textarea
                  value={userInput}
                  onChange={(event) => setUserInput(event.target.value)}
                  placeholder={Lookup.INPUT_PLACEHOLDER}
                  className="outline-none bg-transparent w-full h-20 max-h-40 resize-none text-gray-100 placeholder-gray-400 text-sm leading-relaxed"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      onGenerate(userInput);
                    }
                  }}
                />
                {userInput && (
                  <button
                    onClick={() => onGenerate(userInput)}
                    className="p-2 h-9 w-9 text-white/70 hover:text-white rounded-lg cursor-pointer hover:bg-white/10 transition-all duration-200 flex items-center justify-center group"
                  >
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-0.5 transition-transform duration-200" />
                  </button>
                )}
              </div>
              <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                <span>Press Enter to send, Shift+Enter for new line</span>
                <Link className="h-4 w-4 opacity-50" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatView;
