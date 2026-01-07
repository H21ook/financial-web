"use server";

import { serverFetcher } from "../fetcher/serverFetcher";
import { getAccessToken } from "../tokens";
import { z } from "zod";
import { v4 as uuidv4 } from 'uuid';

const customerSchema = z.object({
    CustomerID: z.string().min(7),
    CustomerName: z.string().min(1),
    ShortName: z.string().optional().or(z.literal("")),
    TinCode: z.string().min(1),
    Phone: z.string().min(1),
    Mail: z.string().optional().or(z.literal("")),
    Address: z.string().optional().or(z.literal("")),
    ContractAmount: z.coerce.number().positive().min(1),
    ContractEndDate: z.string().min(1),
    DigitalSignaturePassword: z.string().optional().or(z.literal("")),
    DigitalCertFilePath: z.string().optional().or(z.literal("")),
    EBarimtRegistered: z.string().optional().or(z.literal("")),
    TaxLoginOid: z.string().optional().or(z.literal("")),
    InsuranceLoginId: z.string().optional().or(z.literal("")),
    BusinessClassOid: z.string().min(1),
    RegionId: z.string().min(1),
    RegionSubId: z.string().optional().or(z.literal("")),
    DrFirstname: z.string().min(1),
    DrLastname: z.string().min(1),
    DirectorRegister: z.string().min(10),
    taxAccessRight: z.string().optional().or(z.literal("")),
    TaxName: z.string().optional().or(z.literal("")),
    IsVatPayer: z.coerce.boolean(),
    IsCityPayer: z.coerce.boolean(),
    Active: z.coerce.boolean(),
    UserName: z.string().min(1),
    ContractPeriodType: z.string().min(1),

    AccountantFirstname: z.string().optional().or(z.literal("")),
    AccountantLastname: z.string().optional().or(z.literal("")),
    AccountantUserName: z.string().optional().or(z.literal("")),
    AccountantEmail: z.string().optional().or(z.literal("")),
    AccountantPhone: z.string().optional().or(z.literal("")),
    IsCertified: z.coerce.boolean().optional().or(z.literal(false)),
    CertifiedFrom: z.string().optional().or(z.literal("")),
    IsAccountantActive: z.coerce.boolean().optional().or(z.literal(true)),
});

export const createCustomer = async (formData: FormData) => {
    const token = await getAccessToken()
    const raw = Object.fromEntries(formData.entries())

    const parsed = customerSchema.safeParse(raw);
    if (!parsed.success) {
        return {
            isOk: false,
            error: "Validation failed",
        };
    }

    const parsedData = parsed.data;
    const res = await serverFetcher.post(`/api/customer/save-all`, {
        ...parsedData,
        CustomerOid: uuidv4(),

        UserOid: uuidv4(),
        UserName: parsedData.UserName || parsedData.CustomerID || '',
        PasswordHash: '*)(',
        FirstName: parsedData.DrFirstname || '',
        LastName: parsedData.DrLastname || '',
        RoleOid: "BFDFD04E-DFBD-4E1A-A341-B17661347FC5",
        IsCitizen: false,
        BankAccountnum: '',

        // Role type
        RoleType: "Customer",

        AccountantFirstname: parsedData.AccountantFirstname || 'System',
        AccountantLastname: parsedData.AccountantLastname || 'Accountant',
        AccountantUserName: parsedData.AccountantUserName || 'SYS001',
        AccountantEmail: parsedData.AccountantEmail || 'system@novaq.com',
        AccountantPhone: parsedData.AccountantPhone || '99999999',
        IsCertified: parsedData.IsCertified || true,
        CertifiedFrom: parsedData.CertifiedFrom || '',
        IsAccountantActive: parsedData.IsAccountantActive !== false,
    }, token, {
        baseUrl: process.env.NEXT_PUBLIC_API_URL
    });

    return res;
}