import { NextResponse } from "next/server";
import { proxyToDjango } from "@/lib/django";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const response = await proxyToDjango(`/api/nodes/workflows/${id}/`);
  if (!response.ok) return NextResponse.json({ error: "Failed to fetch workflow" }, { status: response.status });
  const data = await response.json();
  return NextResponse.json(data);
}
