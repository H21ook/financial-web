import { getAccessToken } from "@/lib/tokens";
import { serverFetcher } from "@/lib/fetcher/serverFetcher";
import { NextResponse } from "next/server";
import { Taxpayer } from "@/types/customer";

export async function GET(request: Request) {
    const url = new URL(request.url);
    const token = await getAccessToken();
    const regno = url.searchParams.get("regno")

    if (!regno) {
        return NextResponse.json({ error: "Регистрийн дугаар оруулна уу." }, { status: 400 });
    }

    // Database-д бүртгэлтэй эсэхийг хайх
    const resSystem = await serverFetcher.get<{
        exists: boolean,
        customerOid: string,
        isActive: boolean,
        customerData: {
            Oid: string
        }
    }>("/api/customerslist/check-register/" + regno, token, {
        baseUrl: process.env.NEXT_PUBLIC_API_URL,
    })

    if (resSystem.isOk && resSystem.data.exists) {
        return NextResponse.json(resSystem.data);
    }

    const resEbarimt = await serverFetcher.get<{
        tin: number,
        data: Taxpayer,
        success: boolean,
    }>("/api/check-ebarimt?regno=" + regno, token, {
        baseUrl: process.env.NEXT_PUBLIC_API_URL,
    })

    if (!resEbarimt.isOk) {
        return NextResponse.json({ error: resEbarimt.error }, { status: resEbarimt.status });
    }

    return NextResponse.json({
        exists: false,
        ...resEbarimt.data
    });
}