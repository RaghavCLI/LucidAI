import ChatView from "@/components/customs/ChatView";
import CodeView from "@/components/customs/CodeView";
import React from "react";

function Page() {
  return (
    <div className="px-3 pt-3 pr-5 mt-3 h-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 ml-0">
        <ChatView />

        <div className="col-span-2 pb-0 p-0">
          <CodeView />
        </div>
      </div>
    </div>
  );
}

export default Page;
