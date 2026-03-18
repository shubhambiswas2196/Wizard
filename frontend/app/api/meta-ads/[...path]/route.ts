import { NextResponse } from "next/server";
import { proxyToDjango } from "@/lib/django";

async function handleRequest(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: pathSegments } = await params;
  const path = pathSegments.join("/");
  const url = `/api/meta-ads/${path}/`.replace(/\/+$/, "/");
  
  const options: RequestInit = {
    method: request.method,
    headers: request.headers,
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    try {
      options.body = JSON.stringify(await request.json());
    } catch (e) {
      // Body might be empty or not JSON
    }
  }

  const response = await proxyToDjango(url, options);
  
  let data;
  try {
    data = await response.json();
  } catch (e) {
    return new NextResponse(await response.text(), { 
      status: response.status,
      headers: { "Content-Type": "text/plain" }
    });
  }

  return NextResponse.json(data, { status: response.status });
}

export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const DELETE = handleRequest;
