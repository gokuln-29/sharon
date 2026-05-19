"use client";

import { useState } from "react";
import { FileSpreadsheet, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { OPRegisterRow } from "@/types/op-register.types";

type OPExportButtonsProps = {
  getData: () => OPRegisterRow[];
};

export default function OPExportButtons({ getData }: OPExportButtonsProps) {
  const [excelLoading, setExcelLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  async function handleExcel() {
    setExcelLoading(true);
    try {
      const { exportToExcel } = await import("@/lib/export-excel");
      exportToExcel(getData());
    } finally {
      setExcelLoading(false);
    }
  }

  async function handlePDF() {
    setPdfLoading(true);
    try {
      const { exportToPDF } = await import("@/lib/export-pdf");
      exportToPDF(getData());
    } finally {
      setPdfLoading(false);
    }
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        className="h-8 text-xs gap-1.5 text-green-700 border-green-200 hover:bg-green-50"
        onClick={handleExcel}
        disabled={excelLoading}
      >
        {excelLoading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <FileSpreadsheet className="h-3.5 w-3.5" />
        )}
        Excel
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="h-8 text-xs gap-1.5 text-red-700 border-red-200 hover:bg-red-50"
        onClick={handlePDF}
        disabled={pdfLoading}
      >
        {pdfLoading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <FileText className="h-3.5 w-3.5" />
        )}
        PDF
      </Button>
    </div>
  );
}
