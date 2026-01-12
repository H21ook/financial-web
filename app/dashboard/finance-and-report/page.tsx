"use client";
import { useAuth } from '@/components/auth-provider';
import { clientFetcher } from '@/lib/fetcher/clientFetcher';
import { Account, AccountBalance } from '@/types/account';
import React from 'react';
import AccountsList from '@/components/custom/accounts-list';
import { Customer } from '@/types/customer';
import { generateQueryString } from '@/lib/utils';

const FinanceAndReportPage = () => {
    const { user } = useAuth();
    const [accounts, setAccounts] = React.useState<Account[]>([]);
    const [customers, setCustomers] = React.useState<Customer[]>([]);
    const [accountPeriodBalance, setAccountPeriodBalance] = React.useState<AccountBalance[]>([]);
    const [selectedBalance, setSelectedBalance] = React.useState<AccountBalance | null>(null);
    const [showEditPopup, setShowEditPopup] = React.useState(false);

    const fetchCustomers = React.useCallback(async () => {
        const res = await clientFetcher.get<Customer[]>("/internal/v1/customers-list?accountantOid=" + user?.AccountantOid);
        if (res.isOk) {
            setCustomers(res.data);
        }
    }, []);

    const fetchAccounts = React.useCallback(async () => {
        const res = await clientFetcher.get<Account[]>("/internal/v1/account");
        if (res.isOk) {
            setAccounts(res.data);
        }
    }, []);

    const fetchAccountPeriodBalance = React.useCallback(async (selectedYearType?: string, customerId?: string) => {
        const res = await clientFetcher.get<AccountBalance[]>("/internal/v1/account-period-balance" + generateQueryString({ selectedYearType, customerId }));
        if (res.isOk) {
            setAccountPeriodBalance(res.data);
        }
    }, []);

    React.useEffect(() => {
        fetchCustomers();
        fetchAccounts();
        fetchAccountPeriodBalance();
    }, [fetchAccounts]);

    const handleEdit = (balance: AccountBalance) => {
        setSelectedBalance(balance);
        setShowEditPopup(true);
    };

    return (
        <div>
            <div className="max-w-7xl mx-auto">
                <AccountsList
                    customers={customers}
                    accountsBalanceData={accountPeriodBalance}
                    onEdit={handleEdit}
                />

                {showEditPopup && selectedBalance && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg max-w-md w-full">
                            <h2 className="text-xl font-bold mb-4">Данс засах</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Харилцагчийн регистр</label>
                                    <p className="text-gray-700">{selectedBalance.CustomerPin}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Харилцагчийн нэр</label>
                                    <p className="text-gray-700">{selectedBalance.CustomerName}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Жилийн төрөл</label>
                                    <p className="text-gray-700">{selectedBalance.YearType}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Идэвхтэй дүн</label>
                                    <p className="text-gray-700">{selectedBalance.ActiveAmount.toLocaleString('mn-MN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Хуулийн дүн</label>
                                    <p className="text-gray-700">{selectedBalance.PassiveAmount.toLocaleString('mn-MN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <button
                                    onClick={() => setShowEditPopup(false)}
                                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                                >
                                    Хаах
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FinanceAndReportPage;