import * as z from "zod";

export interface Account {
    Oid: string;
    Code: string;
    Name: string;
}

export interface AccountBalance {
    Oid: string;
    CustomerOid: string;
    YearType: number;
    ActiveAmount: number;
    PassiveAmount: number;
    CustomerName: string;
    CustomerPin: string;
}

export const accountPeriodBalanceItemSchema = z.object({
    AccountOid: z.string().min(1, "Данс сонгоно уу"),
    ActiveAmount: z.number().nullable(),
    PassiveAmount: z.number().nullable(),
    BusinessCustomerOid: z.string().optional().nullable(),
    AccountPeriodBalanceOid: z.string().optional(),
    Oid: z.string().optional(),
});

export type AccountPeriodBalanceItem = z.infer<typeof accountPeriodBalanceItemSchema>;