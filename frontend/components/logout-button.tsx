"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleLogout() {
    setPending(true);
    await fetch("/api/auth/logout", { method: "POST" });
    setPending(false);
    router.push("/");
    router.refresh();
  }

  return (
    <button className="button secondary" type="button" onClick={handleLogout} disabled={pending}>
      {pending ? "Signing out" : "Logout"}
    </button>
  );
}
