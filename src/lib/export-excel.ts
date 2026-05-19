import * as XLSX from "xlsx";
import { format } from "date-fns";
import type { OPRegisterRow } from "@/types/op-register.types";

export function exportToExcel(data: OPRegisterRow[], filename = "op-register") {
  const rows = data.map((r) => ({
    "S.No": r.sno,
    Date: format(new Date(r.date), "dd/MM/yyyy"),
    "Patient Name": r.patientName,
    Age: r.age,
    Sex: r.sex,
    Occupation: r.occupation,
    Location: r.location,
    Diagnosis: r.diagnosis,
    Treatment: r.treatment,
    "Pre-Assessment": r.preAssessment,
    "Post-Assessment": r.postAssessment,
    "Amount (₹)": r.amount,
    "Type of Visit": r.typeOfVisit,
  }));

  const ws = XLSX.utils.json_to_sheet(rows);

  const colWidths = [
    { wch: 6 }, { wch: 12 }, { wch: 22 }, { wch: 5 }, { wch: 8 },
    { wch: 16 }, { wch: 16 }, { wch: 22 }, { wch: 22 },
    { wch: 18 }, { wch: 18 }, { wch: 12 }, { wch: 12 },
  ];
  ws["!cols"] = colWidths;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "OP Register");
  XLSX.writeFile(wb, `${filename}-${format(new Date(), "yyyy-MM-dd")}.xlsx`);
}
