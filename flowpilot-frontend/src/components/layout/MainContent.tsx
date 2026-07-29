import React from "react";
import { cn } from "@/utils/cn";

interface MainContentProps {
  children: React.ReactNode;
}

export function MainContent({ children }: MainContentProps) {
  const mainRef = React.useRef<HTMLDivElement>(null);

  return (
    <main
      ref={mainRef}
      className="flex-1 overflow-auto bg-primary-bg scroll-smooth"
    >
      <div className="p-8">
        {children}
      </div>
    </main>
  );
}

export default MainContent;
