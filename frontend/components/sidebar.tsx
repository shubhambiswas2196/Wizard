"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

type SidebarProps = {
  user: {
    first_name: string;
    email: string;
  };
  orgName: string;
  avatarInitial: string;
};

export function Sidebar({ user, orgName, avatarInitial }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved === "true") {
      setIsCollapsed(true);
      document.documentElement.style.setProperty("--sidebar-width", "80px");
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem("sidebar-collapsed", newState.toString());
    document.documentElement.style.setProperty(
      "--sidebar-width", 
      newState ? "80px" : "260px"
    );
  };

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Leads", href: "/dashboard/leads", icon: Users },
    { name: "Deals", href: "/dashboard/deals", icon: Briefcase },
    { name: "Settings", href: "/dashboard/settings/fields", icon: Settings },
  ];

  return (
    <aside 
      className={cn(
        "bg-[#0747A6] border-r border-[#0052CC]/20 flex flex-col h-screen sticky top-0 transition-all duration-300 ease-in-out p-3 text-white",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className={cn("flex items-center gap-3 pb-8 pt-2", isCollapsed ? "justify-center" : "px-3")}>
        <div className="min-w-8 h-8 bg-white/20 rounded flex items-center justify-center text-white font-bold text-lg border border-white/10">
          W
        </div>
        {!isCollapsed && (
          <div className="flex flex-col">
            <span className="font-bold text-white text-sm tracking-tight leading-tight">
              Wizard CRM
            </span>
            <span className="text-[10px] text-white/60 font-medium tracking-wide">Sales Project</span>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.name} 
              href={item.href} 
              className={cn(
                "flex items-center gap-3 p-2.5 rounded transition-all font-semibold text-[13px]",
                isActive 
                  ? "bg-white/20 text-white" 
                  : "text-white/80 hover:bg-white/10 hover:text-white",
                isCollapsed && "justify-center"
              )}
              title={isCollapsed ? item.name : ""}
            >
              <Icon size={18} className={cn(isActive ? "text-white" : "text-white/70")} />
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="pt-4 border-t border-white/10 mt-auto">
        <div className={cn("flex items-center gap-3 p-2", isCollapsed ? "justify-center" : "")}>
          <Avatar className="w-8 h-8 rounded-sm ring-1 ring-white/20">
            <AvatarFallback className="bg-white/10 text-white text-xs font-bold rounded-sm uppercase">
              {avatarInitial}
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="text-[12px] font-bold text-white truncate">{user.first_name}</span>
              <span className="text-[10px] text-white/50 truncate uppercase tracking-tighter">{orgName}</span>
            </div>
          )}
        </div>
        
        <Button 
          variant="ghost" 
          onClick={toggleSidebar}
          className="w-full mt-3 h-8 flex items-center justify-center hover:bg-white/10 text-white/50 hover:text-white rounded"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>
    </aside>
  );
}
