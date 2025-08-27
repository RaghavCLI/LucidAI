import ChatView from "@/components/customs/ChatView";
import CodeView from "@/components/customs/CodeView";
import React from "react";

function Page() {
  return (
    <div className="relative flex flex-row h-full">
      {/* No extra padding or grid on the outermost container */}
      {/* The sidebar will be fixed at the left edge by ThemeProvider */}

      <main className="flex-1 flex flex-col md:flex-row gap-8">
        <div className="flex-1 md:max-w-md">
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
