"use client";
import React, { useContext, useEffect } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackFileExplorer,
} from "@codesandbox/sandpack-react";
import { useState } from "react";
import Lookup from "@/app/data/Lookup";
import { MessagesContext } from "@/context/MessagesContext";
import axios from "axios";
import prompt from "@/app/data/Prompt";
import { useMutation } from "convex/react";
import { useParams } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { useQuery, useConvex } from "convex/react";
import LoaderFourDemo from "@/components/ui/loader-four-demo";

function CodeView() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("code");
  const [files, setFiles] = useState(Lookup?.DEFAULT_FILE);
  const { messages, setMessages } = useContext(MessagesContext);
  const UpdateFiles = useMutation(api.workspace.UpdateFiles);
  const [loading, setLoading] = useState(false);

  const workspaceData = useQuery(api.workspace.GetWorkspace, {
    workspaceId: id,
  });

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
      if (role === "msg") {
        GenerateAiCode();
      }
    }
  }, [messages]);

  const GenerateAiCode = async () => {
    try {
      setLoading(true);
      const userRequest = messages[messages.length - 1]?.content || "";
      const PROMPT = `Create a React application that: ${userRequest}\n\n${prompt.CODE_GEN_PROMPT}`;

      const result = await axios.post("/api/gen-ai-code", {
        prompt: PROMPT,
      });

      const AiResp = result.data;
      const mergedFiles = { ...Lookup.DEFAULT_FILE, ...AiResp?.files };
      setFiles(mergedFiles);

      await UpdateFiles({
        workspaceId: id,
        files: AiResp?.files,
      });
    } catch (error) {
      console.error("Error generating code:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="relative">
      <div className="bg-[#181818] w-full p-2 border">
        <div className="flex items-center flex-wrap shrink-0 bg-black p-1 w-[140px] gap-3">
          <h2
            onClick={() => setActiveTab("code")}
            className={`text-sm cursor-pointer ${activeTab == "code" && "text-blue-500 bg-opacity-25 p-1 px-2 rounded-full"}`}
          >
            Code
          </h2>
          <h2
            onClick={() => setActiveTab("preview")}
            className={`text-sm cursor-pointer ${activeTab == "preview" && "text-blue-500 bg-opacity-25 p-1 px-2 rounded-full"}`}
          >
            Preview
          </h2>
        </div>
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
        <SandpackLayout>
          {activeTab == "code" ? (
            <>
              <SandpackFileExplorer style={{ height: "75vh" }} />
              <SandpackCodeEditor style={{ height: "75vh" }} />
            </>
          ) : (
            <>
              <SandpackPreview
                style={{ height: "75vh" }}
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
  );
}

export default CodeView;
