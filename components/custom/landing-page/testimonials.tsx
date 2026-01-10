import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Section from "./section"

export default function Testimonials() {
    const items = [
        {
            name: "Санхүүгийн менежер",
            quote:
                "Өдөр тутмын бичилт, тайлан гаргалт илүү эмх цэгцтэй болж, удирдлагад мэдээлэл хүргэх хурд нэмэгдсэн.",
        },
        {
            name: "Нягтлан бодогч",
            quote:
                "Олон байгууллагыг нэг дор удирдах боломжтой болсон нь хамгийн том давуу тал.",
        },
        {
            name: "Захирал",
            quote:
                "Тайланг ойлгомжтой болгож өгсөн. Шийдвэр гаргалт бодит тоон дээр суурилдаг болсон.",
        },
    ] as const

    return (
        <Section variant="soft">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                Хэрэглэгчдийн сэтгэгдэл
            </h2>
            <p className="mt-2 text-muted-foreground">
                (Энд бодит хэрэглэгчдийн ишлэл/лого оруулбал бүр хүчтэй болно.)
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
                {items.map((t, i) => (
                    <Card key={i} className="rounded-3xl border border-border/60 bg-card/30 backdrop-blur-xl shadow-md shadow-black/5 dark:shadow-black/20">
                        <CardHeader>
                            <CardTitle className="text-base">{t.name}</CardTitle>
                            <CardDescription>NovaQ хэрэглэгч</CardDescription>
                        </CardHeader>
                        <CardContent className="text-sm leading-7 text-muted-foreground">
                            “{t.quote}”
                        </CardContent>
                    </Card>
                ))}
            </div>
        </Section>
    )
}
