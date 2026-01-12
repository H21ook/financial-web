import { getCustomersList } from "@/lib/services";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const url = new URL(request.url);
    const accountantOid = url.searchParams.get("accountantOid") || ''

    const res = await getCustomersList(accountantOid);

    return NextResponse.json(res);
}