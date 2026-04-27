import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex gap-3 items-end"
    >
      <div className="shrink-0 grid h-8 w-8 place-items-center rounded-full bg-gradient-primary shadow-soft-sm">
        <Sparkles className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
      </div>
      <div className="rounded-2xl rounded-bl-md bg-surface border border-border/60 px-5 py-3 shadow-soft-sm">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="h-2 w-2 rounded-full bg-primary/70"
                animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
              />
            ))}
          </div>
          <span className="text-xs font-semibold text-muted-foreground">Analyzing demand...</span>
        </div>
      </div>
    </motion.div>
  );
}
