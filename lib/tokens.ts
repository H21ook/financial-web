"use server";

import { ACCESS_TOKEN_KEY } from "./config";
import { cookies } from "next/headers";

export async function setTokens(access: string) {
    const cookie = await cookies();

    cookie.set(ACCESS_TOKEN_KEY, access, {
        httpOnly: true,
        secure: true,
        path: "/",
        // maxAge: 60 * 15, // 15 min
        maxAge: 60 * 60, // 1 min
    });
}

export async function clearTokens() {
    const cookie = await cookies();
    cookie.delete(ACCESS_TOKEN_KEY);
}

export async function getAccessToken() {
    const cookie = await cookies();
    const accessToken = cookie.get(ACCESS_TOKEN_KEY)?.value;
    return accessToken;
}