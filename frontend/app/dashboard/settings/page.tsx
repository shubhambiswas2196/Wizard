export default function SettingsPage() {
  return (
    <div className="hero-panel" style={{ background: '#fff', border: '1px solid var(--border-strong)', boxShadow: 'var(--shadow-sm)', padding: '48px', borderRadius: '0px', textAlign: 'center' }}>
      <span className="eyebrow">Service</span>
      <h1 style={{ fontWeight: 700, marginTop: '12px' }}>Settings</h1>
      <p style={{ fontSize: '1.1rem', marginTop: '12px', color: 'var(--muted)' }}>Configure your workspace preferences and security policies.</p>
      
      <div style={{ marginTop: '40px', textAlign: 'left', maxWidth: '500px', margin: '40px auto' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>General Settings</h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--muted)', marginTop: '8px' }}>Workspace visibility, notification preferences, and branding.</p>
      </div>
    </div>
  );
}
