"use client";

import { useEffect, useState, useCallback, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef, ICellRendererParams } from 'ag-grid-community';
import DataTable from '@/components/custom/shared/data-table';
import { Button } from '@/components/ui/button';
import { clientFetcher } from '@/lib/fetcher/clientFetcher';
import { Customer } from '@/types/customer';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { Eye } from "lucide-react";
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { BusinessClass } from '@/types/reference';


export default function CustomersList({
    businessClasses,
}: {
    businessClasses: BusinessClass[];
}) {
    const gridRef = useRef<AgGridReact>(null);
    const [rowData, setRowData] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const loadData = useCallback(async () => {
        setLoading(true);
        const res = await clientFetcher.get<{
            data: any[]
        }>(`/internal/accountant/customers`);
        if (res.isOk) {
            setRowData(res.data?.data || []);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // const onExportClick = () => {
    //     if (gridRef.current?.api) {
    //         gridRef.current.api.exportDataAsCsv({
    //             fileName: `report.csv`,
    //         });
    //     }
    // };

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
            suppressMovable: true,
            sortable: false,
            resizable: false,
            maxWidth: 50,
        },
        {
            field: 'CustomerID',
            headerName: 'Код',
            resizable: false,
            pinned: 'left',
            suppressMovable: true,
            maxWidth: 80,
        },
        {
            field: 'CustomerName',
            headerName: 'Нэр',
            flex: 1,
            pinned: 'left',
            suppressMovable: true,
            minWidth: 120,
            width: 240
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
            cellRenderer: (p: ICellRendererParams) => {
                const bc = businessClasses?.find(item => item.Oid === p.value)
                return bc?.BusinessClassName;
            },
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
                return (<Badge variant={p.value ? 'default' : 'secondary'} className={cn(p.value ? 'bg-green-500' : "")}>{p.value ? 'Идэвхтэй' : 'Идэвхгүй'}</Badge>)
            },
        },
        {
            colId: "actions",
            cellRenderer: (p: ICellRendererParams) => {
                return (
                    <div
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            className='mt-1'
                            onClick={() => router.push(`/dashboard/customers/detail/${p.data?.Oid}`)}>
                            <Eye className="h-4 w-4" />
                        </Button>
                    </div>
                );
            },
            width: 60,
            minWidth: 60,
            maxWidth: 60,
            type: 'rightAligned',
            sortable: false,
            filter: false,
            resizable: false,
            suppressMovable: true,
            editable: false,
        },
    ];

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h1 className="text-2xl font-bold mb-1">Харилцагчдын жагсаалт</h1>
                    <p className="text-sm text-gray-500 font-medium">
                        Таны харилцагчдын жагсаалт
                    </p>
                </div>
                <div className="flex gap-3 items-center">
                    {/* <Button
                            onClick={onExportClick}
                        >
                            Excel download
                        </Button> */}
                    <Button
                        onClick={() => router.push("/dashboard/customers/new")}
                    >
                        Харилцагч нэмэх
                    </Button>
                </div>
            </div>


            <div className="bg-transparent h-[612px]">
                <DataTable
                    ref={gridRef}
                    rowData={rowData}
                    // toolbar={<div>
                    //     <Button
                    //         onClick={() => router.push("/dashboard/customers/new")}
                    //     >
                    //         Нэмэх
                    //     </Button>
                    // </div>}
                    columnDefs={columnDefs}
                    loading={loading}
                    pagination={false}
                />
            </div>
        </>
    );
}
