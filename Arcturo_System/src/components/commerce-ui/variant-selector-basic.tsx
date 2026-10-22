"use client";

import { cn } from "@/lib/utils";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";

interface VariantItem {
  value: string;
  label: string;
  disabled?: boolean;
}

interface VariantSelectorProps {
  variants: VariantItem[];
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
  itemClassName?: string;
  labelClassName?: string;
}

const VariantSelectorBasic = ({
  variants,
  value,
  onValueChange,
  className,
  itemClassName,
  labelClassName,
}: VariantSelectorProps) => {
  return (
    <RadioGroupPrimitive.Root
      value={value}
      onValueChange={onValueChange}
      className={cn("grid grid-cols-3 gap-2", className)}
    >
      {variants.map((variant) => (
        <RadioGroupPrimitive.Item
          key={variant.value}
          value={variant.value}
          disabled={variant.disabled}
          className={cn(
            "flex items-center justify-center rounded-full border-2 p-2 text-sm font-bold transition-all cursor-pointer",
            "border-slate-200 hover:border-slate-300",
            "data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-50 data-[state=checked]:text-blue-700",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-50",
            itemClassName
          )}
        >
          <div className={cn("text-center", labelClassName)}>{variant.label}</div>
        </RadioGroupPrimitive.Item>
      ))}
    </RadioGroupPrimitive.Root>
  );
};

export default VariantSelectorBasic;
export type { VariantItem };
