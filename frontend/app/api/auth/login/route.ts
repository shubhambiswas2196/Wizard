import { NextResponse } from "next/server";
import { proxyToDjango } from "@/lib/django";

export async function POST(request: Request) {
  const body = await request.json();
  const response = await proxyToDjango("/api/auth/login/", {
    method: "POST",
    body,
  });
  const data = await response.json();
  const nextResponse = NextResponse.json(data, { status: response.status });
  const setCookies = response.headers.getSetCookie();

  if (setCookies && setCookies.length > 0) {
    setCookies.forEach((cookie) => {
      nextResponse.headers.append("set-cookie", cookie);
    });
  }

  return nextResponse;
}
