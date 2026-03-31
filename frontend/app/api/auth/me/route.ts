import { NextResponse } from "next/server";
import { proxyToDjango } from "@/lib/django";

export async function GET() {
  try {
    const response = await proxyToDjango("/api/auth/me/");
    const bodyText = await response.text();
    let data;
    try {
      data = JSON.parse(bodyText);
    } catch {
      data = { detail: bodyText || "Backend error (HTML response)" };
    }
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error(`[Proxy] Auth ME Error:`, error.message);
    return NextResponse.json({ detail: "Internal proxy error" }, { status: 500 });
  }
}
