import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import type { OPRegisterRow } from "@/types/op-register.types";

const visitColors: Record<string, string> = {
  New: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  Review: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
  "Follow-up": "bg-green-100 text-green-700 hover:bg-green-100",
};

export default function RecentRecordsTable({ records }: { records: OPRegisterRow[] }) {
  if (records.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-sm font-semibold text-slate-700 mb-4">Recent Registrations</h2>
        <p className="text-sm text-slate-400 text-center py-8">No records yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100">
        <h2 className="text-sm font-semibold text-slate-700">Recent Registrations</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left px-4 py-2.5 text-xs font-medium text-slate-500">S.No</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-slate-500">Date</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-slate-500">Patient Name</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-slate-500">Diagnosis</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-slate-500">Visit</th>
              <th className="text-right px-4 py-2.5 text-xs font-medium text-slate-500">Amount</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                <td className="px-4 py-2.5 text-slate-600">{r.sno}</td>
                <td className="px-4 py-2.5 text-slate-600">{format(new Date(r.date), "dd/MM/yyyy")}</td>
                <td className="px-4 py-2.5 font-medium text-slate-800">{r.patientName}</td>
                <td className="px-4 py-2.5 text-slate-600 max-w-[180px] truncate">{r.diagnosis}</td>
                <td className="px-4 py-2.5">
                  <Badge className={visitColors[r.typeOfVisit] ?? "bg-slate-100 text-slate-600"}>
                    {r.typeOfVisit}
                  </Badge>
                </td>
                <td className="px-4 py-2.5 text-right text-slate-700 font-medium">
                  ₹{r.amount.toLocaleString("en-IN")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
