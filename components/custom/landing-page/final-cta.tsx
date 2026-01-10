"use client";

import { useEffect, useRef, useState, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowRight, Mail, Phone } from "lucide-react"
import Section from "./section";
import { Textarea } from "@/components/ui/textarea";

export default function FinalCTA() {
    return (
        <Section id="contact" variant="deep" showOverlay>
            <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/30 backdrop-blur-xl shadow-lg shadow-black/5 dark:shadow-black/25">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,oklch(var(--primary) / 0.16),transparent_70%)]" />

                <div className="relative grid gap-8 p-6 md:grid-cols-2 md:p-10">
                    <Reveal>
                        <div>
                            <h3 className="text-balance text-2xl font-semibold tracking-tight">
                                Танд тохирсон шийдлийг хамт тодорхойлъё
                            </h3>
                            <p className="mt-2 text-muted-foreground">
                                Богино уулзалт хийж хэрэгцээг тань тодорхойлоод демо харуулна.
                            </p>

                            <div className="mt-5 flex flex-col gap-2 text-sm text-muted-foreground">
                                <span className="inline-flex items-center gap-2">
                                    <Mail className="size-4 text-primary" /> info@novaq.mn
                                </span>
                                <span className="inline-flex items-center gap-2">
                                    <Phone className="size-4 text-primary" /> +976 88034441
                                </span>
                            </div>
                        </div>
                    </Reveal>

                    <Reveal delay={120}>
                        <Card className="rounded-3xl border border-border/60 bg-card/35 backdrop-blur-xl shadow-md shadow-black/5 dark:shadow-black/20">
                            <CardHeader>
                                <CardTitle className="text-base">Холбоо барих</CardTitle>
                                <CardDescription>Имэйл болон товч мэдээлэл үлдээгээрэй – Бид эргэн холбогдох болно.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Input placeholder="И-мэйл хаяг" className="rounded-2xl border-border/60 bg-background/50 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-0" />
                                <Textarea placeholder="Зурвас" className="rounded-2xl border-border/60 bg-background/50 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-0" rows={4}/>
                                <Button className="relative overflow-hidden w-full rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-primary/25 shine-hover">
                                    Илгээх <ArrowRight className="ml-2 size-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    </Reveal>
                </div>
            </div>
        </Section>
    )
}

function Reveal({
    children,
    delay = 0,
}: {
    children: ReactNode
    delay?: number
}) {
    const { ref, isVisible } = useInView()

    return (
        <div
            ref={ref}
            className={["reveal", isVisible ? "is-visible" : ""].join(" ")}
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

