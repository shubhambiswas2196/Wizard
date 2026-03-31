"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  IconUsers, 
  IconBriefcase, 
  IconSettings, 
  IconLayoutGrid,
  IconChartBar,
  IconBell,
  IconHelpCircle
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: IconLayoutGrid },
    { name: "Leads", href: "/dashboard/leads", icon: IconUsers },
    { name: "Deals", href: "/dashboard/deals", icon: IconBriefcase },
    { name: "Analytics", href: "/dashboard/analytics", icon: IconChartBar },
    { name: "Settings", href: "/dashboard/settings/fields", icon: IconSettings },
  ];

  return (
    <aside className="w-16 bg-[#172B4D] flex flex-col items-center py-6 gap-8 h-screen sticky top-0 z-50">
      <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary/20">
        W
      </div>

      <nav className="flex-1 flex flex-col gap-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.name} 
              href={item.href} 
              className={cn(
                "sidebar-icon",
                isActive && "active"
              )}
              title={item.name}
            >
              <Icon size={20} />
            </Link>
          );
        })}
      </nav>

      <div className="flex flex-col gap-4 mt-auto">
        <div className="sidebar-icon">
          <IconHelpCircle size={20} />
        </div>
        <div className="sidebar-icon">
          <IconBell size={20} />
        </div>
        <Avatar className="h-10 w-10 cursor-pointer border-2 border-transparent hover:border-white/20 transition-all rounded-xl">
           <AvatarFallback className="bg-white/10 text-white text-[10px] font-bold">JD</AvatarFallback>
        </Avatar>
      </div>
    </aside>
  );
}

