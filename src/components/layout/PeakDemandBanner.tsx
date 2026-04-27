import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

interface PeakDemandBannerProps {
  avgDelay: number;
  threshold?: number;
}

export function PeakDemandBanner({ avgDelay, threshold = 60 }: PeakDemandBannerProps) {
  const visible = avgDelay > threshold;
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -8, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -8, height: 0 }}
          transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
          className="overflow-hidden"
        >
          <div className="flex items-start gap-3 rounded-2xl border border-warning/30 bg-warning/10 px-4 py-3 mb-5">
            <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-bold text-foreground">High demand detected</p>
              <p className="text-muted-foreground text-xs mt-0.5">
                Average delay risk is <span className="font-bold tabular-nums">{avgDelay}%</span> right now — expect longer delivery times.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
