import { useWindowSize } from "@uidotdev/usehooks";
import { addDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

type Props = {
  dateRange: DateRange | undefined;
  setDateRange: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
} & React.HTMLAttributes<HTMLDivElement>;

const DateRangePicker = ({ className, dateRange, setDateRange }: Props) => {
  const size = useWindowSize();
  const [open, setOpen] = useState(false);
  const [currentDateRange, setCurrentDateRange] = useState(dateRange);

  useEffect(() => {
    if (!open) {
      setDateRange(currentDateRange);
    }
  }, [open, currentDateRange, setDateRange]);

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !currentDateRange && "text-muted-foreground"
            )}
          >
            <CalendarIcon />
            {currentDateRange?.from ? (
              currentDateRange.to ? (
                <>
                  {format(currentDateRange.from, "LLL dd, y")} -{" "}
                  {format(currentDateRange.to, "LLL dd, y")}
                </>
              ) : (
                format(currentDateRange.from, "LLL dd, y")
              )
            ) : (
              <span>Choisir une date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex flex-col md:flex-row gap-2 justify-between p-4 flex-wrap">
            <Button
              variant="outline"
              onClick={() => {
                setCurrentDateRange({
                  from: addDays(new Date(), -7),
                  to: new Date(),
                });
                setOpen(false);
              }}
            >
              Les 7 derniers jours
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setCurrentDateRange({
                  from: addDays(new Date(), -30),
                  to: new Date(),
                });
                setOpen(false);
              }}
            >
              Les 30 derniers jours
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                setCurrentDateRange({
                  from: addDays(new Date(), -60),
                  to: new Date(),
                });
                setOpen(false);
              }}
            >
              Les 60 derniers jours
            </Button>
          </div>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={currentDateRange?.from}
            selected={currentDateRange}
            onSelect={setCurrentDateRange}
            numberOfMonths={size.width && size.width > 768 ? 2 : 1}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateRangePicker;
