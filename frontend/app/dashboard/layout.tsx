import { redirect } from "next/navigation";
import { proxyToDjango } from "@/lib/django";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";

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
  try {
    const response = await proxyToDjango("/api/auth/me/");
    if (!response.ok) return null;
    
    const bodyText = await response.text();
    try {
      return JSON.parse(bodyText);
    } catch {
      console.error("[DashboardLayout] Malformed JSON from backend:", bodyText.slice(0, 100));
      return null;
    }
  } catch (err) {
    console.error("[DashboardLayout] Connection error:", err);
    return null;
  }
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

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        
        <main className="flex-1 overflow-y-auto p-8 relative flex flex-col items-center">
            <div className="w-full">
                {children}
            </div>
        </main>
      </div>
    </div>
  );
}

