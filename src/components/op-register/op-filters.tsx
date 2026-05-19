"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type OPFiltersProps = {
  globalFilter: string;
  onGlobalFilterChange: (value: string) => void;
  dateFrom: string;
  dateTo: string;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  sexFilter: string;
  onSexFilterChange: (value: string) => void;
  visitFilter: string;
  onVisitFilterChange: (value: string) => void;
  onReset: () => void;
};

export default function OPFilters({
  globalFilter,
  onGlobalFilterChange,
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  sexFilter,
  onSexFilterChange,
  visitFilter,
  onVisitFilterChange,
  onReset,
}: OPFiltersProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [searchValue, setSearchValue] = useState(globalFilter);

  useEffect(() => {
    setSearchValue(globalFilter);
  }, [globalFilter]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setSearchValue(val);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        onGlobalFilterChange(val);
      }, 300);
    },
    [onGlobalFilterChange]
  );

  const hasFilters =
    globalFilter || dateFrom || dateTo || sexFilter !== "all" || visitFilter !== "all";

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <div className="relative flex-1 min-w-[180px]">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
        <Input
          placeholder="Search patient, diagnosis, location…"
          value={searchValue}
          onChange={handleSearchChange}
          className="pl-8 h-8 text-sm"
        />
      </div>

      <Input
        type="date"
        value={dateFrom}
        onChange={(e) => onDateFromChange(e.target.value)}
        className="h-8 text-sm w-[130px]"
        title="From date"
      />
      <span className="text-slate-400 text-xs">to</span>
      <Input
        type="date"
        value={dateTo}
        onChange={(e) => onDateToChange(e.target.value)}
        className="h-8 text-sm w-[130px]"
        title="To date"
      />

      <Select
        value={sexFilter}
        onValueChange={(v) => onSexFilterChange(v ?? "all")}
      >
        <SelectTrigger className="h-8 text-sm w-[100px]">
          <SelectValue placeholder="Sex" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Sex</SelectItem>
          <SelectItem value="Male">Male</SelectItem>
          <SelectItem value="Female">Female</SelectItem>
          <SelectItem value="Other">Other</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={visitFilter}
        onValueChange={(v) => onVisitFilterChange(v ?? "all")}
      >
        <SelectTrigger className="h-8 text-sm w-[120px]">
          <SelectValue placeholder="Visit Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Visits</SelectItem>
          <SelectItem value="New">New</SelectItem>
          <SelectItem value="Review">Review</SelectItem>
          <SelectItem value="Follow-up">Follow-up</SelectItem>
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-xs text-slate-500 hover:text-slate-700 gap-1"
          onClick={onReset}
        >
          <X className="h-3 w-3" />
          Reset
        </Button>
      )}
    </div>
  );
}
