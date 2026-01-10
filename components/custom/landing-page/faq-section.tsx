"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import Section from "./section";

export default function FAQSection() {
    return (
        <Section id="faq" variant="default">
            <div className="rounded-3xl border bg-muted/20 p-6 md:p-10">
                <div className="max-w-2xl">
                    <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                        Түгээмэл асуултууд
                    </h2>
                    <p className="mt-2 text-muted-foreground">
                        Танай нөхцөлөөс шалтгаалж нарийн мэдээлэл өөр байж болно.
                    </p>
                </div>

                <Accordion type="single" collapsible className="mt-8">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Нэвтрүүлэлт хэр хугацаа шаардах вэ?</AccordionTrigger>
                        <AccordionContent>
                            Ерөнхийдөө байгууллагын хэмжээ, өгөгдлийн бэлэн байдлаас хамаараад
                            богино хугацаанд тохируулга хийж эхлүүлэх боломжтой.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>Олон байгууллага нэг дор удирдаж болох уу?</AccordionTrigger>
                        <AccordionContent>
                            Тийм. Эрхийн удирдлага, байгууллага хоорондын шилжилт, тайлангийн
                            харагдац зэргийг нэг дор шийдэх боломжтой.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>Web болон Desktop ямар ялгаатай вэ?</AccordionTrigger>
                        <AccordionContent>
                            Web нь хөтөч дээрээс, Desktop нь суулгаж ашиглах хувилбар. Танай
                            инфраструктур, ажлын урсгалаас шалтгаалан сонгоно.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </Section>
    )
}