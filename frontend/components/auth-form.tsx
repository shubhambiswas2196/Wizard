"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

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
    { name: "username", label: "Email Address", type: "email" },
    { name: "password", label: "Password", type: "password" },
  ],
  signup: [
    { name: "first_name", label: "First Name" },
    { name: "last_name", label: "Last Name" },
    { name: "email", label: "Email Address", type: "email" },
    { name: "organization_name", label: "Organization Name" },
    { name: "password", label: "Password", type: "password" },
  ],
};

function getAutoComplete(mode: Mode, fieldName: string) {
  const map: Record<string, string> = {
    username: "email",
    email: "email",
    password: mode === "signup" ? "new-password" : "current-password",
    first_name: "given-name",
    last_name: "family-name",
    organization_name: "organization",
  };
  return map[fieldName] || "off";
}

function formatError(payload: ApiError) {
  if (payload.detail) return payload.detail;
  if (!payload.errors) return "Request failed.";
  if (payload.errors.__all__?.length) return payload.errors.__all__.join(", ");
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
    
    try {
      const response = await fetch(`/api/auth/${mode}/`, { // Added trailing slash for Django
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(formatError(data));
        setPending(false);
        return;
      }

      setMessage(data.message ?? "Success.");
      setPending(false);
      
      // Delay redirect to show success message
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 500);
    } catch (err) {
      setError("A network error occurred. Please try again.");
      setPending(false);
    }
  }

  return (
    <form ref={formRef} className="space-y-5" onSubmit={handleSubmit} autoComplete="off">
      <div className="space-y-4">
        {fieldsByMode[mode].map((field) => (
          <div className="space-y-2" key={field.name}>
            <label 
               htmlFor={field.name} 
               className="text-sm font-semibold tracking-tight text-slate-700"
            >
              {field.label}
            </label>
            <Input
              id={field.name}
              name={field.name}
              type={field.type ?? "text"}
              placeholder={`Enter your ${field.label.toLowerCase()}`}
              autoComplete={getAutoComplete(mode, field.name)}
              required
              className="h-11 border-slate-200 focus:border-green-500 focus:ring-green-500 rounded-xl transition-all"
            />
          </div>
        ))}
      </div>

      <Button 
        type="submit" 
        disabled={pending} 
        className="w-full h-11 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg shadow-green-600/20 active:scale-[0.98] transition-all"
      >
        {pending ? (
          <span className="flex items-center gap-2">
            <Loader2 className="animate-spin" size={18} />
            Please wait
          </span>
        ) : (
          mode === "login" ? "Sign In" : "Create Account"
        )}
      </Button>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm font-medium animate-in fade-in slide-in-from-top-1 duration-300">
          {error}
        </div>
      )}
      
      {message && (
        <div className="p-3 rounded-lg bg-green-50 border border-green-100 text-green-700 text-sm font-medium animate-in fade-in slide-in-from-top-1 duration-300">
          {message}
        </div>
      )}
    </form>
  );
}
