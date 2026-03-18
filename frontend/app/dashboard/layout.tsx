import { SidebarDual } from "@/components/sidebar-dual";
import { TopPanel } from "@/components/top-panel";
import { proxyToDjango } from "@/lib/django";
import { redirect } from "next/navigation";

async function getCurrentUser() {
  const response = await proxyToDjango("/api/auth/me/");
  if (response.status === 401) return null;
  if (!response.ok) throw new Error("Failed to load user");
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

  return (
    <div className="app-frame">
      <div className="magic-bg" />
      <SidebarDual />
      <div className="page" style={{ display: 'flex', flexDirection: 'column' }}>
        <TopPanel user={user} orgName={orgName} />
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <main className="shell" style={{ flex: 1, overflowY: 'auto' }}>{children}</main>
        </div>
      </div>
    </div>
  );
}
