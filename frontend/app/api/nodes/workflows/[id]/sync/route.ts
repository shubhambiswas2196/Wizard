import { NextResponse } from "next/server";
import { proxyToDjango } from "@/lib/django";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const response = await proxyToDjango(`/api/nodes/workflows/${id}/sync_graph/`, {
    method: "POST",
    body,
  });
  
  if (!response.ok) {
    return NextResponse.json({ error: "Failed to sync graph" }, { status: response.status });
  }
  
  const data = await response.json();
  return NextResponse.json(data);
}
