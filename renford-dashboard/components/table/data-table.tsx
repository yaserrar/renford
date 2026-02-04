"use client";

import GlobalFilterInput from "@/components/table/global-filter-input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  Loader2,
  SlidersHorizontal,
  UserSearch,
  X,
} from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SelectionBar } from "@/components/table/selection-bar";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  classNames?: { tableCell?: string; table?: string };
  title?: string;
  description?: string;
  exportFileName?: string;
  selected?: string[];
  onClearSelection?: () => void;
  isLoading?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  classNames,
  title,
  description,
  exportFileName = "export",
  selected = [],
  onClearSelection = () => {},
  isLoading = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    table.setPageIndex(0);
  }, [globalFilter]);

  const table = useReactTable({
    data,
    columns,
    autoResetAll: false,
    autoResetPageIndex: false,
    state: {
      columnFilters,
      globalFilter,
      sorting,
      columnVisibility,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
  });

  const exportToExcel = () => {
    const exportData = table.getFilteredRowModel().rows.map((row) => {
      const rowData: Record<string, unknown> = {};
      row.getVisibleCells().forEach((cell) => {
        const columnId = cell.column.id;
        const value = cell.getValue();
        rowData[columnId] = value;
      });
      return rowData;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const dataBlob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(dataBlob, `${exportFileName}.xlsx`);
  };

  const pageCount = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (pageCount <= 5) {
      for (let i = 0; i < pageCount; i++) pages.push(i);
    } else {
      if (currentPage <= 2) {
        pages.push(0, 1, 2, 3, "...", pageCount - 1);
      } else if (currentPage >= pageCount - 3) {
        pages.push(
          0,
          "...",
          pageCount - 4,
          pageCount - 3,
          pageCount - 2,
          pageCount - 1,
        );
      } else {
        pages.push(
          0,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          pageCount - 1,
        );
      }
    }
    return pages;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      {/* {(title || description) && (
        <div
          className={cn(
            "flex flex-col md:flex-row justify-between mb-12",
            isRTL && "text-right flex-col md:flex-row-reverse"
          )}
        >
          {title && (
            <h1 className="text-2xl font-bold text-primary">{title}</h1>
          )}
          {description && <p className="text-gray-500 mt-1">{description}</p>}
        </div>
      )} */}

      {/* Actions Row */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <GlobalFilterInput
          value={globalFilter ?? ""}
          onChange={(value) => setGlobalFilter(String(value))}
          placeholder="Rechercher..."
        />
        <div className="flex gap-3">
          <Button
            variant="default"
            size="icon"
            className="h-11 w-11"
            onClick={exportToExcel}
          >
            <Download size={18} />
          </Button>
          <Popover open={showFilters} onOpenChange={setShowFilters}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-11 gap-2 px-4 bg-white">
                <SlidersHorizontal size={18} />
                Filtrer
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[500px]" align="end">
              <div className="flex flex-wrap gap-3">
                <div className="flex gap-2 w-full">
                  <Button
                    variant="default"
                    className="h-10 flex-1"
                    onClick={() => setShowFilters(false)}
                  >
                    <Check />
                    Appliquer
                  </Button>
                  <Button
                    variant="outline"
                    className="h-10 flex-1"
                    onClick={() => {
                      table.resetColumnFilters();
                    }}
                  >
                    <X />
                    Effacer les filtres
                  </Button>
                </div>
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanFilter())
                  .map((column) => (
                    <div key={column.id}>
                      <Select
                        onValueChange={(value) =>
                          column.setFilterValue(
                            value === "all" ? undefined : value,
                          )
                        }
                        value={(column.getFilterValue() as string) || "all"}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={column.id} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{column.id}</SelectItem>
                          {Array.from(column.getFacetedUniqueValues().keys())
                            .slice(0, 100)
                            .map((value) => (
                              <SelectItem
                                key={String(value)}
                                value={String(value)}
                              >
                                {String(value)}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-white overflow-hidden flex flex-col">
        <div className="flex-1 overflow-hidden">
          <Table className={classNames?.table}>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="bg-primary-background hover:bg-primary-background/90"
                >
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className="px-4 py-3 text-primary/70 font-semibold"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="border-b border-gray-100"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          "px-4 py-3 whitespace-nowrap",
                          classNames?.tableCell,
                        )}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-60">
                    {isLoading ? (
                      <div className="flex flex-col items-center justify-center gap-2 text-gray-500 w-full">
                        <Loader2
                          className="text-gray-500 animate-spin"
                          size={30}
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-2 text-gray-500 w-full">
                        <UserSearch className="text-gray-500" size={30} />
                        <p>Aucun résultat</p>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 py-4 border-t">
          {/* Previous Button */}
          <Button
            variant="outline"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft size={16} />
            Précédent
          </Button>

          {/* Page Numbers */}
          <div className="flex gap-1">
            {getPageNumbers().map((page, index) =>
              typeof page === "string" ? (
                <span
                  key={`ellipsis-${index}`}
                  className="w-10 h-10 flex items-center justify-center text-gray-500"
                >
                  ...
                </span>
              ) : (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  className={cn(
                    currentPage === page && "bg-primary text-white",
                  )}
                  onClick={() => table.setPageIndex(page)}
                  size="icon"
                >
                  {page + 1}
                </Button>
              ),
            )}
          </div>

          {/* Next Button */}
          <Button
            variant="outline"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Suivant
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
      <SelectionBar
        selectedCount={selected.length}
        onClear={onClearSelection}
      />
    </div>
  );
}
