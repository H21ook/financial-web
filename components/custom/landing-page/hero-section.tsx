"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3, Check, Rocket, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator";
import Section from "./section";

export default function HeroSection() {
    return (
        <Section variant="glow" showOverlay>
            <div className="grid items-center gap-10 md:grid-cols-2">
                <div>
                    <Badge
                        className="rounded-full border border-primary/30 bg-primary/10 text-primary animate-fade-up"
                        style={{ animationDelay: "0.04s" }}
                    >
                        <Zap className="mr-2 size-3.5" />
                        Хурдан • Найдвартай • Автомат
                    </Badge>

                    <h1
                        className="mt-4 text-balance text-3xl font-semibold tracking-tight text-foreground/95 sm:text-4xl md:text-5xl animate-fade-up"
                        style={{ animationDelay: "0.1s" }}
                    >
                        Цаг хэмнэж,{" "}
                        <span className="bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                            санхүүгээ хянах
                        </span>{" "}
                        шинэ стандарт
                    </h1>

                    <p
                        className="mt-4 text-pretty text-base leading-7 text-muted-foreground md:text-lg animate-fade-up"
                        style={{ animationDelay: "0.16s" }}
                    >
                        NovaQ нь санхүүгийн процессыг автоматжуулж, зардлыг багасган,
                        тайлан-шинжилгээг илүү ойлгомжтой болгож өгнө.
                    </p>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row animate-fade-up" style={{ animationDelay: "0.22s" }}>
                        {/* <Button
                            asChild
                            size="lg"
                            className="relative overflow-hidden rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-primary/25 shine-hover"
                        >
                            <Link href="/demo">
                                Демо авах <ArrowRight className="ml-2 size-4" />
                            </Link>
                        </Button> */}

                        <Button
                            asChild
                            size="lg"
                            variant="outline"
                            className="rounded-2xl border-primary/30 text-primary hover:bg-primary/10"
                        >
                            <Link href="#services">Үйлчилгээг харах</Link>
                        </Button>
                    </div>

                    <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-muted-foreground animate-fade-up" style={{ animationDelay: "0.28s" }}>
                        <Pill icon={<ShieldCheck className="size-4" />}>Өгөгдөл хамгаалалт</Pill>
                        <Pill icon={<BarChart3 className="size-4" />}>Realtime тайлан</Pill>
                        <Pill icon={<Rocket className="size-4" />}>Хурдан нэвтрүүлэлт</Pill>
                    </div>
                </div>

                <DashboardPreview />
            </div>
        </Section>
    )
}

function DashboardPreview() {
    return (
        <Card
            className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/35 backdrop-blur-xl shadow-lg shadow-black/5 dark:shadow-black/25 animate-fade-up"
            style={{ animationDelay: "0.32s" }}
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,oklch(var(--primary) / 0.18),transparent_60%)]" />
            <CardHeader className="relative">
                <CardTitle className="text-base">Товч хяналтын самбар</CardTitle>
                <CardDescription>Орлого, зардал, өр төлбөр, тайлангууд нэг дор.</CardDescription>
            </CardHeader>
            <CardContent className="relative space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                    <MiniStat title="Өнөөдрийн орлого" value="₮ 8,420,000" />
                    <MiniStat title="Өнөөдрийн зардал" value="₮ 2,115,000" />
                    <MiniStat title="Нээлттэй нэхэмжлэл" value="17" />
                    <MiniStat title="Төлөх татвар" value="₮ 1,080,000" />
                </div>

                <div className="rounded-2xl border border-border/60 bg-card/30 backdrop-blur-lg p-4">
                    <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">Системийн статус</div>
                        <Badge className="rounded-full bg-primary/15 text-primary border border-primary/30">
                            Live
                        </Badge>
                    </div>

                    <Separator className="my-3" />

                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2">
                            <Check className="size-4 text-primary" />
                            Автомат бичилт идэвхтэй
                        </li>
                        <li className="flex items-center gap-2">
                            <Check className="size-4 text-primary" />
                            Тайлан үүсгэх бэлэн
                        </li>
                        <li className="flex items-center gap-2">
                            <Check className="size-4 text-primary" />
                            Эрхийн удирдлага тохиргоотой
                        </li>
                    </ul>
                </div>
            </CardContent>
        </Card>
    )
}

function Pill(props: { icon: React.ReactNode; children: React.ReactNode }) {
    return (
        <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-3 py-1 text-foreground/80">
            {props.icon}
            {props.children}
        </span>
    )
}

function MiniStat(props: { title: string; value: string }) {
    return (
        <div className="rounded-2xl border border-border/60 bg-card/30 backdrop-blur-lg p-4">
            <div className="text-xs text-muted-foreground">{props.title}</div>
            <div className="mt-1 text-lg font-semibold tracking-tight text-foreground/90">
                {props.value}
            </div>
        </div>
    )
}

