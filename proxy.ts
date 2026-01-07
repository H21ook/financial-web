import { NextRequest, NextResponse } from "next/server";
import { ACCESS_TOKEN_KEY } from "./lib/config";

export function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const token = req.cookies.get(ACCESS_TOKEN_KEY)?.value;

    const isAuthPages = pathname.startsWith("/auth")
    const isProtectedPages = pathname.startsWith("/dashboard")
    const isInternalApi = pathname.startsWith("/internal") && !pathname.startsWith("/internal/auth")

    if (!token && isInternalApi) {
        const res = NextResponse.json(
            { error: "UNAUTHORIZED" },
            { status: 401 }
        )
        res.cookies.delete(ACCESS_TOKEN_KEY)
        return res
    }

    if (!token && isProtectedPages) {
        const loginUrl = new URL("/auth/login", req.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
    }

    if (token && isAuthPages) {
        return NextResponse.redirect(
            new URL("/dashboard", req.url)
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
};