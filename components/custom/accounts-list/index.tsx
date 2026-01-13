"use client";

import { useRef, useSyncExternalStore } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef, ICellRendererParams } from 'ag-grid-community';
import DataTable from '@/components/custom/shared/data-table';
import { Button } from '@/components/ui/button';
import { AccountBalance } from '@/types/account';
import { Customer } from '@/types/customer';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AccountsList({
    customers = [],
    accountsBalanceData = [],
    onEdit,
    filter,
    onFilterChange
}: {
    customers: Customer[];
    accountsBalanceData: AccountBalance[];
    onEdit?: (balance: AccountBalance) => void;
    filter?: {
        yearType?: number,
        customerId?: string
    };
    onFilterChange?: (filterData: {
        yearType?: number,
        customerId?: string
    }) => void
}) {
    const gridRef = useRef<AgGridReact>(null);
    const selectedYear = filter?.yearType;
    const selectedCustomer = filter?.customerId;

    const currentYear = useSyncExternalStore(
        () => () => { },
        () => new Date().getFullYear(),
        () => 2026
    );

    const columnDefs: ColDef[] = [
        {
            field: 'id',
            headerName: '№',
            headerClass: 'ag-center-header',
            cellClass: 'ag-center-cell',
            pinned: 'left',
            cellRenderer: (p: ICellRendererParams) => {
                const index = (p.node?.rowIndex || 0) + 1;
                return index;
            },
            filter: false,
            resizable: false,
            suppressMovable: true,
            editable: false,
            sortable: false,
            maxWidth: 50,
            getQuickFilterText: () => "",
        },
        {
            field: 'CustomerPin',
            headerName: 'Харилцагчийн регистр',
            pinned: 'left',
            suppressMovable: true,
            editable: false,
            resizable: false,
            minWidth: 150,
            width: 180,
            cellRenderer: (p: ICellRendererParams) => {
                return p.value || '-';
            }
        },
        {
            field: 'CustomerName',
            headerName: 'Харилцагчийн нэр',
            flex: 1,
            suppressMovable: true,
            editable: false,
            filter: false,
            minWidth: 200,
            cellRenderer: (p: ICellRendererParams) => {
                return p.value || '-';
            }
        },
        {
            field: 'YearType',
            headerName: 'Жилийн төрөл',
            filter: false,
            resizable: false,
            suppressMovable: true,
            editable: false,
            maxWidth: 120,
            cellRenderer: (p: ICellRendererParams) => {
                return p.value || '-';
            },
            getQuickFilterText: () => "",
        },
        {
            field: 'ActiveAmount',
            headerName: 'Идэвхтэй дүн',
            flex: 1,
            filter: false,
            resizable: false,
            suppressMovable: true,
            editable: false,
            minWidth: 150,
            type: 'rightAligned',
            cellRenderer: (p: ICellRendererParams) => {
                if (p.value === null || p.value === undefined) return '-';
                const numValue = typeof p.value === 'string' ? parseFloat(p.value) : p.value;
                if (isNaN(numValue)) return '-';
                return numValue.toLocaleString('mn-MN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
            },
            getQuickFilterText: () => "",
        },
        {
            field: 'PassiveAmount',
            headerName: 'Хуулийн дүн',
            flex: 1,
            filter: false,
            resizable: false,
            suppressMovable: true,
            editable: false,
            minWidth: 150,
            type: 'rightAligned',
            cellRenderer: (p: ICellRendererParams) => {
                if (p.value === null || p.value === undefined) return '-';
                const numValue = typeof p.value === 'string' ? parseFloat(p.value) : p.value;
                if (isNaN(numValue)) return '-';
                return numValue.toLocaleString('mn-MN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
            },
            getQuickFilterText: () => "",
        },
        {
            colId: "actions",
            headerName: 'Үйлдэл',
            cellRenderer: (p: ICellRendererParams) => {
                if (!p.data) return null;
                return (
                    <div
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Button
                            variant="default"
                            size="sm"
                            className='bg-green-500 hover:bg-green-600'
                            onClick={() => onEdit?.(p.data)}
                        >
                            Засах
                        </Button>
                    </div>
                );
            },
            width: 100,
            minWidth: 100,
            maxWidth: 100,
            type: 'rightAligned',
            sortable: false,
            filter: false,
            resizable: false,
            suppressMovable: true,
            editable: false,
            getQuickFilterText: () => "",
        },
    ];

    return (
        <div className="bg-transparent h-150">
            <DataTable
                ref={gridRef}
                toolbar={
                    <div className="flex justify-end items-center gap-2">
                        <Select value={selectedYear?.toString()} onValueChange={(e) => {
                            const y = parseInt(e)
                            onFilterChange?.({ yearType: y, customerId: selectedCustomer })
                        }}>
                            <SelectTrigger className='w-32'>
                                <SelectValue placeholder="Жил сонгох" />
                            </SelectTrigger>
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
                        <Select value={selectedCustomer} onValueChange={(e) => {
                            onFilterChange?.({ customerId: e, yearType: selectedYear })
                        }}>
                            <SelectTrigger>
                                <SelectValue placeholder="Харилцагч сонгох" />
                            </SelectTrigger>
                            <SelectContent>
                                {customers.map((customer, index) => (
                                    <SelectItem key={`${index}-${customer.Oid}`} value={customer.Oid}>
                                        {customer.CustomerID} - {customer.CustomerName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                }
                rowData={accountsBalanceData}
                columnDefs={columnDefs}
            />
        </div>
    );
}
