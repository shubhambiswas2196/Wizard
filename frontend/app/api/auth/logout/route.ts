import { NextResponse } from "next/server";
import { proxyToDjango } from "@/lib/django";

export async function POST() {
  const response = await proxyToDjango("/api/auth/logout/", {
    method: "POST",
  });
  const data = await response.json();
  const nextResponse = NextResponse.json(data, { status: response.status });
  const setCookie = response.headers.get("set-cookie");

  if (setCookie) {
    nextResponse.headers.set("set-cookie", setCookie);
  } else {
    nextResponse.cookies.set("sessionid", "", {
      expires: new Date(0),
      path: "/",
    });
  }

  return nextResponse;
}
