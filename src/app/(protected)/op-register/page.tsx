import { getOPRecords, getNextSno } from "@/actions/op-register.actions";
import OPTable from "@/components/op-register/op-table";

export const metadata = { title: "OP Register — Sharon Physiotherapy" };

export default async function OPRegisterPage() {
  const [records, nextSno] = await Promise.all([getOPRecords(), getNextSno()]);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-800">Outpatient Register</h2>
        <p className="text-sm text-slate-500">Manage all patient records</p>
      </div>
      <OPTable initialData={records} nextSno={nextSno} />
    </div>
  );
}
