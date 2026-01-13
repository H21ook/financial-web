"use client";
import { useAuth } from '@/components/auth-provider';
import { clientFetcher } from '@/lib/fetcher/clientFetcher';
import { Account, AccountBalance } from '@/types/account';
import React from 'react';
import AccountsList from '@/components/custom/accounts-list';
import { Customer } from '@/types/customer';
import { generateQueryString } from '@/lib/utils';
import UpdateAccountPeriod from '@/components/custom/accounts-list/update-account-period';
import CreateAccountPeriod from '@/components/custom/accounts-list/create-account-period';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

const FinanceAndReportPage = () => {
    const { user } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [accounts, setAccounts] = React.useState<Account[]>([]);
    const [customers, setCustomers] = React.useState<Customer[]>([]);
    const [accountPeriodBalance, setAccountPeriodBalance] = React.useState<AccountBalance[]>([]);
    const [selectedBalance, setSelectedBalance] = React.useState<AccountBalance | null>(null);
    const [showUpdateModal, setShowUpdateModal] = React.useState(false);
    const [showCreateModal, setShowCreateModal] = React.useState(false);

    const yearType = searchParams.get('year') ? Number(searchParams.get('year')) : new Date().getFullYear();
    const customerId = searchParams.get('customerId') || undefined;


    const fetchCustomers = React.useCallback(async () => {
        if (!user?.AccountantOid) {
            return;
        }
        const res = await clientFetcher.get<Customer[]>("/internal/v1/customers-list?accountantOid=" + user.AccountantOid);
        if (res.isOk) {
            setCustomers(res.data);
        }
    }, [user]);

    const fetchAccounts = React.useCallback(async () => {
        const res = await clientFetcher.get<Account[]>("/internal/v1/account");
        if (res.isOk) {
            setAccounts(res.data);
        }
    }, []);

    const fetchAccountPeriodBalance = React.useCallback(async (selectedYearType?: number, customerId?: string) => {
        const queryString = generateQueryString({ year: selectedYearType, customerId })
        const res = await clientFetcher.get<AccountBalance[]>(`/internal/v1/account-period-balance${queryString ? `?${queryString}` : ""}`);
        if (res.isOk) {
            setAccountPeriodBalance(res.data);
        }
    }, []);

    React.useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    React.useEffect(() => {
        fetchAccounts();
    }, [fetchAccounts]);

    React.useEffect(() => {
        fetchAccountPeriodBalance(yearType, customerId);
    }, [yearType, customerId, fetchAccountPeriodBalance]);

    const handleFilterChange = (filterData: { yearType?: number, customerId?: string }) => {
        const params = new URLSearchParams(searchParams.toString());
        if (filterData.yearType) {
            params.set('year', filterData.yearType.toString());
        } else {
            params.delete('year');
        }

        if (filterData.customerId) {
            params.set('customerId', filterData.customerId);
        } else {
            params.delete('customerId');
        }

        router.push(`${pathname}?${params.toString()}`);
    };

    const handleEdit = (balance: AccountBalance) => {
        setSelectedBalance(balance);
        setShowUpdateModal(true);
    };

    return (
        <div>
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h1 className="text-2xl font-bold mb-1">Эхний үлдэгдэл</h1>
                        <p className="text-sm text-gray-500 font-medium">
                            Харилцагчдын эхний үлдэгдлийн жагсаалт
                        </p>
                    </div>
                    <div>
                        <Button
                            onClick={() => setShowCreateModal(true)}
                            className="bg-primary text-primary-foreground"
                        >
                            Шинэ үлдэгдэл үүсгэх
                        </Button>
                    </div>
                </div>
                <React.Suspense fallback={<div>Уншиж байна...</div>}>
                    <AccountsList
                        customers={customers}
                        accountsBalanceData={accountPeriodBalance}
                        filter={{
                            yearType: yearType,
                            customerId: customerId
                        }}
                        onFilterChange={handleFilterChange}
                        onEdit={handleEdit}
                    />

                    {/* Update Modal */}
                    <UpdateAccountPeriod
                        open={showUpdateModal}
                        onClose={() => setShowUpdateModal(false)}
                        onSuccess={() => {
                            fetchAccountPeriodBalance(yearType, customerId);
                            setShowUpdateModal(false);
                        }}
                        accounts={accounts}
                        customers={customers}
                        selectedCustomer={customers.find(c => c.Oid === selectedBalance?.CustomerOid)}
                        selectedBalance={selectedBalance || undefined}
                    />

                    {/* Create Modal */}
                    <CreateAccountPeriod
                        open={showCreateModal}
                        onClose={() => setShowCreateModal(false)}
                        onSuccess={() => {
                            fetchAccountPeriodBalance(yearType, customerId);
                            setShowCreateModal(false);
                        }}
                        accounts={accounts}
                        customers={customers}
                    />
                </React.Suspense>
            </div>
        </div>
    );
};

export default FinanceAndReportPage;