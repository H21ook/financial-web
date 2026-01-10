"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { ArrowRight, Wallet, BarChart3, Handshake, Globe, MonitorSmartphone } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Section from "./section"
import { cn } from "@/lib/utils"

export default function ServicesSection() {
    const items: {
        icon: ReactNode
        title: string
        desc: string
        cta: { label: string; href: string }
        featured?: boolean
        secondary?: boolean
    }[] = [
        {
            icon: <Wallet className="size-5" />,
            title: "Автомат санхүү систем",
            desc:
                "Санхүүгийн ажлыг автоматжуулж, хяналтыг хялбар болгоно.",
            cta: { label: "Дэлгэрэнгүй", href: "/services/finance" },
        },
        {
            icon: <BarChart3 className="size-5" />,
            title: "Санхүү, татварын зөвлөх үйлчилгээ",
            desc:
                "Шинэ үеийн нягтлан бодох ба эрсдэлээс урьдчилан сэргийлэх зөвлөгөө.",
            cta: { label: "Холбогдох", href: "/contact" },
        },
        {
            icon: <Handshake className="size-5" />,
            title: "Гэрээт нягтлан бодогч хайж байна уу?",
            desc:
                "NovaQ-тай хамтран ажилладаг нягтлан бодогчдоос зөвлөгөө авах боломжтой.",
            cta: { label: "Харах", href: "/accountants" },
            featured: true,
        },
        {
            icon: <Globe className="size-5" />,
            title: "NovaQ Web",
            desc:
                "Вэб хөтөч дээрээс шууд ашиглах боломжтой систем. Нэвтэрч ажиллана уу.",
            cta: { label: "Нэвтрэх", href: "/login" },
            // secondary: true,
        },
        {
            icon: <MonitorSmartphone className="size-5" />,
            title: "NovaQ Desktop",
            desc:
                "Компьютерт суулгаж ашиглах боломжтой Desktop програм.",
            cta: { label: "Татах", href: "/download" },
            secondary: true,
        },
    ] as const

    return (
        <Section id="services" variant="tint">
            <Reveal>
                <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
                    <div>
                        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Үйлчилгээнүүд</h2>
                        <p className="mt-2 text-muted-foreground">Таны хэрэгцээнд тохирсон багц, үйлчилгээний сонголтууд.</p>
                    </div>

                    {/* <Button
                        asChild
                        variant="outline"
                        className="rounded-2xl border-primary/30 text-primary hover:bg-primary/10"
                    >
                        <Link href="/pricing">??? / ????</Link>
                    </Button> */}
                </div>
            </Reveal>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
                {items.map((it, index) => (
                    <Reveal key={it.title} delay={120 + index * 70} className="h-full">
                        <Card
                            className={cn(
                                "h-full group relative overflow-hidden rounded-3xl border border-border/60 bg-card/35 backdrop-blur-xl shadow-md shadow-black/5 transition duration-300 hover:-translate-y-0.5 hover:border-white/15 hover:shadow-lg hover:shadow-black/10 dark:shadow-black/20 dark:hover:shadow-black/35",
                            )}
                        >
                            {it.featured && (
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.16),transparent_65%)]" />
                            )}

                            <CardHeader className="relative">
                                <div className="flex items-center gap-3">
                                    <div className="inline-flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary transition duration-300 group-hover:scale-[1.02] group-hover:rotate-1">
                                        {it.icon}
                                    </div>
                                    <div>
                                        <CardTitle className="text-base">{it.title}</CardTitle>
                                        <CardDescription className="mt-1">{it.desc}</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="relative flex items-center justify-between gap-3">
                                <div className="text-sm text-muted-foreground">
                                    {it.secondary ? "Тусгай сувгууд" : "Үндсэн үйлчилгээ"}
                                </div>

                                <Button
                                    asChild
                                    className="rounded-2xl"
                                    variant={it.secondary ? "secondary" : "default"}
                                >
                                    <Link href={it.cta.href}>
                                        {it.cta.label} <ArrowRight className="ml-2 size-4" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </Reveal>
                ))}
            </div>
        </Section>
    )
}

function Reveal({
    children,
    delay = 0,
    className = "",
}: {
    children: ReactNode
    delay?: number
    className?: string
}) {
    const { ref, isVisible } = useInView()

    return (
        <div
            ref={ref}
            className={["reveal", isVisible ? "is-visible" : "", className].join(" ")}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    )
}

function useInView() {
    const ref = useRef<HTMLDivElement | null>(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const node = ref.current
        if (!node || isVisible) {
            return
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                    observer.disconnect()
                }
            },
            { rootMargin: "0px 0px -10% 0px", threshold: 0.2 }
        )

        observer.observe(node)

        return () => observer.disconnect()
    }, [isVisible])

    return { ref, isVisible }
}
