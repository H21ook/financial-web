import { getAccountList } from "@/lib/services";
import { NextResponse } from "next/server";

export async function GET() {
    const res = await getAccountList();

    return NextResponse.json(res);
}