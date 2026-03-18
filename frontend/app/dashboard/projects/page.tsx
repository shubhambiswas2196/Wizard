export default function ProjectsPage() {
  return (
    <div className="hero-panel" style={{ background: '#fff', border: '1px solid var(--border-strong)', boxShadow: 'var(--shadow-sm)', padding: '48px', borderRadius: '0px', textAlign: 'center' }}>
      <span className="eyebrow">Module</span>
      <h1 style={{ fontWeight: 700, marginTop: '12px' }}>Projects</h1>
      <p style={{ fontSize: '1.1rem', marginTop: '12px', color: 'var(--muted)' }}>The project management module is currently being finalized. Stay tuned!</p>
      
      <div style={{ marginTop: '40px', padding: '40px', border: '2px dashed var(--border)', borderRadius: '0px', background: 'var(--surface-muted)' }}>
        <p style={{ fontWeight: 600, color: 'var(--muted)' }}>Empty Slate: No projects found in this workspace.</p>
      </div>
    </div>
  );
}
