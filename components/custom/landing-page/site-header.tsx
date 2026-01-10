"use client"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import MobileMenu from "./mobile-menu";
import Logo from "../logo";
import { useAuth } from "@/components/auth-provider";

function NavLink(props: { href: string; children: React.ReactNode }) {
    return (
        <Link
            href={props.href}
            className="text-sm text-muted-foreground/80 transition-colors hover:text-foreground"
        >
            {props.children}
        </Link>
    )
}

export default function SiteHeader() {

    const { isLogged } = useAuth()
    return (
        <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60 animate-fade-up">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
                <Link href="/" className="flex items-center gap-2">
                    <Logo />
                </Link>

                <nav className="hidden items-center gap-6 md:flex">
                    <NavLink href="#services">Үйлчилгээ</NavLink>
                    <NavLink href="#contact">Холбоо</NavLink>
                </nav>

                <div className="hidden items-center gap-2 md:flex">
                    {/* <Button asChild variant="ghost" className="rounded-xl text-muted-foreground hover:text-foreground">
                        {
                            isLogged ? <Link href="/dashboard">Хянах самбар</Link> : (<Link href="/auth/login">Нэвтрэх</Link>)
                        }
                    </Button> */}

                    <Button
                        asChild
                        className="relative overflow-hidden rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-primary/25 shine-hover"
                    >
                        {
                            isLogged ? <Link href="/dashboard">Хянах самбар</Link> : (<Link href="/auth/login">Нэвтрэх</Link>)
                        }
                    </Button>
                </div>

                <div className="md:hidden">
                    <MobileMenu />
                </div>
            </div>
        </header>
    )
}
