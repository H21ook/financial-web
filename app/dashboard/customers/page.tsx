"use client";

import { useEffect, useState, useCallback, useRef } from 'react';
import { fetchTransactions, CATEGORIES, STATUSES } from '@/lib/fakeApi';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef, ICellRendererParams } from 'ag-grid-community';
import DataTable from '@/components/custom/shared/data-table';
import { Button } from '@/components/ui/button';
import { clientFetcher } from '@/lib/fetcher/clientFetcher';
import { Customer } from '@/types/customer';
import { format } from 'date-fns';

export default function CustomersPage() {
    const gridRef = useRef<AgGridReact>(null);
    const [rowData, setRowData] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('all');
    const [stats, setStats] = useState({ total: 0, totalAmount: 0 });
    const [dateRange, setDateRange] = useState('all');
    const [status, setStatus] = useState('all');

    const loadData = useCallback(async () => {
        setLoading(true);
        const res = await clientFetcher.get<{
            data: any[]
        }>(`/internal/accountant/customers`);
        if (res.isOk) {
            setRowData(res.data?.data || []);
            console.log("res client  ", res.data?.data)
        }
        setLoading(false);
    }, [search, category, dateRange, status]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const onExportClick = () => {
        if (gridRef.current?.api) {
            gridRef.current.api.exportDataAsCsv({
                fileName: `report.csv`,
            });
        }
    };

    const columnDefs: ColDef[] = [
        {
            field: 'id',
            headerName: '№',
            headerClass: 'ag-center-header',
            cellClass: 'ag-center-cell',
            pinned: 'left',
            cellRenderer: (p: ICellRendererParams) => {
                const index = (p.node?.rowIndex || 0) + 1;

                if (p.node?.rowPinned === "bottom") {
                    return '';
                }
                return index;
            },
            resizable: false,
            maxWidth: 50,
        },
        {
            field: 'CustomerID',
            headerName: 'Код',
            resizable: false,
            pinned: 'left',
            maxWidth: 80,
        },
        {
            field: 'CustomerName',
            headerName: 'Нэр',
            flex: 1,
            pinned: 'left',
            minWidth: 120,
        },
        {
            field: 'TinCode',
            headerName: 'Тин дугаар',
            resizable: false,
            maxWidth: 100
        },
        {
            field: 'BusinessClassOid',
            headerName: 'Бизнес ангилал',
            flex: 1,
            minWidth: 100,

        },
        {
            field: 'Phone',
            headerName: 'Утас',
            resizable: false,
            maxWidth: 100,
        },
        {
            field: 'CreatedDate',
            headerName: 'Бүртгэсэн огноо',
            resizable: false,
            maxWidth: 130,
            cellRenderer: (p: ICellRendererParams) => {
                if (p.value) {
                    return format(new Date(p.value), 'yyyy-MM-dd');
                }
                return ''
            }
        },
        {
            field: 'Active',
            headerName: 'Идэвхтэй эсэх',
            headerClass: 'ag-center-header',
            cellClass: 'ag-center-cell',
            resizable: false,
            maxWidth: 120,
            cellRenderer: (p: ICellRendererParams) => {
                const colors: any = {
                    Active: 'bg-green-100 text-green-700',
                    Inactive: 'bg-gray-100 text-gray-700',
                };
                if (p.node?.rowPinned === "bottom") {
                    return ""
                }
                return (
                    <span
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold ${p.value ? colors.Active : colors.Inactive}`}
                    >
                        {p.value ? "Идэвхтэй" : "Идэвхгүй"}
                    </span>
                );
            },
        },
        // { field: 'description', headerName: 'Description', minWidth: 110 },
        // {
        //     field: 'amount',
        //     headerName: 'Amount',
        //     cellDataType: 'number',
        //     minWidth: 100,
        //     resizable: false,
        //     valueFormatter: (params) => {
        //         if (params.value === null || params.value === undefined) return '';
        //         return new Intl.NumberFormat('en-US', {
        //             minimumFractionDigits: 2,
        //             maximumFractionDigits: 2,
        //         }).format(params.value);
        //     },
        //     type: 'rightAligned',
        //     cellClassRules: {
        //         'text-green-700': (p) => p.value > 0,
        //         'text-red-700': (p) => p.value < 0,
        //     },
        // },
    ];

    return (
        <div>
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-2xl font-bold mb-1">Харилцагчдын жагсаалт</h1>
                        {/* <p className="text-sm text-gray-500 font-medium">
                            Total transactions: {stats.total}
                        </p> */}
                    </div>
                    <div className="flex gap-3">
                        <Button
                            onClick={onExportClick}
                        >
                            Excel download
                        </Button>
                    </div>
                </div>

                {/* <div className="bg-white p-2 rounded-lg shadow-xs border border-gray-200 flex items-center gap-6 mb-6">
                    <div className="flex-1 flex gap-4 p-2">
                        <div className="flex flex-col gap-1.5 flex-1">
                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">
                                Type
                            </label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full bg-transparent text-sm font-semibold focus:outline-none cursor-pointer"
                            >
                                <option value="all">All</option>
                                {CATEGORIES.map((item: string) => (
                                    <option key={item} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="w-[1px] h-10 bg-gray-200 self-center"></div>
                        <div className="flex flex-col gap-1.5 flex-1">
                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">
                                Date
                            </label>
                            <select
                                className="w-full bg-transparent text-sm font-semibold focus:outline-none cursor-pointer"
                                onChange={(e) => setDateRange(e.target.value)}
                            >
                                <option value="all">All</option>
                                <option value="lastWeek">Сүүлийн 7 хоног</option>
                                <option value="lastMonth">Сүүлийн сар</option>
                            </select>
                        </div>
                        <div className="w-[1px] h-10 bg-gray-200 self-center"></div>
                        <div className="flex flex-col gap-1.5 flex-1">
                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">
                                Status
                            </label>
                            <select
                                className="w-full bg-transparent text-sm font-semibold focus:outline-none cursor-pointer"
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="all">All</option>
                                {STATUSES.map((item: string) => (
                                    <option key={item} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div> */}

                <div className="bg-transparent overflow-hidden h-[612px]">
                    <DataTable
                        ref={gridRef}
                        rowData={rowData}
                        columnDefs={columnDefs}
                        loading={loading}
                        pagination={false}
                    />
                </div>
            </div>
        </div>
    );
}
