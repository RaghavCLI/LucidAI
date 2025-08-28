"use client";
import React, { use, useEffect } from "react";
import { useContext } from "react";
import { UserDetailContext } from "@/context/UserDetailContext";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import Link from "next/link";

function WorkspaceHistory() {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const convex = useConvex();
  const [workspaceList, setWorkspaceList] = useState();

  useEffect(() => {
    userDetail && GetAllWorkspace();
  }, [userDetail]);

  const GetAllWorkspace = async () => {
    const result = await convex.query(api.workspace.GetAllWorkspace, {
      userId: userDetail?._id,
    });
    setWorkspaceList(result);
  };
  return (
    <div className="flex flex-col">
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
        your chats
      </h2>
      <div className="flex flex-col gap-1">
        {workspaceList &&
          workspaceList?.map((workspace, index) => (
            <Link href={"/workspace/" + workspace?._id} key={index}>
              <button className="text-sm text-gray-400 font-light px-2 py-1 rounded transition-colors hover:bg-gray-200 hover:text-gray-600 border-none cursor-pointer w-full text-left truncate">
                {workspace?.messages[0]?.content}
              </button>
            </Link>
          ))}
      </div>
    </div>
  );
}

export default WorkspaceHistory;
