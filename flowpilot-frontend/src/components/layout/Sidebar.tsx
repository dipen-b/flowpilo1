"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";
import { MAIN_NAVIGATION, ROUTES } from "@/constants";
import Button from "@/components/ui/Button";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  LayoutGrid,
  Mail,
  CheckCircle,
  Briefcase,
  Map,
  Zap,
  Users,
  FileText,
  BarChart3,
  Clock,
  FileBox,
  Layers,
  Calendar,
  Settings,
  Bell,
} from "lucide-react";
import { useUIStore } from "@/stores/ui";
import Input from "@/components/ui/Input";
import { UserMenu } from "./UserMenu";

const ICON_MAP: Record<string, React.ReactNode> = {
  LayoutGrid: <LayoutGrid size={20} />,
  Mail: <Mail size={20} />,
  CheckCircle: <CheckCircle size={20} />,
  Briefcase: <Briefcase size={20} />,
  Map: <Map size={20} />,
  Zap: <Zap size={20} />,
  Users: <Users size={20} />,
  FileText: <FileText size={20} />,
  BarChart3: <BarChart3 size={20} />,
  Clock: <Clock size={20} />,
  FileBox: <FileBox size={20} />,
  Layers: <Layers size={20} />,
  Calendar: <Calendar size={20} />,
  Settings: <Settings size={20} />,
  Bell: <Bell size={20} />,
};

function SidebarComponent() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useUIStore();

  return (
    <aside
      className={cn(
        "fixed left-0 top-16 h-[calc(100vh-64px)] bg-secondary-bg border-r border-border flex flex-col z-40",
        sidebarOpen ? "w-72" : "w-20"
      )}
      style={{
        transition: "width 0.3s ease-out",
      }}
    >
      {/* Logo */}
      <div className="p-4 flex items-center justify-between">
        {sidebarOpen && <h1 className="text-xl font-bold text-accent-purple">FlowPilot</h1>}
        <button
          onClick={toggleSidebar}
          className="p-1 hover:bg-card-bg rounded-lg transition-colors"
        >
          {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      {/* Search */}
      {sidebarOpen && (
        <div className="px-4 py-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-text" size={16} />
            <Input
              placeholder="Search..."
              className="pl-9 text-sm"
            />
          </div>
        </div>
      )}

      {/* Quick Create */}
      {sidebarOpen && (
        <div className="px-4 py-2">
          <Button className="w-full" size="sm">
            <Plus size={16} className="mr-2" />
            Create
          </Button>
        </div>
      )}

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {MAIN_NAVIGATION.map((item: any) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors mb-1",
                isActive
                  ? "bg-gray-700 text-white font-semibold"
                  : "text-secondary-text hover:bg-card-bg hover:text-primary-text"
              )}
              title={item.label}
            >
              <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
                {ICON_MAP[item.icon] || <Briefcase size={20} />}
              </div>
              {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-border">
        {sidebarOpen ? (
          <UserMenu />
        ) : (
          <div className="flex justify-center">
            <div className="w-8 h-8 rounded-full bg-gray-600" />
          </div>
        )}
      </div>
    </aside>
  );
}

const Sidebar = React.memo(SidebarComponent);
export default Sidebar;
