"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Driver } from "@/lib/data";

interface DriverSelectProps {
  /** All drivers eligible for assignment (unassigned) */
  availableDrivers: Driver[];
  /** Currently selected driver name, or null if none */
  selectedDriverName: string | null;
  /** Called when the selection changes */
  onChange: (driverName: string | null) => void;
  /** Optional placeholder text */
  placeholder?: string;
  disabled?: boolean;
}

function getStatusStyle(status: string) {
  switch (status) {
    case "On Duty":
      return "bg-teal-50 text-teal-700 border-teal-200";
    case "In Transit":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "Off Duty":
      return "bg-slate-50 text-slate-600 border-slate-200";
    default:
      return "bg-gray-50 text-gray-600 border-gray-200";
  }
}

export function DriverSelect({
  availableDrivers,
  selectedDriverName,
  onChange,
  placeholder = "Search driver...",
  disabled = false,
}: DriverSelectProps) {
  const [open, setOpen] = React.useState(false);

  const selectedDriver = availableDrivers.find(
    (d) => d.name === selectedDriverName,
  ) ?? null;

  const handleSelect = (driverName: string) => {
    // Clicking the already-selected driver deselects it
    onChange(selectedDriverName === driverName ? null : driverName);
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  return (
    <Popover open={open} onOpenChange={disabled ? undefined : setOpen}>
      {/* ── Trigger ── */}
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-controls="driver-select-listbox"
          disabled={disabled}
          className={cn(
            "w-full h-[38px] flex items-center gap-2 px-3 pr-8",
            "border border-card-border rounded-md bg-card text-sm text-left",
            "relative focus:outline-none focus:ring-2 focus:ring-primary/40",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "hover:border-primary/50 transition-colors",
          )}
        >
          {selectedDriver ? (
            <span className="flex items-center gap-2 min-w-0 flex-1">
              {/* Avatar-style initial circle */}
              <span className="size-5 shrink-0 rounded-full bg-primary/15 text-primary text-[10px] font-bold flex items-center justify-center uppercase">
                {selectedDriver.name.charAt(0)}
              </span>
              <span className="font-medium truncate">{selectedDriver.name}</span>
              <span className="text-muted-foreground text-xs truncate shrink-0">
                {selectedDriver.license}
              </span>
              {/* Clear button */}
              <button
                type="button"
                onClick={handleClear}
                aria-label="Clear selection"
                className="ml-auto shrink-0 rounded-full hover:bg-secondary p-0.5 transition-colors text-muted-foreground hover:text-foreground"
              >
                <X className="size-3" />
              </button>
            </span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}

          {/* Chevron pinned to right */}
          <ChevronsUpDown className="absolute right-2 top-1/2 -translate-y-1/2 size-4 shrink-0 text-muted-foreground pointer-events-none" />
        </button>
      </PopoverTrigger>

      {/* ── Dropdown ── */}
      <PopoverContent
        className="p-0 w-[var(--radix-popover-trigger-width)] border-card-border shadow-lg"
        align="start"
        sideOffset={4}
      >
        <Command>
          <CommandInput placeholder="Search by name or license..." />
          <CommandList id="driver-select-listbox">
            {availableDrivers.length === 0 ? (
              <CommandEmpty>No available drivers found.</CommandEmpty>
            ) : (
              <>
                <CommandEmpty>No drivers match your search.</CommandEmpty>
                <CommandGroup>
                  {availableDrivers.map((driver) => {
                    const isSelected = selectedDriverName === driver.name;
                    return (
                      <CommandItem
                        key={driver.license}
                        // Value used for cmdk's internal search filter
                        value={`${driver.name} ${driver.license} ${driver.phone}`}
                        onSelect={() => handleSelect(driver.name)}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        {/* Selection indicator */}
                        <span
                          className={cn(
                            "size-4 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors",
                            isSelected
                              ? "border-primary bg-primary"
                              : "border-muted-foreground/40 bg-card",
                          )}
                        >
                          {isSelected && (
                            <Check className="size-2.5 text-white" strokeWidth={3} />
                          )}
                        </span>

                        {/* Avatar initial */}
                        <span className="size-7 shrink-0 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center uppercase">
                          {driver.name.charAt(0)}
                        </span>

                        {/* Driver info */}
                        <span className="flex flex-col min-w-0 flex-1">
                          <span className="font-medium text-sm leading-tight truncate">
                            {driver.name}
                          </span>
                          <span className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-xs text-muted-foreground leading-tight">
                              {driver.license}
                            </span>
                            <span className="text-muted-foreground/40 text-xs">·</span>
                            <span className="flex items-center gap-0.5 text-amber-500 text-xs">
                              <Star className="size-2.5 fill-current" />
                              <span>{driver.safety_score.toFixed(1)}</span>
                            </span>
                          </span>
                        </span>

                        {/* Status badge */}
                        <span
                          className={cn(
                            "ml-auto shrink-0 px-1.5 py-0.5 rounded text-[10px] font-semibold border",
                            getStatusStyle(driver.status),
                          )}
                        >
                          {driver.status}
                        </span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
