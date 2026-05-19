"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import type { ActionResult, OPRegisterFormData, OPRegisterRow } from "@/types/op-register.types";

const OPRegisterSchema = z.object({
  sno: z.coerce.number().int().positive(),
  date: z.coerce.date(),
  patientName: z.string().min(2, "Name must be at least 2 characters"),
  age: z.coerce.number().int().min(1).max(120),
  sex: z.enum(["Male", "Female", "Other"]),
  occupation: z.string().min(1, "Required"),
  location: z.string().min(1, "Required"),
  diagnosis: z.string().min(1, "Required"),
  treatment: z.string().min(1, "Required"),
  preAssessment: z.string().min(1, "Required"),
  postAssessment: z.string().min(1, "Required"),
  amount: z.coerce.number().int().min(0),
  typeOfVisit: z.enum(["New", "Review", "Follow-up"]),
});

export async function getOPRecords(): Promise<OPRegisterRow[]> {
  return prisma.oPRegister.findMany({ orderBy: { date: "desc" } });
}

export async function getNextSno(): Promise<number> {
  const last = await prisma.oPRegister.findFirst({ orderBy: { sno: "desc" } });
  return (last?.sno ?? 0) + 1;
}

export async function createOPRecord(
  data: OPRegisterFormData
): Promise<ActionResult<OPRegisterRow>> {
  const parsed = OPRegisterSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Validation failed" };
  }

  try {
    const record = await prisma.oPRegister.create({ data: parsed.data });
    revalidatePath("/op-register");
    revalidatePath("/dashboard");
    return { success: true, data: record };
  } catch {
    return { success: false, error: "Failed to create record" };
  }
}

export async function updateOPRecord(
  id: number,
  data: OPRegisterFormData
): Promise<ActionResult<OPRegisterRow>> {
  const parsed = OPRegisterSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Validation failed" };
  }

  try {
    const record = await prisma.oPRegister.update({ where: { id }, data: parsed.data });
    revalidatePath("/op-register");
    revalidatePath("/dashboard");
    return { success: true, data: record };
  } catch {
    return { success: false, error: "Failed to update record" };
  }
}

export async function deleteOPRecord(id: number): Promise<ActionResult> {
  try {
    await prisma.oPRegister.delete({ where: { id } });
    revalidatePath("/op-register");
    revalidatePath("/dashboard");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to delete record" };
  }
}
