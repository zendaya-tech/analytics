"use client";

import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { Check, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

type Option = {
  value: string;
  label: string;
};

export function Dropdown({
  value,
  onChange,
  options,
  disabled,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  disabled?: boolean;
  className?: string;
}) {
  const selected = options.find((option) => option.value === value) ?? options[0];

  return (
    <Listbox value={selected?.value} onChange={onChange} disabled={disabled}>
      <div className={cn("relative", className)}>
        <ListboxButton className="flex h-10 w-full items-center justify-between rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-900 shadow-xs outline-none data-focus:border-violet-500 disabled:cursor-not-allowed disabled:opacity-60">
          <span className="truncate">{selected?.label ?? "Select"}</span>
          <ChevronDown className="size-4 text-zinc-500" />
        </ListboxButton>
        <ListboxOptions anchor="bottom" className="z-50 mt-1 w-[var(--button-width)] rounded-md border border-zinc-200 bg-white p-1 shadow-lg [--anchor-gap:4px]">
          {options.map((option) => (
            <ListboxOption
              key={option.value}
              value={option.value}
              className="group flex cursor-pointer items-center justify-between rounded px-2 py-2 text-sm text-zinc-700 data-focus:bg-violet-50 data-focus:text-violet-800"
            >
              <span>{option.label}</span>
              <Check className="size-4 opacity-0 group-data-selected:opacity-100" />
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  );
}
