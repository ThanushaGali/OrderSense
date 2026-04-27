import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence } from "framer-motion";
import { ArrowUp, RotateCcw } from "lucide-react";
import { useChatStore } from "@/store/chatStore";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { cn } from "@/lib/utils";

const QUICK_PROMPTS = [
  "Fastest pizza nearby",
  "Is Spice Hub busy right now?",
  "Something healthy under 30 mins",
];

interface ChatWindowProps {
  showInlineRecs?: boolean;
}

export function ChatWindow({ showInlineRecs }: ChatWindowProps) {
  const { messages, isTyping, sendMessage, reset } = useChatStore();
  const [input, setInput] = useState("");
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  const submit = async (text?: string) => {
    const value = (text ?? input).trim();
    if (!value || isTyping) return;
    setInput("");
    await sendMessage(value);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    submit();
  };

  return (
    <section className="flex flex-col h-full bg-surface rounded-3xl border border-border/60 shadow-soft-md overflow-hidden">
      <header className="px-6 py-4 border-b border-border/60 flex items-center justify-between">
        <div>
          <h2 className="font-extrabold tracking-tight">OrderSense Assistant</h2>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-75 animate-pulse-ring" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            Live · Predicting demand
          </p>
        </div>
        <button
          onClick={reset}
          className="text-xs font-semibold text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-muted transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
      </header>

      <div ref={scrollerRef} className="flex-1 overflow-y-auto scrollbar-thin px-4 sm:px-6 py-6 space-y-5">
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} showInlineRecs={showInlineRecs} />
        ))}
        <AnimatePresence>{isTyping && <TypingIndicator key="typing" />}</AnimatePresence>
      </div>

      {messages.length <= 2 && (
        <div className="px-4 sm:px-6 pb-3 flex flex-wrap gap-2">
          {QUICK_PROMPTS.map((p) => (
            <button
              key={p}
              onClick={() => submit(p)}
              className="text-xs font-semibold rounded-full border border-border bg-surface px-3 py-1.5 text-muted-foreground hover:border-primary/40 hover:text-foreground hover:bg-secondary transition-colors"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={onSubmit} className="p-4 border-t border-border/60 bg-surface">
        <div
          className={cn(
            "flex items-center gap-2 rounded-full bg-surface-alt border border-transparent pl-5 pr-1.5 py-1.5 transition-all",
            "focus-within:border-primary/40 focus-within:bg-surface focus-within:shadow-soft-md",
          )}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What are you craving?"
            className="flex-1 bg-transparent outline-none text-sm font-medium placeholder:text-muted-foreground py-2"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all shadow-soft-sm"
            aria-label="Send"
          >
            <ArrowUp className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </div>
      </form>
    </section>
  );
}
