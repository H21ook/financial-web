import { serverFetcher } from "@/lib/fetcher/serverFetcher";
import { getAccessToken } from "@/lib/tokens";
import { NextResponse } from "next/server";


export async function GET() {
    const token = await getAccessToken();

    const res = await serverFetcher.get("/api/customerslist/accountant/customers", token, {
        baseUrl: process.env.NEXT_PUBLIC_API_URL,
    })

    if (!res.isOk) {
        return NextResponse.json({ error: res.error }, { status: res.status });
    }

    return NextResponse.json(res.data);
}