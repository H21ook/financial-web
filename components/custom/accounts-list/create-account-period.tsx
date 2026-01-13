"use client";

import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Account, accountPeriodBalanceItemSchema } from "@/types/account";
import { Customer } from "@/types/customer";
import { Loader2, Plus } from "lucide-react";
import { createAccountPeriodBalanceWithItems } from "@/lib/actions/account-period-balance";
import { useState, useSyncExternalStore } from "react";
import { toast } from "sonner";

// Schema for the entire form
const createAccountPeriodSchema = z.object({
    YearType: z.number().min(2000, "Жил сонгоно уу"),
    CustomerOid: z.string().min(1, "Харилцагч сонгоно уу"),
    items: z.array(accountPeriodBalanceItemSchema).min(1, "Хамгийн багадаа 1 мөр оруулна уу"),
});

type CreateAccountPeriodFormValues = z.infer<typeof createAccountPeriodSchema>;

interface CreateAccountPeriodProps {
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    accounts: Account[];
    customers: Customer[];
}

export default function CreateAccountPeriod({
    open,
    onClose,
    onSuccess,
    accounts,
    customers,
}: CreateAccountPeriodProps) {
    const currentYear = useSyncExternalStore(
        () => () => { },
        () => new Date().getFullYear(),
        () => 2026
    );
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<CreateAccountPeriodFormValues>({
        resolver: zodResolver(createAccountPeriodSchema),
        defaultValues: {
            YearType: currentYear,
            CustomerOid: "",
            items: [
                {
                    AccountOid: "",
                    ActiveAmount: null,
                    PassiveAmount: null,
                    BusinessCustomerOid: "",
                }
            ],
        },
    });

    const {
        handleSubmit,
        control,
        setValue,
        getValues,
        formState: { errors },
        reset
    } = form;

    const { fields, append, remove } = useFieldArray({
        control,
        name: "items",
    });

    const items = useWatch({
        control,
        name: "items",
    });

    const selectedCustomerOid = getValues("CustomerOid");

    // Calculate totals
    const totalActive = items.reduce((sum, item) => sum + (Number(item.ActiveAmount) || 0), 0);
    const totalPassive = items.reduce((sum, item) => sum + (Number(item.PassiveAmount) || 0), 0);

    // When customer changes, update all items
    const handleCustomerChange = (customerOid: string) => {
        setValue("CustomerOid", customerOid);
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    const handleFormSubmit = async (data: CreateAccountPeriodFormValues) => {
        setIsSubmitting(true);

        try {
            const result = await createAccountPeriodBalanceWithItems({
                YearType: data.YearType,
                CustomerOid: data.CustomerOid,
                items: data.items,
            });

            if (result.success) {
                toast.success(result.message || "Амжилттай үүсгэлээ");
                onSuccess?.();
                handleClose();
            } else {
                toast.error(result.error || 'Алдаа гарлаа');
            }
        } catch (err) {
            let errorMessage = 'Алдаа гарлаа';
            if (err instanceof Error) {
                errorMessage = err.message || 'Алдаа гарлаа';
            }
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="min-w-5xl max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>Шинэ эхний үлдэгдэл үүсгэх</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                        {/* Year and Customer Selection */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={control}
                                name="CustomerOid"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Харилцагч <span className="text-red-500">*</span></FormLabel>
                                        <Select
                                            value={field.value}
                                            onValueChange={handleCustomerChange}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Харилцагч сонгох" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {customers.map((customer) => (
                                                    <SelectItem key={customer.Oid} value={customer.Oid}>
                                                        {customer.CustomerID} - {customer.CustomerName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={control}
                                name="YearType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Жил <span className="text-red-500">*</span></FormLabel>
                                        <Select
                                            value={field.value?.toString()}
                                            onValueChange={(value) => field.onChange(parseInt(value))}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Жил сонгох" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {Array.from({ length: 20 }, (_, i) => {
                                                    const year = currentYear - i;
                                                    return (
                                                        <SelectItem key={year} value={year.toString()}>
                                                            {year}
                                                        </SelectItem>
                                                    );
                                                })}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div>
                            <div className="w-full flex justify-end pb-4">
                                <Button
                                    type="button"
                                    size="sm"
                                    onClick={() =>
                                        append({
                                            AccountOid: "",
                                            ActiveAmount: null,
                                            PassiveAmount: null,
                                            BusinessCustomerOid: "",
                                        })
                                    }
                                    className="bg-green-500 hover:bg-green-600"
                                    disabled={!selectedCustomerOid}
                                >
                                    <Plus className="h-4 w-4 mr-1" />
                                    Шинэ мөр нэмэх
                                </Button>
                            </div>

                            {/* Table */}
                            <div className="max-w-full border max-h-[500px] overflow-y-auto rounded-md">
                                <table className="w-full">
                                    <thead className="bg-muted border-b border-border sticky top-0 z-10 text-nowrap">
                                        <tr>
                                            <th className="px-2 py-2 text-left text-sm font-medium">№</th>
                                            <th className="px-2 py-2 text-left text-sm font-medium">Данс</th>
                                            <th className="px-2 py-2 text-left text-sm font-medium">Актив</th>
                                            <th className="px-2 py-2 text-left text-sm font-medium">Пассив</th>
                                            <th className="px-2 py-2 text-left text-sm font-medium">Харилцагч</th>
                                            <th className="px-2 py-2 text-center text-sm font-medium">Үйлдэл</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {fields.map((field, index) => (
                                            <tr key={field.id} className="border-b border-border">
                                                <td className="px-2 py-2 text-sm">{index + 1}</td>
                                                <td className="px-2 py-2">
                                                    <FormField
                                                        control={control}
                                                        name={`items.${index}.AccountOid`}
                                                        render={({ field: accountField }) => (
                                                            <FormItem>
                                                                <Select
                                                                    value={accountField.value}
                                                                    onValueChange={accountField.onChange}
                                                                >
                                                                    <FormControl>
                                                                        <SelectTrigger className="w-full max-w-60">
                                                                            <SelectValue placeholder="Сонгох..." />
                                                                        </SelectTrigger>
                                                                    </FormControl>
                                                                    <SelectContent>
                                                                        {accounts.map((account) => (
                                                                            <SelectItem key={account.Oid} value={account.Oid}>
                                                                                {account.Code} - {account.Name}
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            </FormItem>
                                                        )}
                                                    />
                                                </td>
                                                <td className="px-2 py-2">
                                                    <FormField
                                                        control={control}
                                                        name={`items.${index}.ActiveAmount`}
                                                        render={({ field: amountField }) => (
                                                            <FormItem>
                                                                <FormControl>
                                                                    <Input
                                                                        type="number"
                                                                        step="0.01"
                                                                        placeholder="0.00"
                                                                        className="w-40"
                                                                        value={amountField.value ?? ""}
                                                                        onChange={(event) => {
                                                                            const value = event.target.value;
                                                                            amountField.onChange(value === "" ? null : Number(value));
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                            </FormItem>
                                                        )}
                                                    />
                                                </td>
                                                <td className="px-2 py-2">
                                                    <FormField
                                                        control={control}
                                                        name={`items.${index}.PassiveAmount`}
                                                        render={({ field: amountField }) => (
                                                            <FormItem>
                                                                <FormControl>
                                                                    <Input
                                                                        type="number"
                                                                        step="0.01"
                                                                        placeholder="0.00"
                                                                        className="w-40"
                                                                        value={amountField.value ?? ""}
                                                                        onChange={(event) => {
                                                                            const value = event.target.value;
                                                                            amountField.onChange(value === "" ? null : Number(value));
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                            </FormItem>
                                                        )}
                                                    />
                                                </td>
                                                <td className="px-2 py-2">
                                                    <FormField
                                                        control={control}
                                                        name={`items.${index}.BusinessCustomerOid`}
                                                        render={({ field: customerField }) => {
                                                            return (
                                                                <FormItem>
                                                                    <Select
                                                                        value={customerField.value || ""}
                                                                        onValueChange={customerField.onChange}
                                                                    >
                                                                        <FormControl>
                                                                            <SelectTrigger className="w-60 max-w-full">
                                                                                <SelectValue placeholder="Сонгох..." />
                                                                            </SelectTrigger>
                                                                        </FormControl>
                                                                        <SelectContent>
                                                                            {
                                                                                customers.map(customer => (
                                                                                    <SelectItem key={customer.Oid} value={customer.Oid}>
                                                                                        {customer.CustomerName}
                                                                                    </SelectItem>
                                                                                ))
                                                                            }
                                                                        </SelectContent>
                                                                    </Select>
                                                                </FormItem>
                                                            )
                                                        }}
                                                    />
                                                </td>
                                                <td className="px-2 py-2 text-center">
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => remove(index)}
                                                        disabled={fields.length === 1}
                                                    >
                                                        Устгах
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="bg-muted border-t border-border font-bold sticky bottom-0">
                                        <tr>
                                            <td colSpan={2} className="px-2 py-2">Нийт:</td>
                                            <td className="px-4 py-2">
                                                {totalActive.toLocaleString('mn-MN', {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                })}
                                            </td>
                                            <td className="px-4 py-2">
                                                {totalPassive.toLocaleString('mn-MN', {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                })}
                                            </td>
                                            <td colSpan={2}></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>

                        {errors.items && (
                            <p className="text-destructive text-sm">{errors.items.message}</p>
                        )}

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
                                Цуцлах
                            </Button>
                            <Button type="submit" className="bg-blue-500 hover:bg-blue-600" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Хадгалах
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
