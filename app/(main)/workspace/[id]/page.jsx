import ChatView from "@/components/customs/ChatView";
import CodeView from "@/components/customs/CodeView";
import React from "react";

function Page() {
  return (
    <div className="py-2 px-2 ">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <ChatView />
        </div>
        <div className="md:col-span-2">
          <CodeView />
        </div>
      </div>
    </div>
  );
}

export default Page;
