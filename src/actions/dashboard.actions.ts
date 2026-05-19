"use server";

import { startOfDay, endOfDay, startOfMonth } from "date-fns";
import { prisma } from "@/lib/prisma";
import type { DashboardStats } from "@/types/op-register.types";

export async function getDashboardStats(): Promise<DashboardStats> {
  const now = new Date();
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);
  const monthStart = startOfMonth(now);

  const [totalPatients, todayCount, monthCount, revenueResult, recentRecords] =
    await Promise.all([
      prisma.oPRegister.count(),
      prisma.oPRegister.count({
        where: { date: { gte: todayStart, lte: todayEnd } },
      }),
      prisma.oPRegister.count({
        where: { date: { gte: monthStart } },
      }),
      prisma.oPRegister.aggregate({ _sum: { amount: true } }),
      prisma.oPRegister.findMany({
        take: 10,
        orderBy: { date: "desc" },
      }),
    ]);

  return {
    totalPatients,
    todayCount,
    monthCount,
    totalRevenue: revenueResult._sum.amount ?? 0,
    recentRecords,
  };
}
