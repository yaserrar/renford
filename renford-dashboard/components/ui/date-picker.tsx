"use client";

import * as React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export interface DatePickerProps {
  value?: Date;
  onChange: (date?: Date) => void;
  disabled?: boolean;
  placeholder?: string;
  fromDate?: Date; // optional min date
  toDate?: Date; // optional max date
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  disabled = false,
  placeholder = "Sélectionner une date",
  fromDate,
  toDate,
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "bg-white border border-input h-12 py-1 w-full justify-between px-3 text-gray-400",
            value && "text-black"
          )}
          disabled={disabled}
        >
          {value ? format(value, "dd/MM/yyyy") : placeholder}
          <div className="flex items-center gap-1">
            {value && (
              <span
                role="button"
                tabIndex={0}
                className="rounded-full p-0.5 hover:bg-gray-200 text-muted-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(undefined);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.stopPropagation();
                    onChange(undefined);
                  }
                }}
              >
                <X className="size-3.5" />
              </span>
            )}
            <CalendarIcon className="size-4" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-2 w-auto bg-white" align="start">
        <Calendar
          mode="single"
          selected={value}
          captionLayout="dropdown"
          onSelect={(d) => {
            onChange(d);
            setOpen(false);
          }}
          initialFocus
          fromDate={fromDate}
          toDate={toDate}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
