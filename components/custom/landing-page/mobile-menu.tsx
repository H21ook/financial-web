"use client"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import Link from "next/link"
import Logo from "../logo"

export default function MobileMenu() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-xl">
                    <Menu className="size-5" />
                    <span className="sr-only">Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent className="w-[320px] gap-0 border-border/60 bg-background/95">
                <SheetHeader>
                    <Logo />
                </SheetHeader>

                <div className="grid gap-2 px-4 mb-2">
                    <Button asChild variant="ghost" className="justify-start rounded-xl">
                        <Link href="#services">Үйлчилгээ</Link>
                    </Button>
                    <Button asChild variant="ghost" className="justify-start rounded-xl">
                        <Link href="#contact">Холбоо</Link>
                    </Button>
                </div>
                <Separator className="my-2" />

                <div className="grid gap-2 px-4 mt-2">
                    <Button asChild variant="outline" className="rounded-xl border-border/60">
                        <Link href="/login">Нэвтрэх</Link>
                    </Button>
                    <Button
                        asChild
                        className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                        <Link href="/demo">Демо авах</Link>
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    )
}
