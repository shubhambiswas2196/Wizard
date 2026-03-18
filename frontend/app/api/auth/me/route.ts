import { NextResponse } from "next/server";
import { proxyToDjango } from "@/lib/django";

export async function GET() {
  const response = await proxyToDjango("/api/auth/me/");
  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
