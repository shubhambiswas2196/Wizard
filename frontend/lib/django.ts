import { cookies, headers } from "next/headers";

async function resolveApiBase() {
  if (process.env.DJANGO_API_BASE) return process.env.DJANGO_API_BASE;
  const h = await headers();
  const host = h.get("host");
  if (!host) return "http://localhost:8000";
  const hostname = host.split(":")[0];
  return `http://${hostname}:8000`;
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

  const csrftoken = cookieStore.get("csrftoken")?.value;
  const h = await headers();
  const originalHost = h.get("host") || "localhost:3000";
  
  const targetUrl = `http://127.0.0.1:8000${path}`;

  const proxyHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    "Host": originalHost.split(':')[0] + ':8000',
  };

  if (sessionCookie) proxyHeaders["Cookie"] = sessionCookie;
  if (csrftoken) proxyHeaders["X-CSRFToken"] = csrftoken;

  return fetch(targetUrl, {
    method: options.method ?? "GET",
    headers: proxyHeaders,
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
    redirect: "manual",
  });
}
