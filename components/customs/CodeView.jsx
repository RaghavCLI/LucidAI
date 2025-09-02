"use client";
import React, { useState, useContext, useEffect } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackFileExplorer,
} from "@codesandbox/sandpack-react";
import Lookup from "@/app/data/Lookup";
import { MessagesContext } from "@/context/MessagesContext";
import axios from "axios";
import prompt from "@/app/data/prompt";
import { useMutation } from "convex/react";
import { useParams } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { useQuery, useConvex } from "convex/react";
import LoaderFourDemo from "@/components/ui/loader-four-demo";
import { countToken } from "./ChatView";
import { UserDetailContext } from "@/context/UserDetailContext";

function CodeView() {
  const { id } = useParams();
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [activeTab, setActiveTab] = useState("code");
  const [files, setFiles] = useState(Lookup?.DEFAULT_FILE);
  const { messages, setMessages } = useContext(MessagesContext);
  const UpdateFiles = useMutation(api.workspace.UpdateFiles);
  const [loading, setLoading] = useState(false);

  const workspaceData = useQuery(api.workspace.GetWorkspace, {
    workspaceId: id,
  });

  const UpdateToken = useMutation(api.users.UpdateToken);

  useEffect(() => {
    if (workspaceData) {
      const mergedFiles = {
        ...Lookup.DEFAULT_FILE,
        ...workspaceData?.fileData,
      };
      setFiles(mergedFiles);
      // Removed setLoading(false) from here since we want loading to be controlled by the API request
    }
  }, [workspaceData, id]);

  useEffect(() => {
    if (messages?.length > 0) {
      const role = messages[messages?.length - 1].role;
      if (role == "msg") {
        GenerateAiCode();
      }
    }
  }, [messages]);

  const GenerateAiCode = async () => {
    try {
      setLoading(true);
      const PROMPT = JSON.stringify(messages) + " " + prompt.CODE_GEN_PROMPT;

      const result = await axios.post("/api/gen-ai-code", {
        prompt: PROMPT,
      });

      const aiResp = result.data;
      const mergedFiles = { ...Lookup.DEFAULT_FILE, ...aiResp?.files };
      setFiles(mergedFiles);

      await UpdateFiles({
        workspaceId: id,
        files: aiResp?.files,
      });

      const token =
        Number(userDetail?.token) - Number(countToken(JSON.stringify(aiResp)));
      // update into db
      await UpdateToken({
        userId: userDetail?._id,
        token: token,
      });
      setUserDetail((prev) => ({
        ...prev,
        token: token,
      }));
    } catch (error) {
      console.error("Error generating code:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="relative flex w-full">
      <div className="bg-[#181818] border p-1 w-full max-w-[1000px] mx-auto">
        <div className="flex items-center gap-1 mb-4 pb-2 border-b border-gray-700">
          <button
            onClick={() => setActiveTab("code")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              activeTab === "code"
                ? "text-blue-400 bg-blue-500/10 border border-blue-500/20 shadow-sm"
                : "text-gray-400 hover:text-gray-300 hover:bg-gray-700/50"
            }`}
          >
            Code
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              activeTab === "preview"
                ? "text-blue-400 bg-blue-500/10 border border-blue-500/20 shadow-sm"
                : "text-gray-400 hover:text-gray-300 hover:bg-gray-700/50"
            }`}
          >
            Preview
          </button>
        </div>
        <SandpackProvider
          files={files}
          template="react"
          theme={"dark"}
          customSetup={{
            dependencies: {
              ...Lookup.DEPENDANCY,
            },
          }}
          options={{
            externalResources: ["https://cdn.tailwindcss.com"],
          }}
        >
          <SandpackLayout style={{ width: "100%" }}>
            {activeTab == "code" ? (
              <>
                <SandpackFileExplorer
                  style={{ height: "75vh", width: "100%" }}
                />
                <SandpackCodeEditor style={{ height: "75vh", width: "100%" }} />
              </>
            ) : (
              <>
                <SandpackPreview
                  style={{ height: "75vh", width: "100%" }}
                  showNavigator={true}
                />
              </>
            )}
          </SandpackLayout>
        </SandpackProvider>
        {(loading || !workspaceData) && (
          <div className="absolute inset-0 z-50 backdrop-blur-sm bg-black/20 flex items-center justify-center">
            <LoaderFourDemo />
          </div>
        )}
      </div>
    </div>
  );
}

export default CodeView;
