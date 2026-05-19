import { Users, Calendar, TrendingUp, IndianRupee } from "lucide-react";
import { getDashboardStats } from "@/actions/dashboard.actions";
import StatCard from "@/components/dashboard/stat-card";
import RecentRecordsTable from "@/components/dashboard/recent-records-table";

export const metadata = { title: "Dashboard — Sharon Physiotherapy" };

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Patients"
          value={stats.totalPatients.toLocaleString("en-IN")}
          icon={Users}
          description="All time registrations"
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatCard
          title="Today's Visits"
          value={stats.todayCount}
          icon={Calendar}
          description="Registered today"
          iconBg="bg-green-100"
          iconColor="text-green-600"
        />
        <StatCard
          title="This Month"
          value={stats.monthCount}
          icon={TrendingUp}
          description="Month to date"
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
        />
        <StatCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue.toLocaleString("en-IN")}`}
          icon={IndianRupee}
          description="All time earnings"
          iconBg="bg-orange-100"
          iconColor="text-orange-600"
        />
      </div>

      <RecentRecordsTable records={stats.recentRecords} />
    </div>
  );
}
