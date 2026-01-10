import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import Logo from "../logo";

export default function SiteFooter() {
    return (
        <footer className="border-t border-border/60 bg-background/70">
            <div className="mx-auto max-w-6xl px-4 py-10">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div>
                        <Logo />
                        <Suspense fallback={<Skeleton className="h-4 w-50" />}>
                            <Copyright />
                        </Suspense>
                    </div>

                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                        <Link className="hover:text-foreground" href="#services">
                            Үйлчилгээ
                        </Link>
                        <Link className="hover:text-foreground" href="#contact">
                            Холбоо
                        </Link>
                        <Link className="hover:text-foreground" href="/privacy">
                            Нууцлал
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

const Copyright = async () => {
    await connection()

    return (
        <div className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Бүх эрх хуулиар хамгаалагдсан.
        </div>
    )
}
