import { NextRequest, NextResponse } from "next/server";
import { proxyToDjango } from "@/lib/django";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  
  const response = await proxyToDjango(`/api/auth/check-email/?email=${encodeURIComponent(email || "")}`);
  
  let data;
  try {
    data = await response.json();
  } catch (err) {
    data = { error: "Backend failed to provide a valid JSON response." };
  }
  
  return NextResponse.json(data, { status: response.status });
}
