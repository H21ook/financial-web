"use client"

import type { ColDef, ICellRendererParams } from "ag-grid-community"
import DataTable from "@/components/custom/shared/data-table"
import type { Employee } from "@/types/customer"
import { Button } from "@/components/ui/button"
import { Lock } from "lucide-react"

const EmployeeTable = ({
    data,
    isConnectedInsurance,
}: {
    data: Employee[]
    isConnectedInsurance: boolean
}) => {
    const columnDefs: ColDef[] = [
        {
            field: "id",
            headerName: "№",
            headerClass: "ag-center-header",
            cellClass: "ag-center-cell",
            pinned: "left",
            cellRenderer: (p: ICellRendererParams) => {
                const index = (p.node?.rowIndex || 0) + 1
                return index
            },
            suppressMovable: true,
            sortable: false,
            resizable: false,
            maxWidth: 50,
        },
        {
            field: "Code",
            headerName: "Код",
            pinned: "left",
            resizable: false,
            suppressMovable: true,
            maxWidth: 100,
        },
        {
            field: "LastName",
            headerName: "Овог",
            flex: 1,
            suppressMovable: true,
            minWidth: 140,
        },
        {
            field: "Name",
            headerName: "Нэр",
            flex: 1,
            suppressMovable: true,
            minWidth: 140,
        },
        {
            field: "TIN",
            headerName: "ТИН",
            suppressMovable: true,
            minWidth: 140,
        },
        {
            field: "InsureTypeCode",
            headerName: "Даатгуулагчийн төрөл",
            suppressMovable: true,
            minWidth: 160,
        },
        {
            field: "OccupationCode",
            headerName: "Ажил мэргэжлийн код",
            suppressMovable: true,
            resizable: false,
            minWidth: 160,
        },
    ]

    return (
        <div className="bg-transparent h-125">
            {data.length === 0 ? (
                <div className="h-full flex items-center justify-center rounded-lg border border-dashed border-border bg-muted/30">
                    <div className="text-center max-w-md px-6">

                        {isConnectedInsurance ? (
                            <>
                                <p className="text-base font-semibold mb-2">
                                    Одоогоор ажилчдын мэдээлэл алга
                                </p>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Харилцагчийн ажилчдын жагсаалтыг татаж авч хүснэгтэд харуулна.
                                </p>
                                <Button>Ажилчдын мэдээлэл татах</Button>
                            </>
                        ) : (
                            <div className="text-muted-foreground">
                                <div className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
                                    <span className="inline-flex size-8 items-center justify-center rounded-full border border-border bg-background">
                                        <Lock className="h-4 w-4" />
                                    </span>
                                    Нийгмийн даатгалын эрх холбоогүй
                                </div>
                                <p className="text-sm mt-2">
                                    Тохиргоо хэсгээс нийгмийн даатгалын эрхээ холбосны дараа ажилчдын мэдээлэл татах боломжтой.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <DataTable
                    rowData={data}
                    columnDefs={columnDefs}
                    pagination={false}
                />
            )}
        </div>
    )
}

export default EmployeeTable
