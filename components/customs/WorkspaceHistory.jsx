"use client";
import React, { use, useEffect } from "react";
import { useContext } from "react";
import { UserDetailContext } from "@/context/UserDetailContext";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import Link from "next/link";
import { useMutation } from "convex/react";
import { workspace } from "@/convex/_generated/api";
import Image from "next/image";

function WorkspaceHistory() {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const convex = useConvex();
  const [workspaceList, setWorkspaceList] = useState();
  const DeleteWorkspace = useMutation(api.workspace.DeleteWorkspace);

  useEffect(() => {
    if (userDetail?._id) {
      GetAllWorkspace();
    }
  }, [userDetail]);

  const GetAllWorkspace = async () => {
    if (!userDetail?._id) return;
    const result = await convex.query(api.workspace.GetAllWorkspace, {
      userId: userDetail._id,
    });
    setWorkspaceList(result);
  };

  const DeleteAWorkspace = async (workspaceId) => {
    await DeleteWorkspace({ workspaceId });
    setWorkspaceList((prev) => prev.filter((ws) => ws._id !== workspaceId));
  };

  return (
    <div className="flex flex-col">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
        Your Chats
      </h2>
      <div className="flex flex-col gap-0.5">
        {workspaceList &&
          workspaceList.map((workspace, index) => (
            <div
              key={workspace._id}
              className="group relative flex items-center rounded-lg px-2 py-2 transition-colors duration-200 ease-out hover:bg-slate-50/50"
            >
              <Link
                href={"/workspace/" + workspace._id}
                className="flex-1 truncate pr-2"
              >
                <div className="text-sm text-white truncate transition-colors duration-200 ease-out group-hover:text-slate-800">
                  {workspace?.messages[0]?.content || "Untitled Workspace"}
                </div>
              </Link>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  DeleteAWorkspace(workspace._id);
                }}
                className="flex items-center justify-center w-6 h-6 rounded-md opacity-0 transition-all duration-200 ease-out group-hover:opacity-100 hover:bg-red-50/80 hover:scale-105 active:scale-95"
                title="Delete workspace"
              >
                <Image
                  src="/trash.svg"
                  alt="Delete"
                  width={12}
                  height={12}
                  className="text-slate-400 transition-colors duration-200 ease-out group-hover:text-red-400"
                />
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}

export default WorkspaceHistory;
