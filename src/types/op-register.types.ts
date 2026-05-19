import type { OPRegister } from "@/generated/prisma/client";

export type OPRegisterRow = OPRegister;

export type OPRegisterFormData = {
  sno: number;
  date: Date;
  patientName: string;
  age: number;
  sex: string;
  occupation: string;
  location: string;
  diagnosis: string;
  treatment: string;
  preAssessment: string;
  postAssessment: string;
  amount: number;
  typeOfVisit: string;
};

export type DashboardStats = {
  totalPatients: number;
  todayCount: number;
  monthCount: number;
  totalRevenue: number;
  recentRecords: OPRegisterRow[];
};

export type ActionResult<T = void> = {
  success: boolean;
  error?: string;
  data?: T;
};
