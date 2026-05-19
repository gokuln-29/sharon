"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import {
  createOPRecord,
  updateOPRecord,
  deleteOPRecord,
} from "@/actions/op-register.actions";
import type { OPRegisterFormData } from "@/types/op-register.types";

export function useOPRegister() {
  const [isPending, startTransition] = useTransition();

  function create(data: OPRegisterFormData, onSuccess?: () => void) {
    startTransition(async () => {
      const result = await createOPRecord(data);
      if (result.success) {
        toast.success("Record added successfully");
        onSuccess?.();
      } else {
        toast.error(result.error ?? "Failed to add record");
      }
    });
  }

  function update(id: number, data: OPRegisterFormData, onSuccess?: () => void) {
    startTransition(async () => {
      const result = await updateOPRecord(id, data);
      if (result.success) {
        toast.success("Record updated successfully");
        onSuccess?.();
      } else {
        toast.error(result.error ?? "Failed to update record");
      }
    });
  }

  function remove(id: number, onSuccess?: () => void) {
    startTransition(async () => {
      const result = await deleteOPRecord(id);
      if (result.success) {
        toast.success("Record deleted");
        onSuccess?.();
      } else {
        toast.error(result.error ?? "Failed to delete record");
      }
    });
  }

  return { create, update, remove, isPending };
}
