import { getPeriodAccountBalance } from "@/lib/services";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const url = new URL(request.url);
    const year = url.searchParams.get("year") || ''
    const customerId = url.searchParams.get("customerId") || ''

    const res = await getPeriodAccountBalance(year, customerId);

    return NextResponse.json(res);
}