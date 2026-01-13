"use client";

import { forwardRef, useState, type ForwardedRef, type RefAttributes, type ReactElement, useDeferredValue } from 'react';
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
    QuickFilterModule,
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
    ColumnApiModule,
    QuickFilterModule
]);

interface Props<TData extends Record<string, unknown>> {
    rowData: TData[];
    columnDefs: ColDef<TData>[];
    pinnedBottomRowData?: TData[];
    loading?: boolean;
    pagination?: boolean;
    onFilteredDataChange?: (data: TData[]) => void;
    toolbar?: React.ReactNode;
}

const syncColumnsFromGrid = <TData extends Record<string, unknown>>(
    columnDefs: ColDef<TData>[],
    columnState: ColumnState[]
): ColDef<TData>[] => {
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

const DataTableInner = <TData extends Record<string, unknown>>(
    { rowData, columnDefs, pinnedBottomRowData, toolbar, pagination }: Props<TData>,
    ref: ForwardedRef<AgGridReact<TData>>
) => {
    const [columns, setColumns] = useState(columnDefs);
    const [searchText, setSearchText] = useState('');
    const deferredSearchText = useDeferredValue(searchText);

    const onColumnChanged = (params: ColumnMovedEvent | ColumnVisibleEvent | ColumnPinnedEvent) => {
        const gridState = params.api.getColumnState();
        setColumns((prev) => syncColumnsFromGrid(prev, gridState));
    };



    return (
        <div className="h-full flex flex-col gap-4">
            <TableToolbar
                toolbar={toolbar}
                columns={columns}
                searchValue={searchText}
                onSearch={(value) => {
                    setSearchText(value)
                }}
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
                                D?¥ØDøDøD¯D1 DñDøD1D«Dø...
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
                    quickFilterText={deferredSearchText}
                    enableCellTextSelection={true}
                    ensureDomOrder={true}
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
};
const DataTable = forwardRef(DataTableInner) as <TData extends Record<string, unknown>>(
    props: Props<TData> & RefAttributes<AgGridReact<TData>>
) => ReactElement;

(DataTable as { displayName?: string }).displayName = 'DataTable';

export default DataTable;

interface TableToolbarProps<TData extends Record<string, unknown>> {
    columns: ColDef<TData>[];
    onToggleColumn: (field: string) => void;
    toolbar?: React.ReactNode;
    onSearch?: (value: string) => void;
    searchValue?: string;
}

export const TableToolbar = <TData extends Record<string, unknown>>({
    toolbar,
    columns,
    onToggleColumn,
    searchValue,
    onSearch
}: TableToolbarProps<TData>) => {

    return (
        <div className="flex justify-between items-center gap-6 pt-2">
            <InputGroup className='h-8 max-w-xs'>
                <InputGroupInput placeholder="Хайх..." value={searchValue} onChange={(e) => {
                    const value = e.target.value;
                    onSearch?.(value)
                }} />
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
                            .map((col, index) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={`${index}-${col?.field}`}
                                        className="capitalize"

                                        checked={!col.hide}
                                        onCheckedChange={() =>
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


