import ChatView from "@/components/customs/ChatView";
import CodeView from "@/components/customs/CodeView";
import React from "react";

function Page() {
  return (
    <div className=" p-3 pt-4 py-1">
      <main className="flex-1 flex flex-col md:flex-row gap-8">
        <div className=" flex-1 md:max-w-md">
          <ChatView />
        </div>
        <div className="flex-1">
          <CodeView />
        </div>
      </main>
    </div>
  );
}

export default Page;
