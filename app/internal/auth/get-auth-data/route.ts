import { getAuthenticatedData } from "@/lib/tokens";
import { NextResponse } from "next/server";

export async function GET() {
    const userData = await getAuthenticatedData();
    return NextResponse.json(userData);
}
