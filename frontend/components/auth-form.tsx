"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Mode = "login" | "signup";

type Props = {
  mode: Mode;
};

type ApiError = {
  detail?: string;
  errors?: Record<string, string[]>;
};

const fieldsByMode: Record<Mode, Array<{ name: string; label: string; type?: string }>> = {
  login: [
    { name: "username", label: "Email", type: "email" },
    { name: "password", label: "Password", type: "password" },
  ],
  signup: [
    { name: "first_name", label: "First name" },
    { name: "last_name", label: "Last name" },
    { name: "email", label: "Email", type: "email" },
    { name: "organization_name", label: "Organization name" },
    { name: "password", label: "Password", type: "password" },
  ],
};

function getAutoComplete(mode: Mode, fieldName: string) {
  if (mode === "login") {
    if (fieldName === "username") {
      return "off";
    }
    if (fieldName === "password") {
      return "new-password";
    }
  }

  if (mode === "signup") {
    if (fieldName === "first_name") {
      return "given-name";
    }
    if (fieldName === "last_name") {
      return "family-name";
    }
    if (fieldName === "email") {
      return "off";
    }
    if (fieldName === "organization_name") {
      return "organization";
    }
    if (fieldName === "password") {
      return "new-password";
    }
  }

  return "off";
}

function formatError(payload: ApiError) {
  if (payload.detail) {
    return payload.detail;
  }
  if (!payload.errors) {
    return "Request failed.";
  }
  if (payload.errors.__all__?.length) {
    return payload.errors.__all__.join(", ");
  }
  return Object.entries(payload.errors)
    .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
    .join(" ");
}

export function AuthForm({ mode }: Props) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    formRef.current?.reset();
    setMessage(null);
    setError(null);
  }, [mode]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage(null);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());
    const response = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    let data;
    try {
      data = await response.json();
    } catch (e) {
      console.error("Failed to parse response as JSON", e);
      setError("An unexpected error occurred. Please try again.");
      setPending(false);
      return;
    }

    if (!response.ok) {
      setError(formatError(data));
      setPending(false);
      return;
    }

    setMessage(data.message ?? "Success.");
    setPending(false);
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="auth-form-container">
      <form ref={formRef} className="stack" onSubmit={handleSubmit} autoComplete="off">
        <input
          type="text"
          name="fake-username"
          autoComplete="username"
          tabIndex={-1}
          aria-hidden="true"
          style={{ display: "none" }}
        />
        <input
          type="password"
          name="fake-password"
          autoComplete="new-password"
          tabIndex={-1}
          aria-hidden="true"
          style={{ display: "none" }}
        />
        {fieldsByMode[mode].map((field) => (
          <div className="field" key={field.name}>
            <label htmlFor={field.name} style={{ fontWeight: '600', color: 'var(--muted)', fontSize: '0.9rem' }}>{field.label}</label>
            <input
              id={field.name}
              name={field.name}
              type={field.type ?? "text"}
              placeholder={`Enter your ${field.label.toLowerCase()}`}
              autoComplete={getAutoComplete(mode, field.name)}
              required
              onChange={(e) => {
                const value = e.target.value;
                if (mode === "signup" && field.name === "email") {
                  const domain = value.split("@")[1];
                  
                  // Clear existing timeout if user keeps typing
                  const timeoutId = (e.target as any).checkTimeout;
                  if (timeoutId) clearTimeout(timeoutId);

                  if (domain) {
                    const [name] = domain.split(".");
                    const publicDomains = [
                      "gmail.com", "yahoo.com", "hotmail.com", "outlook.com",
                      "live.com", "icloud.com", "me.com", "msn.com", "aol.com"
                    ];
                    
                    if (publicDomains.includes(domain.toLowerCase())) {
                      setError("Please use your professional workspace email address.");
                    } else {
                      setError(null);
                      // Only auto-fill if org name field hasn't been manually touched or is empty
                      const orgInput = formRef.current?.querySelector('input[name="organization_name"]') as HTMLInputElement;
                      if (orgInput && (!orgInput.dataset.manual || !orgInput.value)) {
                        const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
                        orgInput.value = formattedName;
                      }

                      // Check if email exists (debounced)
                      (e.target as any).checkTimeout = setTimeout(async () => {
                        try {
                          const res = await fetch(`/api/auth/check-email/?email=${encodeURIComponent(value)}`);
                          const data = await res.json();
                          if (data.exists) {
                            setError("This email is already registered.");
                          } else if (!publicDomains.includes(domain.toLowerCase())) {
                             setError(null);
                          }
                        } catch (err) {
                          console.error("Failed to check email availability", err);
                        }
                      }, 600);
                    }
                  }
                }
                if (mode === "signup" && field.name === "organization_name") {
                  e.target.dataset.manual = "true";
                }
              }}
            />
          </div>
        ))}
        
        <button className="btn-black" type="submit" disabled={pending} style={{ width: '100%', marginTop: '16px', fontSize: '1rem' }}>
          {pending ? "Processing..." : mode === "login" ? "Grow your brand" : "Start your journey"}
        </button>
        
        {mode === "signup" && (
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
            <span style={{ 
              background: '#e6fffa', 
              color: '#38a169', 
              padding: '4px 12px', 
              borderRadius: '999px', 
              fontSize: '0.8rem', 
              fontWeight: '700' 
            }}>
              Save 20%
            </span>
          </div>
        )}
        
        {error ? <div className="message error" style={{ background: '#fff5f5', color: '#c53030', padding: '12px', borderRadius: '8px', border: '1px solid #feb2b2', marginTop: '16px' }}>{error}</div> : null}
        {message ? <div className="message success" style={{ background: '#f0fff4', color: '#2f855a', padding: '12px', borderRadius: '8px', border: '1px solid #9ae6b4', marginTop: '16px' }}>{message}</div> : null}
      </form>
    </div>
  );
}
