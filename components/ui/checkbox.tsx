"use client";

import { Checkbox as HeadlessCheckbox } from "@headlessui/react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

export function Checkbox({
  checked,
  onChange,
  className,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  className?: string;
}) {
  return (
    <HeadlessCheckbox
      checked={checked}
      onChange={onChange}
      className={cn(
        "group flex size-5 items-center justify-center rounded border border-zinc-300 bg-white data-checked:border-violet-500 data-checked:bg-violet-600",
        className,
      )}
    >
      <Check className="size-3.5 text-white opacity-0 group-data-checked:opacity-100" />
    </HeadlessCheckbox>
  );
}
