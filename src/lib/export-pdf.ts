import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import type { OPRegisterRow } from "@/types/op-register.types";

export function exportToPDF(data: OPRegisterRow[], filename = "op-register") {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text("Sharon Physiotherapy — OP Register", 14, 14);
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`Generated: ${format(new Date(), "dd/MM/yyyy HH:mm")} | Total records: ${data.length}`, 14, 20);

  autoTable(doc, {
    startY: 26,
    head: [
      ["S.No", "Date", "Patient Name", "Age", "Sex", "Occupation", "Location",
        "Diagnosis", "Treatment", "Pre-Asmt", "Post-Asmt", "Amt (₹)", "Visit"],
    ],
    body: data.map((r) => [
      r.sno,
      format(new Date(r.date), "dd/MM/yy"),
      r.patientName,
      r.age,
      r.sex,
      r.occupation,
      r.location,
      r.diagnosis,
      r.treatment,
      r.preAssessment,
      r.postAssessment,
      `₹${r.amount.toLocaleString("en-IN")}`,
      r.typeOfVisit,
    ]),
    styles: {
      fontSize: 7,
      cellPadding: 1.5,
      textColor: [30, 41, 59],
    },
    headStyles: {
      fillColor: [37, 99, 235],
      textColor: 255,
      fontStyle: "bold",
      fontSize: 7,
    },
    alternateRowStyles: {
      fillColor: [239, 246, 255],
    },
    margin: { left: 10, right: 10 },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 16 },
      2: { cellWidth: 28 },
      3: { cellWidth: 8 },
      4: { cellWidth: 11 },
    },
  });

  doc.save(`${filename}-${format(new Date(), "yyyy-MM-dd")}.pdf`);
}
