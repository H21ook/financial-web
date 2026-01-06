import { forwardRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
    ModuleRegistry,
    ClientSideRowModelModule,
    CsvExportModule,
    CellStyleModule,
    PaginationModule,
    TextFilterModule,
    NumberFilterModule,
    ValidationModule,
    PinnedRowModule,
    RowStyleModule,
    ColumnApiModule,
    themeQuartz,
} from 'ag-grid-community';
import type {
    ColDef,
    ColumnState,
    ColumnMovedEvent,
    ColumnVisibleEvent,
    ColumnPinnedEvent,
} from 'ag-grid-community';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button';
import { ChevronDown, Columns2, Search } from 'lucide-react';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';

export const agGridTheme = themeQuartz.withParams({
    browserColorScheme: "light",

    /* Base */
    backgroundColor: "var(--background)",
    foregroundColor: "var(--foreground)",
    borderColor: "var(--border)",

    /* Header */
    headerBackgroundColor: "var(--card)",
    headerTextColor: "var(--muted-foreground)",
    headerFontWeight: 600,
    headerFontSize: 12,

    /* Rows */
    oddRowBackgroundColor: "color-mix(in oklch, var(--background) 96%, black)",
    rowHoverColor: "color-mix(in oklch, var(--primary) 8%, transparent)",

    /* Accent / focus */
    accentColor: "var(--primary)",

    /* Typography */
    fontSize: 14,

    /* Layout */
    cellHorizontalPadding: 8,
});

ModuleRegistry.registerModules([
    ClientSideRowModelModule,
    CsvExportModule,
    CellStyleModule,
    PaginationModule,
    PinnedRowModule,
    TextFilterModule,
    NumberFilterModule,
    ValidationModule,
    RowStyleModule,
    ColumnApiModule
]);

interface Props {
    rowData: any[];
    columnDefs: ColDef[];
    pinnedBottomRowData?: any[];
    loading?: boolean;
    pagination?: boolean;
    onFilteredDataChange?: (data: any[]) => void;
    toolbar?: React.ReactNode;
}

const syncColumnsFromGrid = (
    columnDefs: ColDef[],
    columnState: ColumnState[]
): ColDef[] => {
    return columnDefs.map((col) => {
        const state = columnState.find(
            (s) => s.colId === col.field
        );

        return {
            ...col,
            hide: state ? state.hide : col.hide,
        };
    });
};

const DataTable = forwardRef<AgGridReact, Props>(
    ({ rowData, columnDefs, pinnedBottomRowData, toolbar, pagination }, ref) => {
        const [columns, setColumns] = useState(columnDefs);

        const onColumnChanged = (params: ColumnMovedEvent | ColumnVisibleEvent | ColumnPinnedEvent) => {
            const gridState = params.api.getColumnState();
            setColumns((prev) => syncColumnsFromGrid(prev, gridState));
        };

        return (
            <div className="h-full flex flex-col gap-4">
                <TableToolbar
                    toolbar={toolbar}
                    columns={columns}
                    onToggleColumn={(field) => {
                        setColumns((prev) =>
                            prev.map((c) =>
                                c.field === field ? { ...c, hide: !c.hide } : c
                            )
                        );
                    }}
                />
                <div className="flex-1 ag-theme-quartz w-full h-full relative">
                    {/* {loading && (
                        <div className="absolute inset-0 bg-white/50 z-20 flex items-center justify-center">
                            <div className="flex flex-col items-center gap-2">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                                <span className="text-sm font-medium text-gray-600">
                                    Ачаалж байна...
                                </span>
                            </div>
                        </div>
                    )} */}
                    <AgGridReact
                        ref={ref}
                        theme={agGridTheme}
                        rowData={rowData}
                        columnDefs={columns}
                        defaultColDef={{
                            sortable: true,
                            filter: false,
                            resizable: true,
                            flex: 1,
                        }}
                        pinnedBottomRowData={pinnedBottomRowData}
                        // getRowStyle={(params) => {
                        //   if (params.node.rowPinned === 'bottom') {
                        //     return {
                        //       backgroundColor: '#3b82f680',
                        //     };
                        //   }
                        // }}
                        pagination={pagination}
                        paginationPageSize={20}
                        paginationPageSizeSelector={[10, 20, 50, 100]}
                        suppressCellFocus={true}
                        animateRows={true}
                        onColumnVisible={onColumnChanged}
                    />
                </div>
            </div>
        );
    }
);

DataTable.displayName = 'DataTable';

export default DataTable;

interface TableToolbarProps {
    columns: ColDef[];
    onToggleColumn: (field: string) => void;
    toolbar?: React.ReactNode;
}

export const TableToolbar = ({
    toolbar,
    columns,
    onToggleColumn,
}: TableToolbarProps) => {
    return (
        <div className="flex justify-between items-center gap-6 pt-2">
            <InputGroup className='h-8 max-w-xs'>
                <InputGroupInput placeholder="Хайх..." />
                <InputGroupAddon>
                    <Search />
                </InputGroupAddon>
            </InputGroup>

            <div className="flex items-center gap-2">
                {toolbar}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                            <Columns2 />
                            <span className="hidden lg:inline">Багана</span>
                            <span className="lg:hidden">Багана</span>
                            <ChevronDown />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        {columns
                            .map((col) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={col.field}
                                        className="capitalize"

                                        checked={!col.hide}
                                        onCheckedChange={(value) =>
                                            onToggleColumn(col.field!)
                                        }
                                    >
                                        {col.headerName}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>

            </div>
        </div>
    );
};
