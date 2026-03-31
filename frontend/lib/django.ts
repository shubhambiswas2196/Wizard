import { cookies, headers } from "next/headers";

async function resolveApiBase() {
  if (process.env.DJANGO_API_BASE) return process.env.DJANGO_API_BASE;
  const h = await headers();
  const host = h.get("host");
  
  // Default to IPv4 loopback to avoid IPv6 resolution issues on Windows/macOS
  if (!host) return "http://127.0.0.1:8000";
  
  const hostname = host.split(":")[0];
  // If we're on localhost, explicitly use 127.0.0.1 for the backend connection
  const targetHost = (hostname === 'localhost' || hostname === '::1') ? '127.0.0.1' : hostname;
  
  return `http://${targetHost}:8000`;
}

type ProxyOptions = {
  method?: string;
  body?: unknown;
};

export async function proxyToDjango(path: string, options: ProxyOptions = {}) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");

  const apiBase = await resolveApiBase();
  const csrfToken = cookieStore.get("csrftoken")?.value;
  const h = await headers();
  const originalHost = h.get("host");

  return fetch(`${apiBase}${path}`, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(sessionCookie ? { Cookie: sessionCookie } : {}),
      ...(csrfToken ? { "X-CSRFToken": csrfToken } : {}),
      ...(originalHost ? { "X-Forwarded-Host": originalHost.split(':')[0] + ':8000' } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
    redirect: "manual",
  });
}
