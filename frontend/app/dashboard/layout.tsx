import { redirect } from "next/navigation";
import { proxyToDjango } from "@/lib/django";
import { Sidebar } from "@/components/sidebar";
import { Search, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type UserResponse = {
  authenticated: boolean;
  user: {
    first_name: string;
    last_name: string;
    email: string;
    organization: {
      name: string;
      slug: string;
    } | null;
    request_organization: {
      name: string;
      slug: string;
    } | null;
  } | null;
};

async function getCurrentUser(): Promise<UserResponse | null> {
  const response = await proxyToDjango("/api/auth/me/");
  if (response.status === 401) return null;
  if (!response.ok) throw new Error("Failed to load current user.");
  return response.json();
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await getCurrentUser();

  if (!data?.user) {
    redirect("/login");
  }

  const { user } = data;
  const orgName = user.organization ? user.organization.name : "Not assigned";
  const tenantSlug = user.request_organization ? user.request_organization.slug : "No subdomain";
  const avatarInitial = (user.first_name || user.email || "U").charAt(0).toUpperCase();

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50/50">
      <Sidebar 
          user={{ first_name: user.first_name, email: user.email }} 
          orgName={orgName} 
          avatarInitial={avatarInitial} 
      />

      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40 shadow-sm shadow-slate-100/50">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input 
              type="text" 
              placeholder="Search leads, deals, or activity..." 
              className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-all rounded-full h-10 w-full" 
            />
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-900 rounded-full">
              <Bell size={20} />
            </Button>
            <Badge variant="outline" className="px-3 py-1 bg-green-50 text-green-700 border-green-200 font-bold tracking-tight">
              {tenantSlug}
            </Badge>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
