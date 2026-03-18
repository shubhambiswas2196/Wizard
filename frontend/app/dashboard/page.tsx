import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/logout-button";
import { proxyToDjango } from "@/lib/django";

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

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to load current user.");
  }

  return response.json();
}

export default async function DashboardPage() {
  const data = await getCurrentUser();

  if (!data?.user) {
    redirect("/login");
  }

  const { user } = data;
  const orgName = user.organization ? user.organization.name : "Not assigned";
  const tenantSlug = user.request_organization ? user.request_organization.slug : "No subdomain";
  const avatarInitial = (user.first_name || user.email || "U").charAt(0).toUpperCase();

  return (
    <div className="shell-padded">
      <section className="glass-card" style={{ padding: '40px', marginBottom: '32px' }}>
        <header>
          <span className="eyebrow" style={{ color: 'var(--primary)', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.05em' }}>Workspace Overview</span>
          <h1 style={{ marginTop: '8px', fontSize: '2.5rem' }}>Welcome, <span style={{ color: 'var(--primary)' }}>{user.first_name || 'User'}</span></h1>
          <p style={{ fontSize: '1.2rem', marginTop: '12px', color: 'var(--muted)' }}>Nice to see you again. Here's what's happening in <strong>{orgName}</strong> today.</p>
        </header>

        <div className="stat-row" style={{ marginTop: '32px' }}>
          <div className="stat" style={{ background: 'var(--primary-bg)', border: 'none', borderRadius: '0px', padding: '24px' }}>
            <div className="stat-label" style={{ color: 'var(--primary-strong)', opacity: 0.8 }}>Member Profile</div>
            <div className="stat-value" style={{ fontWeight: '700', marginTop: '4px' }}>{user.email}</div>
          </div>
          <div className="stat" style={{ background: 'var(--primary-bg)', border: 'none', borderRadius: '0px', padding: '24px' }}>
            <div className="stat-label" style={{ color: 'var(--primary-strong)', opacity: 0.8 }}>Organization</div>
            <div className="stat-value" style={{ fontWeight: '700', marginTop: '4px' }}>{orgName}</div>
          </div>
          <div className="stat" style={{ background: 'var(--primary-bg)', border: 'none', borderRadius: '0px', padding: '24px' }}>
            <div className="stat-label" style={{ color: 'var(--primary-strong)', opacity: 0.8 }}>Access Level</div>
            <div className="stat-value" style={{ fontWeight: '700', marginTop: '4px' }}>Administrator</div>
          </div>
        </div>
      </section>

      <section className="glass-card" style={{ padding: '32px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '24px', textTransform: 'uppercase', color: 'var(--muted)', letterSpacing: '0.1em' }}>Account Details</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
          <div className="metric">
            <span className="metric-label" style={{ display: 'block', fontSize: '0.85rem', color: 'var(--muted)', fontWeight: '600' }}>Full Name</span>
            <span className="metric-value" style={{ display: 'block', fontSize: '1.1rem', fontWeight: '700', marginTop: '4px' }}>{user.first_name} {user.last_name}</span>
          </div>
          <div className="metric">
            <span className="metric-label" style={{ display: 'block', fontSize: '0.85rem', color: 'var(--muted)', fontWeight: '600' }}>Primary Email</span>
            <span className="metric-value" style={{ display: 'block', fontSize: '1.1rem', fontWeight: '700', marginTop: '4px' }}>{user.email}</span>
          </div>
          <div className="metric">
            <span className="metric-label" style={{ display: 'block', fontSize: '0.85rem', color: 'var(--muted)', fontWeight: '600' }}>Organization Slug</span>
            <span className="metric-value" style={{ display: 'block', fontSize: '1.1rem', fontWeight: '700', marginTop: '4px' }}>{user.organization?.slug || 'personal'}</span>
          </div>
          <div className="metric">
            <span className="metric-label" style={{ display: 'block', fontSize: '0.85rem', color: 'var(--muted)', fontWeight: '600' }}>Tenant ID</span>
            <span className="metric-value" style={{ display: 'block', fontSize: '1.1rem', fontWeight: '700', marginTop: '4px' }}>{tenantSlug}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
