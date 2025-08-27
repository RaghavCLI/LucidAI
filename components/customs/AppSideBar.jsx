import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "../ui/button";
import WorkspaceHistory from "./WorkspaceHistory";
import Footer from "@/components/customs/Footer";
import InfoFooter from "./InfoFooter";
import Link from "next/link";

function AppSideBar() {
  return (
    <div>
      <Sidebar>
        <SidebarHeader>
          <Link href="/">
            <h1 className="text-2xl font-bold p-0 pl-5">LucidAI</h1>
          </Link>
        </SidebarHeader>

        <SidebarContent className="p-5">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2 text-blue-600 border-blue-600 hover:bg-blue-50 font-medium transition-all duration-200 mb-4"
          >
            <span>
              {/* MessageSquarePlus icon from lucide-react */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <rect width="24" height="24" fill="none" />
                <path
                  d="M17 8V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15 12h6m-3-3v6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span>Start New Chat</span>
          </Button>
          <SidebarGroup />
          <WorkspaceHistory />
          <SidebarGroup />
        </SidebarContent>
        <Footer />
        <InfoFooter />
      </Sidebar>
    </div>
  );
}

export default AppSideBar;
