"use client";

import { useState, useMemo, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type SortingState,
  type ColumnFiltersState,
  type FilterFn,
} from "@tanstack/react-table";
import { Plus, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import OPFilters from "./op-filters";
import OPExportButtons from "./op-export-buttons";
import OPFormModal from "./op-form-modal";
import OPDeleteDialog from "./op-delete-dialog";
import { createColumns } from "./op-columns";
import type { OPRegisterRow } from "@/types/op-register.types";

const globalFilterFn: FilterFn<OPRegisterRow> = (row, _columnId, value: string) => {
  if (!value) return true;
  const q = value.toLowerCase();
  return (
    row.original.patientName.toLowerCase().includes(q) ||
    row.original.diagnosis.toLowerCase().includes(q) ||
    row.original.location.toLowerCase().includes(q)
  );
};

export default function OPTable({
  initialData,
  nextSno,
}: {
  initialData: OPRegisterRow[];
  nextSno: number;
}) {
  const [data, setData] = useState<OPRegisterRow[]>(initialData);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sexFilter, setSexFilter] = useState("all");
  const [visitFilter, setVisitFilter] = useState("all");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const [addOpen, setAddOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<OPRegisterRow | null>(null);
  const [deleteRecord, setDeleteRecord] = useState<OPRegisterRow | null>(null);

  const columns = useMemo(
    () => createColumns((r) => setEditRecord(r), (r) => setDeleteRecord(r)),
    []
  );

  const filteredData = useMemo(() => {
    let rows = data;
    if (dateFrom) {
      const from = new Date(dateFrom);
      rows = rows.filter((r) => new Date(r.date) >= from);
    }
    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      rows = rows.filter((r) => new Date(r.date) <= to);
    }
    if (sexFilter !== "all") {
      rows = rows.filter((r) => r.sex === sexFilter);
    }
    if (visitFilter !== "all") {
      rows = rows.filter((r) => r.typeOfVisit === visitFilter);
    }
    return rows;
  }, [data, dateFrom, dateTo, sexFilter, visitFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting, columnFilters, globalFilter, pagination },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    globalFilterFn,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const { pageIndex, pageSize } = table.getState().pagination;
  const totalFiltered = table.getFilteredRowModel().rows.length;
  const from = totalFiltered === 0 ? 0 : pageIndex * pageSize + 1;
  const to = Math.min((pageIndex + 1) * pageSize, totalFiltered);

  function resetFilters() {
    setGlobalFilter("");
    setDateFrom("");
    setDateTo("");
    setSexFilter("all");
    setVisitFilter("all");
    setPagination((p) => ({ ...p, pageIndex: 0 }));
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <OPFilters
          globalFilter={globalFilter}
          onGlobalFilterChange={(v) => { setGlobalFilter(v); setPagination((p) => ({ ...p, pageIndex: 0 })); }}
          dateFrom={dateFrom}
          dateTo={dateTo}
          onDateFromChange={(v) => { setDateFrom(v); setPagination((p) => ({ ...p, pageIndex: 0 })); }}
          onDateToChange={(v) => { setDateTo(v); setPagination((p) => ({ ...p, pageIndex: 0 })); }}
          sexFilter={sexFilter}
          onSexFilterChange={(v) => { setSexFilter(v); setPagination((p) => ({ ...p, pageIndex: 0 })); }}
          visitFilter={visitFilter}
          onVisitFilterChange={(v) => { setVisitFilter(v); setPagination((p) => ({ ...p, pageIndex: 0 })); }}
          onReset={resetFilters}
        />
        <div className="flex items-center gap-2">
          <OPExportButtons
            getData={() => table.getFilteredRowModel().rows.map((r) => r.original)}
          />
          <Button
            size="sm"
            className="h-8 text-xs bg-blue-600 hover:bg-blue-700 gap-1.5"
            onClick={() => setAddOpen(true)}
          >
            <Plus className="h-3.5 w-3.5" />
            Add New
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id} className="border-b border-slate-200 bg-slate-50">
                  {hg.headers.map((h) => (
                    <th
                      key={h.id}
                      className="px-3 py-2.5 text-left whitespace-nowrap"
                      style={{ width: h.getSize() }}
                    >
                      {h.isPlaceholder
                        ? null
                        : flexRender(h.column.columnDef.header, h.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-12 text-center text-sm text-slate-400"
                  >
                    No records found
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-3 py-2" style={{ width: cell.column.getSize() }}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-white">
          <span className="text-xs text-slate-500">
            {totalFiltered === 0
              ? "No records"
              : `Showing ${from}–${to} of ${totalFiltered} records`}
          </span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500">Rows:</span>
              <Select
                value={String(pageSize)}
                onValueChange={(v) =>
                  setPagination({ pageIndex: 0, pageSize: Number(v ?? 10) })
                }
              >
                <SelectTrigger className="h-7 w-[60px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[10, 25, 50].map((n) => (
                    <SelectItem key={n} value={String(n)} className="text-xs">
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-0.5">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => table.firstPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronsLeft className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              <span className="text-xs text-slate-600 px-2">
                {pageIndex + 1} / {table.getPageCount() || 1}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => table.lastPage()}
                disabled={!table.getCanNextPage()}
              >
                <ChevronsRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <OPFormModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        nextSno={nextSno}
      />
      <OPFormModal
        open={!!editRecord}
        onClose={() => setEditRecord(null)}
        record={editRecord}
      />
      <OPDeleteDialog
        record={deleteRecord}
        onClose={() => setDeleteRecord(null)}
      />
    </div>
  );
}
