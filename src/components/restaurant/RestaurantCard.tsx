import { motion } from "framer-motion";
import { Clock, Star, Flame, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import type { Restaurant } from "@/data/restaurants";
import { StatusPill } from "./StatusPill";
import { cn } from "@/lib/utils";
import { queueStatusLabel, deliveryConfidence } from "@/utils/calculateDelayRisk";

interface RestaurantCardProps {
  restaurant: Restaurant;
  highlighted?: boolean;
  compact?: boolean;
}

const queueLabel: Record<Restaurant["queueLevel"], string> = {
  calm: "Calm",
  moderate: "Moderate",
  busy: "Busy",
  slammed: "Slammed",
};

export function RestaurantCard({ restaurant: r, highlighted, compact }: RestaurantCardProps) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
      className={cn(
        "group relative overflow-hidden rounded-3xl bg-surface p-4 shadow-soft-sm hover:shadow-soft-lg border border-border/60 transition-shadow",
        highlighted && "ring-2 ring-primary/40 shadow-soft-lg",
      )}
    >
      {highlighted && (
        <div className="absolute -top-px left-6 right-6 h-1 bg-gradient-primary rounded-b-full" />
      )}

      <div className="flex gap-4">
        <div
          className={cn(
            "shrink-0 grid place-items-center rounded-2xl bg-gradient-to-br text-3xl",
            r.imageGradient,
            compact ? "h-16 w-16" : "h-20 w-20",
          )}
        >
          <span className="drop-shadow-sm">{r.emoji}</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-extrabold text-foreground truncate">{r.name}</h3>
              <p className="text-xs text-muted-foreground truncate mt-0.5">{r.cuisine}</p>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-success text-xs font-bold tabular-nums">
              <Star className="h-3 w-3 fill-success" strokeWidth={0} />
              {r.rating}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
            <div className="flex items-center gap-1.5 text-foreground font-semibold">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="tabular-nums">{r.deliveryTime}</span> mins
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Flame className="h-3.5 w-3.5" />
              Queue: {r.delayPercent}% — {queueStatusLabel(r.delayPercent)}
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span className="tabular-nums font-semibold text-foreground">Reliability: {r.reliabilityScore}</span>
              /100
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <StatusPill level={r.delayRisk} label={`${r.delayPercent}% delay`} />
          <span className="text-[11px] font-bold text-muted-foreground tabular-nums hidden sm:inline">
            · {deliveryConfidence(r)}% confidence
          </span>
        </div>
        <button
          onClick={() =>
            toast.success("Order placed successfully", {
              description: `Estimated delivery: ${r.deliveryTime} mins from ${r.name}`,
            })
          }
          className="rounded-full bg-primary text-primary-foreground px-4 py-1.5 text-xs font-bold hover:bg-primary-hover active:scale-95 transition-all shadow-soft-sm"
        >
          Order now
        </button>
      </div>
    </motion.article>
  );
}
