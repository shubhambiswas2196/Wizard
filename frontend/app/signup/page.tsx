import Link from "next/link";
import { AuthForm } from "@/components/auth-form";

export default function SignupPage() {
  return (
    <div className="page">
      <div className="magic-bg" />
      <main className="auth-shell" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '20px' }}>
        <div style={{ width: '100%', maxWidth: '480px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>
            Wizard for <br />
            <span style={{ color: 'var(--primary)', fontWeight: '400', fontStyle: 'italic' }}>Marketing professionals</span>
          </h1>
          <p className="lead" style={{ marginBottom: '32px', color: 'var(--muted)' }}>Unleash high-conversion magic for your campaigns.</p>
          
          <AuthForm mode="signup" />

          <div className="auth-footer" style={{ marginTop: '24px', fontSize: '0.95rem' }}>
            Already have an account? <Link href="/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>Log in</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
