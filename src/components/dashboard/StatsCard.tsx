import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  label: string;
  value: string | number;
  delta?: string;
  icon: LucideIcon;
  tone?: "default" | "success" | "warning" | "danger";
  index?: number;
}

const tones = {
  default: "bg-secondary text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/15 text-warning",
  danger: "bg-destructive/10 text-destructive",
};

export function StatsCard({ label, value, delta, icon: Icon, tone = "default", index = 0 }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.25, 1, 0.5, 1] }}
      whileHover={{ y: -4 }}
      className="rounded-3xl bg-surface border border-border/60 p-6 shadow-soft-sm hover:shadow-soft-lg transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div className={cn("grid h-11 w-11 place-items-center rounded-2xl", tones[tone])}>
          <Icon className="h-5 w-5" strokeWidth={2.25} />
        </div>
        {delta && (
          <span className="text-xs font-bold text-muted-foreground tabular-nums">{delta}</span>
        )}
      </div>
      <div className="mt-5">
        <div className="text-3xl font-extrabold tracking-tight tabular-nums">{value}</div>
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-1">{label}</div>
      </div>
    </motion.div>
  );
}
