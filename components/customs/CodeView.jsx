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
import prompt from "@/app/data/Prompt";
import { useMutation } from "convex/react";
import { useParams } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { useQuery, useConvex } from "convex/react";
import LoaderFourDemo from "@/components/ui/loader-four-demo";
import { countToken } from "./ChatView";
import { UserDetailContext } from "@/context/UserDetailContext";

function CodeView() {
  const { id } = useParams();
  const { userDetail, setuserDetail } = useContext(UserDetailContext);
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
      console.log("AI Response:", result.data);

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
    } catch (error) {
      console.error("Error generating code:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="relative flex w-full">
      <div className="bg-[#181818] border p-2 w-[900px] min-w-[900px] max-w-[900px] mx-auto">
        <div className="flex items-center flex-wrap">
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
