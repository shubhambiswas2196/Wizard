"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface LogoutButtonProps {
  className?: string;
  children?: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
}

export function LogoutButton({ className, children, variant = "secondary" }: LogoutButtonProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleLogout() {
    setPending(true);
    await fetch("/api/auth/logout", { method: "POST" });
    setPending(false);
    router.push("/");
    router.refresh();
  }

  const baseClass = variant === "ghost" ? "" : "button " + (variant === "secondary" ? "secondary" : "");

  return (
    <button 
      className={className || baseClass} 
      type="button" 
      onClick={handleLogout} 
      disabled={pending}
    >
      {pending ? "Signing out..." : (children || "Logout")}
    </button>
  );
}
