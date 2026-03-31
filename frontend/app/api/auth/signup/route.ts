import { NextResponse } from "next/server";
import { proxyToDjango } from "@/lib/django";

export async function POST(request: Request) {
  const body = await request.json();
  const response = await proxyToDjango("/api/auth/signup/", {
    method: "POST",
    body,
  });
  const data = await response.json();
  const nextResponse = NextResponse.json(data, { status: response.status });
  const setCookie = response.headers.get("set-cookie");

  if (setCookie) {
    nextResponse.headers.set("set-cookie", setCookie);
  }

  return nextResponse;
}
