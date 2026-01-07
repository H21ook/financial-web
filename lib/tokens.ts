"use server";

import { User } from "@/types/auth.types";
import { ACCESS_TOKEN_KEY, USER_DATA_KEY } from "./config";
import { cookies } from "next/headers";

export async function setTokens(access: string, userData: any) {
    const cookie = await cookies();

    const maxAge = 60 * 60 * 24 * 6; // 6 days
    cookie.set(ACCESS_TOKEN_KEY, access, {
        httpOnly: true,
        secure: true,
        path: "/",
        maxAge,
    });

    cookie.set(USER_DATA_KEY, JSON.stringify(userData), {
        httpOnly: true,
        secure: true,
        path: "/",
        maxAge,
    });
}

export async function clearTokens() {
    const cookie = await cookies();
    cookie.delete(ACCESS_TOKEN_KEY);
    cookie.delete(USER_DATA_KEY);
}

export async function getAccessToken() {
    const cookie = await cookies();
    const accessToken = cookie.get(ACCESS_TOKEN_KEY)?.value;
    return accessToken;
}

export async function getAuthenticatedData(): Promise<{ token: string; user: User } | null> {
    const cookie = await cookies();
    const userData = cookie.get(USER_DATA_KEY)?.value;
    const accessToken = cookie.get(ACCESS_TOKEN_KEY)?.value;
    if (!userData || !accessToken) return null;
    return {
        token: accessToken,
        user: JSON.parse(userData),
    };
}