"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
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
import { Device } from "@/lib/data";

interface DeviceMultiSelectProps {
  /** All devices that are eligible — those with remaining inventory (available > 0) */
  availableDevices: Device[];
  /** Currently selected device IDs */
  selectedIds: string[];
  /** Called whenever the selection changes */
  onChange: (ids: string[]) => void;
  /** Optional placeholder text */
  placeholder?: string;
  disabled?: boolean;
}

export function DeviceMultiSelect({
  availableDevices,
  selectedIds,
  onChange,
  placeholder = "Select devices...",
  disabled = false,
}: DeviceMultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const toggle = (deviceId: string) => {
    if (selectedIds.includes(deviceId)) {
      onChange(selectedIds.filter((id) => id !== deviceId));
    } else {
      onChange([...selectedIds, deviceId]);
    }
  };

  const remove = (deviceId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selectedIds.filter((id) => id !== deviceId));
  };

  const selectedDevices = availableDevices.filter((d) =>
    selectedIds.includes(d.id),
  );

  return (
    <Popover open={open} onOpenChange={disabled ? undefined : setOpen}>
      {/* ── Trigger ── */}
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-controls="device-multiselect-listbox"
          disabled={disabled}
          className={cn(
            "w-full min-h-[38px] flex items-start gap-1.5 flex-wrap p-2 pr-8",
            "border border-card-border rounded-md bg-card text-sm text-left",
            "relative focus:outline-none focus:ring-2 focus:ring-primary/40",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "hover:border-primary/50 transition-colors",
          )}
        >
          {selectedDevices.length === 0 ? (
            <span className="text-muted-foreground self-center">
              {placeholder}
            </span>
          ) : (
            selectedDevices.map((d) => (
              <span
                key={d.id}
                className={cn(
                  "inline-flex items-center gap-1 pl-2 pr-1 py-0.5",
                  "bg-primary/10 text-primary border border-primary/20",
                  "rounded-full text-xs font-medium leading-tight",
                )}
              >
                <span>{d.id}</span>
                <span className="text-primary/60">·</span>
                <span className="text-primary/80 max-w-[80px] truncate">
                  {d.model}
                </span>
                <button
                  type="button"
                  onClick={(e) => remove(d.id, e)}
                  className="ml-0.5 rounded-full hover:bg-primary/20 p-0.5 transition-colors"
                  aria-label={`Remove ${d.id}`}
                >
                  <X className="size-2.5" />
                </button>
              </span>
            ))
          )}

          {/* Chevron icon pinned to right */}
          <ChevronsUpDown className="absolute right-2 top-2.5 size-4 shrink-0 text-muted-foreground pointer-events-none" />
        </button>
      </PopoverTrigger>

      {/* ── Dropdown ── */}
      <PopoverContent
        className="p-0 w-[var(--radix-popover-trigger-width)] border-card-border shadow-lg"
        align="start"
        sideOffset={4}
      >
        <Command>
          <CommandInput placeholder="Search by ID or model..." />
          <CommandList id="device-multiselect-listbox">
            {availableDevices.length === 0 ? (
              <CommandEmpty>No devices with available inventory.</CommandEmpty>
            ) : (
              <>
                <CommandEmpty>No devices match your search.</CommandEmpty>
                <CommandGroup>
                  {availableDevices.map((device) => {
                    const isSelected = selectedIds.includes(device.id);
                    const remaining = device.available;
                    return (
                      <CommandItem
                        key={device.id}
                        value={`${device.id} ${device.model} ${device.type}`}
                        onSelect={() => toggle(device.id)}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        {/* Checkbox indicator */}
                        <span
                          className={cn(
                            "size-4 shrink-0 rounded border flex items-center justify-center transition-colors",
                            isSelected
                              ? "bg-primary border-primary text-white"
                              : "border-card-border bg-card",
                          )}
                        >
                          {isSelected && <Check className="size-3" />}
                        </span>

                        {/* Device info */}
                        <span className="flex flex-col min-w-0 flex-1">
                          <span className="font-medium text-sm leading-tight">
                            {device.id}
                            <span className="ml-1.5 text-muted-foreground font-normal">
                              {device.model}
                            </span>
                          </span>
                          <span className="text-xs text-muted-foreground leading-tight mt-0.5 flex items-center gap-1.5">
                            {device.type}
                            {device.health && (
                              <>
                                {" · "}
                                <span
                                  className={cn(
                                    device.health === "Excellent" ||
                                      device.health === "Good"
                                      ? "text-teal-600"
                                      : device.health === "Fair"
                                        ? "text-amber-600"
                                        : "text-red-600",
                                  )}
                                >
                                  {device.health}
                                </span>
                              </>
                            )}
                            {" · "}
                            <span
                              className={cn(
                                "font-medium",
                                remaining <= 5
                                  ? "text-amber-600"
                                  : "text-teal-600",
                              )}
                            >
                              Available: {remaining}
                            </span>
                          </span>
                        </span>

                        {/* Status badge */}
                        <span
                          className={cn(
                            "ml-auto shrink-0 px-1.5 py-0.5 rounded text-[10px] font-semibold border",
                            device.status === "Online"
                              ? "bg-teal-50 text-teal-700 border-teal-200"
                              : "bg-red-50 text-red-700 border-red-200",
                          )}
                        >
                          {device.status}
                        </span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </>
            )}
          </CommandList>

          {/* Footer: selection count + clear */}
          {selectedIds.length > 0 && (
            <div className="border-t border-card-border px-3 py-2 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {selectedIds.length} device{selectedIds.length !== 1 ? "s" : ""}{" "}
                selected
              </span>
              <button
                type="button"
                onClick={() => onChange([])}
                className="text-xs text-primary hover:underline"
              >
                Clear all
              </button>
            </div>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
