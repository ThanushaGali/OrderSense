import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import type { ChatMessage } from "@/store/chatStore";
import { cn } from "@/lib/utils";
import { RestaurantCard } from "@/components/restaurant/RestaurantCard";

interface MessageBubbleProps {
  message: ChatMessage;
  showInlineRecs?: boolean; // mobile only
}

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// minimal markdown: **bold** and line breaks
function renderContent(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) {
      return (
        <strong key={i} className="font-bold text-foreground">
          {p.slice(2, -2)}
        </strong>
      );
    }
    return (
      <span key={i}>
        {p.split("\n").map((line, j, arr) => (
          <span key={j}>
            {line}
            {j < arr.length - 1 && <br />}
          </span>
        ))}
      </span>
    );
  });
}

export function MessageBubble({ message, showInlineRecs }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
      className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}
    >
      {!isUser && (
        <div className="shrink-0 grid h-8 w-8 place-items-center rounded-full bg-gradient-primary shadow-soft-sm mt-1">
          <Sparkles className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
        </div>
      )}

      <div className={cn("flex flex-col gap-2 max-w-[85%] sm:max-w-[75%]", isUser && "items-end")}>
        <div
          className={cn(
            "rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-soft-sm",
            isUser
              ? "bg-foreground text-background rounded-br-md"
              : "bg-surface text-foreground rounded-bl-md border border-border/60",
          )}
        >
          <p className={cn(isUser ? "" : "text-muted-foreground")}>{renderContent(message.content)}</p>
        </div>

        {showInlineRecs && message.recommendations && message.recommendations.length > 0 && (
          <div className="w-full space-y-2 mt-1">
            {message.recommendations.slice(0, 2).map((r) => (
              <RestaurantCard key={r.id} restaurant={r} compact />
            ))}
          </div>
        )}

        <span className="text-[10px] text-muted-foreground font-semibold tabular-nums px-1">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </motion.div>
  );
}
