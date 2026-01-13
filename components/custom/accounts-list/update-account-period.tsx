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
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Account, AccountBalance, accountPeriodBalanceItemSchema } from "@/types/account";
import { Customer } from "@/types/customer";
import { Loader2, Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { clientFetcher } from "@/lib/fetcher/clientFetcher";
import { updateAccountPeriodBalanceItems } from "@/lib/actions/account-period-balance";
import { toast } from "sonner";

const updateAccountPeriodSchema = z.object({
    items: z.array(accountPeriodBalanceItemSchema).min(1, "Хамгийн багадаа 1 мөр оруулна уу"),
});

type UpdateAccountPeriodFormValues = z.infer<typeof updateAccountPeriodSchema>;

interface UpdateAccountPeriodProps {
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    accounts: Account[];
    customers: Customer[];
    selectedCustomer?: Customer;
    selectedBalance?: AccountBalance;
}

export default function UpdateAccountPeriod({
    open,
    onClose,
    onSuccess,
    accounts,
    customers,
    selectedCustomer,
    selectedBalance,
}: UpdateAccountPeriodProps) {

    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const form = useForm<UpdateAccountPeriodFormValues>({
        resolver: zodResolver(updateAccountPeriodSchema),
        defaultValues: {
            items: [
                {
                    AccountOid: "",
                    ActiveAmount: null,
                    PassiveAmount: null,
                    BusinessCustomerOid: undefined,
                }
            ],
        },
    });

    const {
        control,
        handleSubmit,
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

    const fetchAccountsData = useCallback(async () => {
        if (selectedBalance?.Oid) {
            setLoading(true);
            try {
                const res = await clientFetcher.get<any[]>(`/internal/v1/account-period-balance-item?accountPeriodBalanceOid=${selectedBalance?.Oid}`);
                if (res.isOk) {
                    reset({
                        items: res.data
                    })
                }
            } catch (e: any) {
                toast.error(e.message || 'Алдаа гарлаа');
            } finally {
                setLoading(false);
            }
        }
    }, [selectedBalance])

    useEffect(() => {
        fetchAccountsData();
    }, [fetchAccountsData])

    // Calculate totals
    const totalActive = items.reduce((sum, item) => sum + (Number(item.ActiveAmount) || 0), 0);
    const totalPassive = items.reduce((sum, item) => sum + (Number(item.PassiveAmount) || 0), 0);

    const handleClose = () => {
        reset();
        setLoading(false);
        onClose();
    };

    const handleFormSubmit = async (data: UpdateAccountPeriodFormValues) => {
        setIsSubmitting(true);

        if (!selectedBalance?.Oid) {
            return;
        }

        try {
            const result = await updateAccountPeriodBalanceItems({
                AccountPeriodBalanceOid: selectedBalance.Oid,
                items: data.items
            });

            if (result.success) {
                toast.success(result.message || "Амжилттай хадгалагдлаа");
                onSuccess?.();
                handleClose();
            } else {
                toast.error(result.error || 'Алдаа гарлаа');
            }
        } catch (err: any) {
            toast.error(err.message || 'Алдаа гарлаа');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!open) {
        return null;
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="min-w-5xl max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>Энхний үлдэгдлийн мэдээлэл засах</DialogTitle>
                </DialogHeader>

                <div className="border rounded-md">
                    <div className="grid grid-cols-4 gap-4 p-4">
                        <div>
                            <p>Регсистрийн дугаар</p>
                            <p className="text-muted-foreground">{selectedCustomer?.CustomerID}</p>
                        </div>
                        <div>
                            <p>Нэр</p>
                            <p className="text-muted-foreground">{selectedCustomer?.CustomerName}</p>
                        </div>
                        <div>
                            <p>Он</p>
                            <p className="text-muted-foreground">{selectedBalance?.YearType}</p>
                        </div>
                    </div>
                </div>

                <Form {...form}>
                    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">

                        <div>
                            <div className="w-full flex justify-end pb-4">
                                <Button
                                    type="button"
                                    size="sm"
                                    disabled={loading}
                                    onClick={() =>
                                        append({
                                            AccountOid: "",
                                            ActiveAmount: null,
                                            PassiveAmount: null,
                                            BusinessCustomerOid: "",
                                        })
                                    }
                                    className="bg-green-500 hover:bg-green-600"
                                >
                                    <Plus className="h-4 w-4 mr-1" />
                                    Шинэ мөр нэмэх
                                </Button>
                            </div>

                            {/* Table */}
                            <div className="max-w-full border max-h-[500px] overflow-y-auto">
                                <table className="w-full">
                                    <thead className="bg-muted border-b border-border sticky top-0 z-10">
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
                                        {
                                            loading ? <tr className="w-full">
                                                <td colSpan={6} className="px-2 py-2">
                                                    <div className="flex items-center justify-center">
                                                        <Loader2 className="animate-spin" />
                                                    </div>
                                                </td>
                                            </tr> : fields.map((field, index) => (
                                                <tr key={field.id} className="border-b border-border">
                                                    <td className="px-2 py-2">{index + 1}</td>
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
                                    {
                                        !loading && <tfoot className="bg-muted border-t border-border font-bold sticky bottom-0">
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
                                    }

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
                                Хадгалах
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
