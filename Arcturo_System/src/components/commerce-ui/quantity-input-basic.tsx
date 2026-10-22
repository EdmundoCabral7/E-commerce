"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuantityInputProps {
  className?: string;
  quantity: number;
  onChange: (quantity: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}

const QuantityInputBasic = ({
  className,
  quantity,
  onChange,
  min = 1,
  max,
  disabled = false,
}: QuantityInputProps) => {
  const handleDecrement = () => {
    if (quantity > min) {
      onChange(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (max === undefined || quantity < max) {
      onChange(quantity + 1);
    }
  };

  return (
    <div className={cn("inline-flex items-center border border-white/10 rounded-full h-12 p-1 bg-obsidian-card", className)}>
      <Button
        variant="ghost"
        size="icon"
        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 text-content-primary transition-colors"
        onClick={handleDecrement}
        disabled={disabled || quantity <= min}
      >
        <Minus className="h-4 w-4" />
      </Button>
      <div className="w-12 text-center font-bold text-content-primary">
        {quantity}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 text-content-primary transition-colors"
        onClick={handleIncrement}
        disabled={disabled || (max !== undefined && quantity >= max)}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default QuantityInputBasic;
