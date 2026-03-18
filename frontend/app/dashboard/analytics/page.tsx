export default function AnalyticsPage() {
  return (
    <div className="hero-panel" style={{ background: '#fff', border: '1px solid var(--border-strong)', boxShadow: 'var(--shadow-sm)', padding: '48px', borderRadius: '0px', textAlign: 'center' }}>
      <span className="eyebrow">Insights</span>
      <h1 style={{ fontWeight: 700, marginTop: '12px' }}>Analytics</h1>
      <p style={{ fontSize: '1.1rem', marginTop: '12px', color: 'var(--muted)' }}>Visualize your organization's performance with deep analytics.</p>
      
      <div style={{ marginTop: '40px', height: '200px', background: 'linear-gradient(180deg, var(--surface-muted) 0%, #fff 100%)', border: '1px solid var(--border)', borderRadius: '0px', display: 'grid', placeItems: 'center' }}>
        <p style={{ fontStyle: 'italic', color: 'var(--muted)' }}>Charting library integration in progress...</p>
      </div>
    </div>
  );
}
