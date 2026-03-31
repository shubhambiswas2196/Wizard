"use client";

import { IconSearch, IconPlus, IconBell, IconHelpCircle, IconChevronDown } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Topbar() {
  return (
    <header className="h-16 border-b border-border bg-white sticky top-0 z-40 px-8 flex items-center justify-between">
      <div className="flex items-center gap-4 flex-1 max-w-2xl">
        <div className="relative w-full">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <Input 
            className="w-full pl-10 h-10 bg-slate-50 border-transparent focus:bg-white focus:border-primary transition-all rounded-xl"
            placeholder="Search your CRM (Accounts, Leads, Deals...)"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl h-10 px-4 font-bold flex items-center gap-2 shadow-sm">
          <IconPlus size={18} />
          Add Account
        </Button>
        
        <div className="h-8 w-[1px] bg-slate-100 mx-2" />

        <Button variant="ghost" size="icon" className="text-slate-500 rounded-xl">
          <IconBell size={20} />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1 rounded-xl transition-colors">
              <Avatar className="h-8 w-8 rounded-lg border border-slate-100">
                <AvatarFallback className="bg-slate-100 text-slate-600 text-[10px] font-bold">SB</AvatarFallback>
              </Avatar>
              <IconChevronDown size={14} className="text-slate-400" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mt-2 rounded-xl border-slate-200 shadow-xl">
            <DropdownMenuLabel className="font-bold">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">Profile Settings</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">Organization</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">Billing</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600 font-bold cursor-pointer">Sign Out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
