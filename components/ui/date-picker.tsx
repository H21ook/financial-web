"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { format as dateFormat } from "date-fns"
import { cn } from "@/lib/utils"

const DatePicker = ({
    value,
    onChange,
    format = "yyyy-MM-dd",
    className,
    placeholder,
    ariaInvalid
}: {
    value: string | undefined
    onChange: (value: string) => void
    format?: string,
    className?: string,
    placeholder?: string
    ariaInvalid?: boolean
}) => {
    const [open, setOpen] = React.useState(false)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    id="date"
                    aria-invalid={ariaInvalid}
                    className={cn("w-48 justify-between font-normal aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50", value ? "" : "text-muted-foreground", className)}
                >
                    {value ? dateFormat(new Date(value), format) : (placeholder || format)}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                <Calendar
                    mode="single"
                    selected={value ? new Date(value) : undefined}
                    captionLayout="dropdown"
                    onSelect={(date) => {
                        if (date) {
                            onChange(date.toISOString())
                        }
                        setOpen(false)
                    }}
                />
            </PopoverContent>
        </Popover>
    )
}

export default DatePicker