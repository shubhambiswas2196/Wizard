export default function MembersPage() {
  return (
    <div className="hero-panel" style={{ background: '#fff', border: '1px solid var(--border-strong)', boxShadow: 'var(--shadow-sm)', padding: '48px', borderRadius: '0px', textAlign: 'center' }}>
      <span className="eyebrow">Team</span>
      <h1 style={{ fontWeight: 700, marginTop: '12px' }}>Members</h1>
      <p style={{ fontSize: '1.1rem', marginTop: '12px', color: 'var(--muted)' }}>Manage your workspace members and their roles in this section.</p>
      
      <div style={{ marginTop: '40px', display: 'grid', gap: '12px', maxWidth: '400px', margin: '40px auto' }}>
        <div style={{ padding: '16px', background: 'var(--surface-muted)', borderRadius: '0px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary-bg)', color: 'var(--primary)', display: 'grid', placeItems: 'center', fontWeight: 'bold' }}>S</div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontWeight: 600 }}>Shubham Biswas</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Administrator</div>
          </div>
        </div>
      </div>
    </div>
  );
}
