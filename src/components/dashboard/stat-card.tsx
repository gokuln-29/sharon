import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type StatCardProps = {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  iconBg: string;
  iconColor: string;
};

export default function StatCard({
  title,
  value,
  icon: Icon,
  description,
  iconBg,
  iconColor,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-start gap-4">
      <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl flex-shrink-0", iconBg)}>
        <Icon className={cn("h-5 w-5", iconColor)} />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-slate-500 font-medium">{title}</p>
        <p className="text-2xl font-bold text-slate-900 mt-0.5">{value}</p>
        {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
      </div>
    </div>
  );
}
