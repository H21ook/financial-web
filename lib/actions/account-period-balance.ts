"use server";

import { serverFetcher } from "@/lib/fetcher/serverFetcher";
import { AccountPeriodBalanceItem } from "@/types/account";
import { getAccessToken } from "../tokens";
import { revalidatePath } from "next/cache";



interface CreateAccountPeriodBalanceData {
    CustomerId: string;
    YearType: number;
    ActiveAmount: number | null;
    PassiveAmount: number | null;
}

interface UpdateAccountPeriodBalanceItemsData {
    AccountPeriodBalanceOid: string;
    items: AccountPeriodBalanceItem[];
}

interface CreateAccountPeriodBalanceItemsData {
    YearType: number;
    CustomerOid: string;
    items: Array<{
        Oid?: string;
        AccountOid: string;
        ActiveAmount: number | null;
        PassiveAmount: number | null;
        BusinessCustomerOid?: string | null | undefined;
    }>;
}

export async function createAccountPeriodBalance(data: CreateAccountPeriodBalanceData) {
    try {
        const token = await getAccessToken();
        const result = await serverFetcher.post<{
            success: boolean;
            data?: {
                Oid: string;
                CustomerOid: string;
                CustomerPin: string;
                YearType: number;
                ActiveAmount: number | null;
                PassiveAmount: number | null;
            };
            error?: string;
        }, CreateAccountPeriodBalanceData>('/api/account-period-balance', data, token, {
            baseUrl: process.env.NEXT_PUBLIC_API_URL,
        });

        if (result.isOk) {
            return result.data;
        } else {
            return {
                success: false,
                data: undefined,
                error: result.error || 'AccountPeriodBalance үүсгэхэд алдаа гарлаа'
            };
        }
    } catch (error) {
        console.error('Error creating AccountPeriodBalance:', error);
        let errorMessage = 'Алдаа гарлаа';
        if (error instanceof Error) {
            errorMessage = error.message || 'Алдаа гарлаа';
        }
        return {
            success: false,
            data: undefined,
            error: errorMessage
        };
    }
}

async function createAccountPeriodBalanceItem(data: AccountPeriodBalanceItem) {
    try {
        const token = await getAccessToken();
        const result = await serverFetcher.post('/api/account-period-balance-item', data, token, {
            baseUrl: process.env.NEXT_PUBLIC_API_URL,
        });
        return result;
    } catch (error) {
        console.error('Error creating AccountPeriodBalanceItem:', error);
        throw error;
    }
}

async function updateAccountPeriodBalanceItem(oid: string, data: AccountPeriodBalanceItem) {
    try {
        const token = await getAccessToken();
        const result = await serverFetcher.put(`/api/account-period-balance-item/${oid}`, data, token, {
            baseUrl: process.env.NEXT_PUBLIC_API_URL,
        });
        return result;
    } catch (error) {
        console.error('Error updating AccountPeriodBalanceItem:', error);
        throw error;
    }
}


export async function updateAccountPeriodBalanceItems(data: UpdateAccountPeriodBalanceItemsData) {
    try {
        const finalAccountPeriodBalanceOid = data.AccountPeriodBalanceOid;

        // Validation
        if (!finalAccountPeriodBalanceOid) {
            return {
                success: false,
                error: 'AccountPeriodBalance заавал шаардлагатай'
            };
        }

        const submitPromises = data.items.map(item => {
            const submitData: AccountPeriodBalanceItem & { AccountPeriodBalanceOid: string } = {
                AccountPeriodBalanceOid: finalAccountPeriodBalanceOid,
                AccountOid: item.AccountOid,
                ActiveAmount: item.ActiveAmount,
                PassiveAmount: item.PassiveAmount,
                BusinessCustomerOid: item.BusinessCustomerOid || null,
                Oid: item.Oid,
            };

            if (item.Oid) {
                return updateAccountPeriodBalanceItem(item.Oid, submitData);
            } else {
                return createAccountPeriodBalanceItem(submitData);
            }
        });

        const results = await Promise.all(submitPromises);
        const allResults = results.map((result, index) => {
            return {
                rowNumber: index + 1,
                isSuccess: result.isOk,
            }
        });

        const failedResults = allResults.filter(result => !result.isSuccess);

        if (failedResults.length > 0) {
            return {
                success: false,
                error: `${failedResults.map(result => result.rowNumber).join(', ')} мөр дээр алдаа гарлаа`
            };
        }

        revalidatePath("/dashboard/finance-and-report")
        return {
            success: true,
            message: 'Бүх мэдээлэл амжилттай хадгалагдлаа'
        };
    } catch (error) {
        console.error('Error updating AccountPeriodBalanceItems:', error);
        let errorMessage = 'Мэдээлэл хадгалахад алдаа гарлаа';
        if (error instanceof Error) {
            errorMessage = error.message || 'Мэдээлэл хадгалахад алдаа гарлаа';
        }
        return {
            success: false,
            error: errorMessage
        };
    }
}

export async function createAccountPeriodBalanceWithItems(data: CreateAccountPeriodBalanceItemsData) {
    try {
        const balanceData: CreateAccountPeriodBalanceData = {
            CustomerId: data.CustomerOid,
            YearType: data.YearType,
            ActiveAmount: null,
            PassiveAmount: null,
        };

        const balanceResult = await createAccountPeriodBalance(balanceData);

        if (!balanceResult.success || !balanceResult?.data) {
            return {
                success: false,
                error: balanceResult.error || 'AccountPeriodBalance үүсгэхэд алдаа гарлаа'
            };
        }

        const accountPeriodBalanceOid = balanceResult.data.Oid;

        // Then create all items
        const itemPromises = data.items.map(item => {
            const itemData: AccountPeriodBalanceItem = {
                AccountPeriodBalanceOid: accountPeriodBalanceOid,
                AccountOid: item.AccountOid,
                ActiveAmount: item.ActiveAmount,
                PassiveAmount: item.PassiveAmount,
                BusinessCustomerOid: item.BusinessCustomerOid || null,
            };

            return createAccountPeriodBalanceItem(itemData);
        });

        const results = await Promise.all(itemPromises);
        const allResults = results.map((result, index) => {
            return {
                rowNumber: index + 1,
                isSuccess: result?.isOk
            }
        });
        const failedResults = allResults.filter(result => !result?.isSuccess);

        if (failedResults.length > 0) {
            return {
                success: false,
                error: `${failedResults.map(result => result.rowNumber).join(', ')} мөр дээр алдаа гарлаа`
            };
        }

        revalidatePath("/dashboard/finance-and-report")
        return {
            success: true,
            message: 'Эхний үлдэгдэл амжилттай үүсгэлээ',
            data: {
                accountPeriodBalanceOid
            }
        };
    } catch (error) {
        let errorMessage = 'Мэдээлэл үүсгэхэд алдаа гарлаа';
        if (error instanceof Error) {
            errorMessage = error.message || 'Мэдээлэл үүсгэхэд алдаа гарлаа';
        }
        console.error('Error creating AccountPeriodBalance with items:', error);
        return {
            success: false,
            error: errorMessage
        };
    }
}
