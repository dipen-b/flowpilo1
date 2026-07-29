"use client";

import React from "react";
import Sidebar from "./Sidebar";
import { MainContent } from "./MainContent";
import { ContextPanel } from "./ContextPanel";
import Header from "./Header";
import { useUIStore } from "@/stores/ui";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { sidebarOpen } = useUIStore();

  return (
    <div className="flex h-screen bg-primary-bg overflow-hidden flex-col">
      {/* Header */}
      <Header />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Content Wrapper */}
        <div
          className="flex-1 flex"
          style={{ marginLeft: sidebarOpen ? "288px" : "80px" }}
        >
          <MainContent>{children}</MainContent>

          {/* Context Panel */}
          <ContextPanel />
        </div>
      </div>
    </div>
  );
}

export default AppLayout;
