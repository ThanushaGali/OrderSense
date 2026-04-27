import { cn } from "@/lib/utils";
import type { RiskLevel } from "@/data/restaurants";

interface StatusPillProps {
  level: RiskLevel;
  label?: string;
  className?: string;
}

const styles: Record<RiskLevel, string> = {
  low: "bg-success/10 text-success",
  medium: "bg-warning/15 text-warning",
  high: "bg-destructive/10 text-destructive",
};

const dot: Record<RiskLevel, string> = {
  low: "bg-success",
  medium: "bg-warning",
  high: "bg-destructive",
};

const defaultLabel: Record<RiskLevel, string> = {
  low: "Low risk",
  medium: "Medium risk",
  high: "High risk",
};

export function StatusPill({ level, label, className }: StatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider",
        styles[level],
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", dot[level])} />
      {label ?? defaultLabel[level]}
    </span>
  );
}
