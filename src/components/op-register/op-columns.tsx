"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { OPRegisterRow } from "@/types/op-register.types";

const visitBadgeClass: Record<string, string> = {
  New: "bg-blue-100 text-blue-700 hover:bg-blue-100 border-0",
  Review: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-0",
  "Follow-up": "bg-green-100 text-green-700 hover:bg-green-100 border-0",
};

function SortHeader({ label, column }: { label: string; column: any }) {
  return (
    <button
      className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {label}
      <ArrowUpDown className="h-3 w-3" />
    </button>
  );
}

export function createColumns(
  onEdit: (row: OPRegisterRow) => void,
  onDelete: (row: OPRegisterRow) => void
): ColumnDef<OPRegisterRow>[] {
  return [
    {
      accessorKey: "sno",
      header: ({ column }) => <SortHeader label="S.No" column={column} />,
      cell: ({ row }) => <span className="text-slate-600">{row.original.sno}</span>,
      size: 60,
    },
    {
      accessorKey: "date",
      header: ({ column }) => <SortHeader label="Date" column={column} />,
      cell: ({ row }) => (
        <span className="text-slate-600 whitespace-nowrap">
          {format(new Date(row.original.date), "dd/MM/yyyy")}
        </span>
      ),
      size: 90,
    },
    {
      accessorKey: "patientName",
      header: ({ column }) => <SortHeader label="Patient Name" column={column} />,
      cell: ({ row }) => (
        <span className="font-medium text-slate-800 whitespace-nowrap">{row.original.patientName}</span>
      ),
      size: 140,
    },
    {
      accessorKey: "age",
      header: ({ column }) => <SortHeader label="Age" column={column} />,
      cell: ({ row }) => <span className="text-slate-600">{row.original.age}</span>,
      size: 55,
    },
    {
      accessorKey: "sex",
      header: "Sex",
      cell: ({ row }) => <span className="text-slate-600">{row.original.sex}</span>,
      size: 65,
    },
    {
      accessorKey: "occupation",
      header: "Occupation",
      cell: ({ row }) => (
        <span className="text-slate-600 max-w-[100px] truncate block" title={row.original.occupation}>
          {row.original.occupation}
        </span>
      ),
      size: 110,
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => (
        <span className="text-slate-600 max-w-[100px] truncate block" title={row.original.location}>
          {row.original.location}
        </span>
      ),
      size: 110,
    },
    {
      accessorKey: "diagnosis",
      header: "Diagnosis",
      cell: ({ row }) => (
        <span className="text-slate-600 max-w-[140px] truncate block" title={row.original.diagnosis}>
          {row.original.diagnosis}
        </span>
      ),
      size: 150,
    },
    {
      accessorKey: "treatment",
      header: "Treatment",
      cell: ({ row }) => (
        <span className="text-slate-600 max-w-[130px] truncate block" title={row.original.treatment}>
          {row.original.treatment}
        </span>
      ),
      size: 140,
    },
    {
      accessorKey: "preAssessment",
      header: "Pre-Assessment",
      cell: ({ row }) => (
        <span className="text-slate-600 max-w-[120px] truncate block" title={row.original.preAssessment}>
          {row.original.preAssessment}
        </span>
      ),
      size: 130,
    },
    {
      accessorKey: "postAssessment",
      header: "Post-Assessment",
      cell: ({ row }) => (
        <span className="text-slate-600 max-w-[120px] truncate block" title={row.original.postAssessment}>
          {row.original.postAssessment}
        </span>
      ),
      size: 130,
    },
    {
      accessorKey: "amount",
      header: ({ column }) => <SortHeader label="Amount" column={column} />,
      cell: ({ row }) => (
        <span className="text-slate-700 font-medium whitespace-nowrap">
          ₹{row.original.amount.toLocaleString("en-IN")}
        </span>
      ),
      size: 90,
    },
    {
      accessorKey: "typeOfVisit",
      header: "Visit Type",
      cell: ({ row }) => (
        <Badge className={visitBadgeClass[row.original.typeOfVisit] ?? "bg-slate-100 text-slate-600 border-0"}>
          {row.original.typeOfVisit}
        </Badge>
      ),
      size: 90,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-slate-500 hover:text-blue-600 hover:bg-blue-50"
            onClick={() => onEdit(row.original)}
            title="Edit"
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-slate-500 hover:text-red-600 hover:bg-red-50"
            onClick={() => onDelete(row.original)}
            title="Delete"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
      size: 70,
    },
  ];
}
