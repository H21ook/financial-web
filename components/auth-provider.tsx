"use client";

import { generateDeviceFingerprint } from "@/lib/device-fingerprint";
import { clientFetcher } from "@/lib/fetcher/clientFetcher";
import { CustomResponse } from "@/types";
import { LoginFormValues, User } from "@/types/auth.types";
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

type AuthContextValue = {
    status: AuthStatus;
    user: User | null;
    token: string | null;

    isLoading: boolean;
    isLogged: boolean;

    login: (payload: LoginFormValues) => Promise<CustomResponse<AuthResponse>>;
    refresh: () => Promise<void>;
    logout: () => Promise<void>;

    // setUser: (u: AuthUser | null) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type AuthResponse = {
    user: User;
    token: string;
};

type LogoutResponse = { ok: true };

export function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [status, setStatus] = useState<AuthStatus>("loading");
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);

    const clearState = useCallback(() => {
        setUser(null);
        setToken(null);
        setStatus("unauthenticated");
    }, []);

    const refresh = useCallback(async () => {
        try {
            const response = await clientFetcher.get<AuthResponse>("/internal/auth/get-auth-data");

            if (response.isOk) {
                setUser(response.data.user);
                setToken(response.data.token);
                setStatus("authenticated");
            } else {
                clearState();
            }
        } catch {
            clearState();
        }
    }, [clearState]);

    const login = async (payload: LoginFormValues): Promise<CustomResponse<AuthResponse>> => {
        setStatus("loading");
        try {
            const fingerprint = generateDeviceFingerprint();
            const response = await clientFetcher.post<AuthResponse, LoginFormValues>("/internal/auth/login", payload, undefined, {
                customHeaders: {
                    "x-device-id": fingerprint || "",
                }
            });
            if (response.isOk) {
                setUser(response.data.user);
                setToken(response.data.token);
                setStatus("authenticated");
            } else {
                setStatus("unauthenticated");
            }
            return response;
        } catch (e) {
            setStatus("unauthenticated");
            return {
                isOk: false,
                error: "Нэвтрэх үйлдэл амжилтгүй боллоо.",
            };
        }
    }

    const logout = useCallback(
        async () => {
            try {
                await clientFetcher.post<LogoutResponse>("/internal/auth/logout");
            } catch {
            } finally {
                window.location.href = "/auth/login";
                clearState();
            }
        },
        [clearState]
    );

    // Initial auth state
    useEffect(() => {
        refresh()
    }, [refresh]);

    const value = useMemo<AuthContextValue>(
        () => ({
            status,
            user,
            token,
            isLoading: status === "loading",
            isLogged: status === "authenticated",
            login,
            refresh,
            logout,
        }),
        [status, user, token, login, refresh, logout]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within <AuthProvider />");
    return ctx;
}
