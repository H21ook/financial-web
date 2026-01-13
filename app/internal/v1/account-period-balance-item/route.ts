import { getPeriodAccountBalanceItem } from "@/lib/services";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const url = new URL(request.url);
    const accountPeriodBalanceOid = url.searchParams.get("accountPeriodBalanceOid") || ''

    const res = await getPeriodAccountBalanceItem(accountPeriodBalanceOid);

    return NextResponse.json(res);
}