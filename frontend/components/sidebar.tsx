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
        "bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0 transition-all duration-300 ease-in-out p-4",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className={cn("flex items-center gap-3 pb-8", isCollapsed ? "justify-center" : "px-2")}>
        <div className="min-w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-green-500/20">
          W
        </div>
        {!isCollapsed && (
          <span className="font-bold text-slate-800 text-lg whitespace-nowrap overflow-hidden">
            Wizard CRM
          </span>
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
                "flex items-center gap-3 p-3 rounded-lg transition-colors font-medium text-sm",
                isActive 
                  ? "bg-green-50 text-green-700" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                isCollapsed && "justify-center"
              )}
              title={isCollapsed ? item.name : ""}
            >
              <Icon size={22} className={cn(isActive ? "text-green-600" : "text-slate-400")} />
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="pt-4 border-t border-slate-100 mt-auto">
        <div className={cn("flex items-center gap-3 p-2", isCollapsed ? "justify-center" : "")}>
          <Avatar className="w-9 h-9 ring-2 ring-slate-100">
            <AvatarFallback className="bg-slate-800 text-white font-semibold">
              {avatarInitial}
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-semibold text-slate-800 truncate">{user.first_name}</span>
              <span className="text-xs text-slate-500 truncate">{orgName}</span>
            </div>
          )}
        </div>
        
        <Button 
          variant="ghost" 
          onClick={toggleSidebar}
          className="w-full mt-3 flex items-center justify-center hover:bg-slate-100"
        >
          {isCollapsed ? <ChevronRight size={22} /> : <ChevronLeft size={22} />}
        </Button>
      </div>
    </aside>
  );
}
