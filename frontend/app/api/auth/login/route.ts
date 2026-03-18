import { NextResponse } from "next/server";
import { proxyToDjango } from "@/lib/django";

export async function POST(request: Request) {
  const body = await request.json();
  const response = await proxyToDjango("/api/auth/login/", {
    method: "POST",
    body,
  });
  let data;
  try {
    data = await response.json();
  } catch (e) {
    console.error("Failed to parse Django response as JSON", e);
    return new NextResponse("Internal Server Error: Backend returned non-JSON response", { status: 500 });
  }

  const nextResponse = NextResponse.json(data, { status: response.status });
  const setCookie = response.headers.get("set-cookie");

  if (setCookie) {
    nextResponse.headers.set("set-cookie", setCookie);
  }

  return nextResponse;
}
