import { NextRequest, NextResponse } from "next/server";
import { proxyToDjango } from "@/lib/django";

export async function GET(
    request: NextRequest,
    { params }: { params: { path: string[] } }
) {
    const { path } = await params;
    const url = `/crm/api/${path.join("/")}/`;
    const response = await proxyToDjango(url);
    if (!response.ok) {
        return NextResponse.json(await response.json(), { status: response.status });
    }
    return NextResponse.json(await response.json());
}

export async function POST(
    request: NextRequest,
    { params }: { params: { path: string[] } }
) {
    try {
        const { path } = await params;
        const url = `/crm/api/${path.join("/")}/`;
        const body = await request.json().catch(() => ({}));

        console.log(`[Proxy] POST ${url}`, body);
        
        const response = await proxyToDjango(url, {
            method: "POST",
            body: body,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[Proxy] Backend Error ${response.status}:`, errorText);
            try {
                return NextResponse.json(JSON.parse(errorText), { status: response.status });
            } catch {
                return NextResponse.json({ detail: errorText || "Backend error" }, { status: response.status });
            }
        }

        const data = await response.json();
        const nextResponse = NextResponse.json(data, { status: response.status });
        const setCookies = response.headers.getSetCookie();

        if (setCookies && setCookies.length > 0) {
            setCookies.forEach((cookie) => {
                nextResponse.headers.append("set-cookie", cookie);
            });
        }

        return nextResponse;
    } catch (error: any) {
        console.error(`[Proxy] Internal Proxy Error:`, error.message);
        return NextResponse.json({ detail: "Internal server error" }, { status: 500 });
    }
}
