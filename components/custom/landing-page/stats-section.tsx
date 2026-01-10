import Section from "./section"

export default function StatsSection() {
    const stats = [
        { k: "⏱️", title: "Цаг хэмнэлт", value: "30–60%" },
        { k: "📉", title: "Алдаа бууралт", value: "Илүү тогтвортой" },
        { k: "📊", title: "Хяналт/Тайлан", value: "Нэг цонхноос" },
        { k: "🔐", title: "Эрхийн хяналт", value: "Дүрэмтэй" },
    ] as const

    return (
        <Section variant="muted">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                {stats.map((s) => (
                    <div
                        key={s.title}
                        className="rounded-3xl border bg-background/75 p-5"
                    >
                        <div className="text-sm text-muted-foreground">
                            {s.k} {s.title}
                        </div>
                        <div className="mt-2 text-2xl font-semibold tracking-tight text-primary">
                            {s.value}
                        </div>
                    </div>
                ))}
            </div>
        </Section>
    )
}