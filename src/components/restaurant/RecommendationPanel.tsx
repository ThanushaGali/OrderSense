import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Inbox } from "lucide-react";
import { RestaurantCard } from "./RestaurantCard";
import type { Restaurant } from "@/data/restaurants";

interface RecommendationPanelProps {
  recommendations: Restaurant[];
  isTyping: boolean;
  searching?: boolean;
}

export function RecommendationPanel({ recommendations, isTyping, searching }: RecommendationPanelProps) {
  return (
    <aside className="flex flex-col h-full bg-surface-alt/60 rounded-3xl border border-border/60 overflow-hidden">
      <header className="px-6 py-5 border-b border-border/60 bg-surface">
        <div className="flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-full bg-secondary">
            <Sparkles className="h-3.5 w-3.5 text-primary" strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="font-extrabold text-sm tracking-tight">Smart picks</h2>
            <p className="text-[11px] text-muted-foreground">Updates as you chat</p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3">
        <AnimatePresence mode="popLayout">
          {recommendations.length === 0 && !isTyping && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full min-h-[300px] grid place-items-center text-center px-6"
            >
              <div>
                <div className="mx-auto h-12 w-12 grid place-items-center rounded-2xl bg-secondary mb-3">
                  <Inbox className="h-5 w-5 text-primary" />
                </div>
                <p className="font-bold text-sm">
                  {searching ? "No restaurants found" : "No picks yet"}
                </p>
                <p className="text-xs text-muted-foreground mt-1 max-w-[220px]">
                  {searching
                    ? "Try another search."
                    : "Ask the assistant about a craving or restaurant — recommendations slide in here."}
                </p>
              </div>
            </motion.div>
          )}

          {recommendations.map((r, i) => (
            <motion.div
              key={r.id}
              layout
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.35, delay: i * 0.06, ease: [0.25, 1, 0.5, 1] }}
            >
              <RestaurantCard restaurant={r} highlighted={i === 0} compact />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </aside>
  );
}
