"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOPRegister } from "@/hooks/use-op-register";
import type { OPRegisterRow } from "@/types/op-register.types";

const formSchema = z.object({
  sno: z.number().int().positive("S.No must be positive"),
  date: z.string().min(1, "Date is required"),
  patientName: z.string().min(2, "Name must be at least 2 characters"),
  age: z.number().int().min(1, "Min 1").max(120, "Max 120"),
  sex: z.enum(["Male", "Female", "Other"]),
  occupation: z.string().min(1, "Required"),
  location: z.string().min(1, "Required"),
  diagnosis: z.string().min(1, "Required"),
  treatment: z.string().min(1, "Required"),
  preAssessment: z.string().min(1, "Required"),
  postAssessment: z.string().min(1, "Required"),
  amount: z.number().int().min(0, "Min 0"),
  typeOfVisit: z.enum(["New", "Review", "Follow-up"]),
});

type FormValues = z.infer<typeof formSchema>;

type OPFormModalProps = {
  open: boolean;
  onClose: () => void;
  record?: OPRegisterRow | null;
  nextSno?: number;
};

const defaultValues = (nextSno = 1): FormValues => ({
  sno: nextSno,
  date: format(new Date(), "yyyy-MM-dd"),
  patientName: "",
  age: 0,
  sex: "Male",
  occupation: "",
  location: "",
  diagnosis: "",
  treatment: "",
  preAssessment: "",
  postAssessment: "",
  amount: 0,
  typeOfVisit: "New",
});

export default function OPFormModal({ open, onClose, record, nextSno }: OPFormModalProps) {
  const { create, update, isPending } = useOPRegister();
  const isEdit = !!record;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<FormValues>({ resolver: zodResolver(formSchema) as any });

  useEffect(() => {
    if (open) {
      if (record) {
        form.reset({
          sno: record.sno,
          date: format(new Date(record.date), "yyyy-MM-dd"),
          patientName: record.patientName,
          age: record.age,
          sex: record.sex as "Male" | "Female" | "Other",
          occupation: record.occupation,
          location: record.location,
          diagnosis: record.diagnosis,
          treatment: record.treatment,
          preAssessment: record.preAssessment,
          postAssessment: record.postAssessment,
          amount: record.amount,
          typeOfVisit: record.typeOfVisit as "New" | "Review" | "Follow-up",
        });
      } else {
        form.reset(defaultValues(nextSno));
      }
    }
  }, [open, record, nextSno, form]);

  function onSubmit(values: FormValues) {
    const data = { ...values, date: new Date(values.date) };
    if (isEdit && record) {
      update(record.id, data, onClose);
    } else {
      create(data, onClose);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Record" : "Add New Record"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sno"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>S.No</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        readOnly={isEdit}
                        className={isEdit ? "bg-slate-50" : ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="patientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patient Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="25"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sex"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sex</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(v) => field.onChange(v ?? "Male")}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="occupation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Occupation</FormLabel>
                    <FormControl>
                      <Input placeholder="Teacher, Engineer…" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="City / Area" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="diagnosis"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Diagnosis</FormLabel>
                    <FormControl>
                      <Input placeholder="Diagnosis" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="treatment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Treatment</FormLabel>
                    <FormControl>
                      <Input placeholder="Treatment given" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="preAssessment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pre-Assessment</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. VAS 7/10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="postAssessment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Post-Assessment</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. VAS 3/10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount (₹)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="500"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="typeOfVisit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type of Visit</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(v) => field.onChange(v ?? "New")}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="Review">Review</SelectItem>
                        <SelectItem value="Follow-up">Follow-up</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving…
                  </>
                ) : isEdit ? (
                  "Save Changes"
                ) : (
                  "Add Record"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
