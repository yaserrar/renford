import { Column, Table as TanstackTable } from "@tanstack/react-table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate } from "@/lib/date";
import { CalendarIcon, X } from "lucide-react";
import { useEffect } from "react";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import ColumnFilterInput from "./column-filter-input";

const ColumnFilter = <TData,>({
  column,
  table,
}: {
  column: Column<TData, unknown>;
  table: TanstackTable<TData>;
}) => {
  const columnFilterValue = column.getFilterValue();
  const meta = column.columnDef.meta;

  useEffect(() => {
    table.setPageIndex(0);
  }, [columnFilterValue]);

  if (!meta || !meta.dataType || meta.dataType.type === "string") {
    return (
      <div className="relative mb-2 flex items-center gap-1">
        <ColumnFilterInput
          type="text"
          value={(columnFilterValue ?? "") as string}
          onChange={(value) => column.setFilterValue(value)}
          placeholder="Search..."
          list={column.id + "list"}
        />
        <Button
          className="absolute -right-2 -top-2 h-5 w-5"
          size="icon"
          variant="outline"
          onClick={() => {
            column.setFilterValue("");
          }}
        >
          <X size={15} />
        </Button>
      </div>
    );
  }

  if (meta.dataType?.type === "number") {
    return (
      <div className="mb-2 ml-2 flex gap-1">
        <ColumnFilterInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
          value={(columnFilterValue as [number, number])?.[0] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [value, old?.[1]])
          }
          placeholder="Min"
          className="w-20"
        />
        <ColumnFilterInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
          value={(columnFilterValue as [number, number])?.[1] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [old?.[0], value])
          }
          placeholder="Max"
          className="w-20"
        />
      </div>
    );
  }

  if (meta.dataType.type === "date") {
    const columnValue = columnFilterValue as
      | [Date | undefined, Date | undefined]
      | undefined;

    const date1 =
      columnValue && columnValue[0] ? new Date(columnValue[0]) : undefined;
    const date2 =
      columnValue && columnValue[1] ? new Date(columnValue[1]) : undefined;

    return (
      <div className="mb-2 ml-2 flex gap-1 ">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="px-2"
              size={date1 ? "default" : "icon"}
            >
              <CalendarIcon />
              {date1 && formatDate(date1)}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              captionLayout="label"
              fromYear={2010}
              toYear={new Date().getFullYear() + 1}
              mode="single"
              selected={date1}
              onSelect={(value) =>
                column.setFilterValue((old: [Date, Date]) => [value, old?.[1]])
              }
              initialFocus
              defaultMonth={date1}
            />
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="px-2"
              size={date2 ? "default" : "icon"}
            >
              <CalendarIcon />
              {date2 && formatDate(date2)}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              captionLayout="label"
              fromYear={2010}
              toYear={new Date().getFullYear() + 1}
              mode="single"
              selected={date2}
              onSelect={(value) =>
                column.setFilterValue((old: [Date, Date]) => [old?.[0], value])
              }
              initialFocus
              defaultMonth={date2}
            />
          </PopoverContent>
        </Popover>
      </div>
    );
  }

  if (meta.dataType.type === "select") {
    return (
      <Select
        value={(columnFilterValue ?? "") as string}
        onValueChange={(value) => column.setFilterValue(value)}
      >
        <div className="relative mb-2 flex items-center gap-1">
          <SelectTrigger
            className="w-fit"
            value={(columnFilterValue ?? "") as string}
          >
            <SelectValue placeholder="Sélectionner" />{" "}
          </SelectTrigger>
          <Button
            className="absolute -right-2 -top-2 h-5 w-5"
            size="icon"
            variant="outline"
            onClick={() => {
              column.setFilterValue("");
            }}
          >
            <X size={15} />
          </Button>
        </div>
        <SelectContent>
          {meta.dataType.options.map((option, i) => {
            return (
              <SelectItem
                key={`${option.value as string}-${i}`}
                value={option.value as string}
              >
                {option.label}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    );
  }

  return <></>;
};

export default ColumnFilter;
