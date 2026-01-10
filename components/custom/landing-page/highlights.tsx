"use client";

import { BarChart3, ShieldCheck, Zap } from "lucide-react"
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Section from "./section";

export default function Highlights() {
    return (
        <Section id="why" variant="soft">
            <div className="grid gap-10 md:grid-cols-2 md:items-start">
                <div>
                    <h2 className="text-balance text-2xl font-semibold tracking-tight md:text-3xl">
                        Яагаад NovaQ гэж?
                    </h2>
                    <p className="mt-3 text-pretty text-muted-foreground">
                        Үндсэн зорилго: өдөр тутмын ажлыг автоматжуулж, удирдлагын шийдвэр
                        гаргалтыг хурдлуулах.
                    </p>

                    <div className="mt-6 space-y-3">
                        <Bullet
                            icon={<Zap className="size-5" />}
                            title="Хурдан нэвтрүүлэлт"
                            desc="Богино хугацаанд тохируулга хийж, багтаа ажиллуулах боломж."
                        />
                        <Bullet
                            icon={<ShieldCheck className="size-5" />}
                            title="Найдвартай эрхийн удирдлага"
                            desc="Албан тушаал, баг, байгууллагаар нарийн хяналт."
                        />
                        <Bullet
                            icon={<BarChart3 className="size-5" />}
                            title="Тайлан ба шинжилгээ"
                            desc="Орлого-зардлын зураглал, гүйцэтгэл, санхүүгийн үзүүлэлтүүд."
                        />
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <FeatureCard title="Автоматжуулалт" desc="Давтагддаг ажлыг систем өөрөө хийдэг." />
                    <FeatureCard title="Нэгтгэсэн удирдлага" desc="Олон байгууллага, олон эрхийг нэг дор." />
                    <FeatureCard title="Өсөлтөд бэлэн" desc="Шатлал нэмэгдэхэд архитектур даахуйц." />
                    <FeatureCard title="Орчин үеийн UX" desc="Цэвэр, ойлгомжтой интерфэйс – хурдан ажиллана." />
                </div>
            </div>
        </Section>
    )
}

function Bullet(props: {
    icon: React.ReactNode
    title: string
    desc: string
}) {
    return (
        <div className="flex gap-3 rounded-2xl border p-4">
            <div className="mt-0.5 inline-flex size-9 items-center justify-center rounded-xl bg-muted">
                {props.icon}
            </div>
            <div>
                <div className="font-medium">{props.title}</div>
                <div className="text-sm text-muted-foreground">{props.desc}</div>
            </div>
        </div>
    )
}

function FeatureCard(props: { title: string; desc: string }) {
  return (
    <Card className="rounded-3xl border border-border/60 bg-card/30 backdrop-blur-xl shadow-md shadow-black/5 dark:shadow-black/20">
      <CardHeader>
        <CardTitle className="text-base">{props.title}</CardTitle>
        <CardDescription>{props.desc}</CardDescription>
      </CardHeader>
    </Card>
  )
}
