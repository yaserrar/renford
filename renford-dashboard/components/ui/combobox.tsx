"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";

interface ComboboxOption {
  value: string;
  label: string;
}

interface ComboboxProps {
  options: ComboboxOption[];
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  multiple?: boolean;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
  disabled?: boolean;
}

export function Combobox({
  options,
  value,
  onValueChange,
  multiple = false,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  emptyMessage = "No results.",
  className,
  disabled = false,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  const selectedValues = React.useMemo(
    () => (Array.isArray(value) ? value : value ? [value] : []),
    [value]
  );

  const selectedOptions = options.filter((option) =>
    selectedValues.includes(option.value)
  );

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setSearchValue("");
    }
  };

  const triggerLabel = React.useMemo(() => {
    if (selectedOptions.length === 0) return placeholder;
    if (!multiple) return selectedOptions[0]?.label ?? placeholder;
    if (selectedOptions.length <= 10) {
      return selectedOptions.map((option) => option.label).join(", ");
    }
    return `${selectedOptions.length} sélectionnés`;
  }, [selectedOptions, placeholder, multiple]);

  const handleSelect = (optionValue: string) => {
    if (multiple) {
      const exists = selectedValues.includes(optionValue);
      const newValues = exists
        ? selectedValues.filter((item) => item !== optionValue)
        : [...selectedValues, optionValue];
      onValueChange?.(newValues);
      return;
    }

    const newValue = optionValue === selectedValues[0] ? "" : optionValue;
    onValueChange?.(newValue);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "bg-white border border-input h-12 py-1 w-full justify-between px-3 text-gray-400",
            selectedOptions.length > 0 && "text-black",
            className
          )}
        >
          <span className="truncate">{triggerLabel}</span>
          <ChevronsUpDown className="h-4 w-4 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command className="w-full" shouldFilter={false}>
          <CommandInput
            placeholder={searchPlaceholder}
            value={searchValue}
            onValueChange={setSearchValue}
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={() => handleSelect(option.value)}
                >
                  {option.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedValues.includes(option.value)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
