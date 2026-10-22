"use client";

import { cn } from "@/lib/utils";

interface ProgressProps {
  value?: number;
  className?: string;
  indicatorClassName?: string;
}

const Progress = ({ value = 0, className, indicatorClassName }: ProgressProps) => {
  return (
    <div className={cn("relative h-1.5 w-full overflow-hidden rounded-full bg-slate-100", className)}>
      <div
        className={cn("h-full w-full flex-1 bg-black transition-all", indicatorClassName)}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </div>
  );
};

export { Progress };
