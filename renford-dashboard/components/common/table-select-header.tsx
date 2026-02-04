"use client";

import { useMemo } from "react";
import { Table } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckedState } from "@radix-ui/react-checkbox";

type TableSelectHeaderProps<TData> = {
  table: Table<TData>;
  selected: string[];
  setSelected: (selected: string[]) => void;
  getRowId: (row: TData) => string;
  className?: string;
};

export function TableSelectHeader<TData>({
  table,
  selected,
  setSelected,
  getRowId,
  className = "mx-4",
}: TableSelectHeaderProps<TData>) {
  const { allFilteredIds, allSelected, someSelected } = useMemo(() => {
    const ids = table
      .getFilteredRowModel()
      .rows.map((row) => getRowId(row.original));
    const allSel = ids.length > 0 && ids.every((id) => selected.includes(id));
    const someSel = ids.some((id) => selected.includes(id)) && !allSel;

    return {
      allFilteredIds: ids,
      allSelected: allSel,
      someSelected: someSel,
    };
  }, [table.getFilteredRowModel().rows, selected, getRowId]);

  const handleCheckedChange = (value: CheckedState) => {
    if (value) {
      setSelected(allFilteredIds);
    } else {
      setSelected([]);
    }
  };

  return (
    <Checkbox
      checked={allSelected || (someSelected && "indeterminate")}
      onCheckedChange={handleCheckedChange}
      className={className}
      aria-label="Select all"
    />
  );
}
