import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LocationPicker } from "./LocationPicker";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Home" },
  { to: "/chat", label: "Chat" },
  { to: "/dashboard", label: "Dashboard" },
];

export function Header() {
  const { pathname } = useLocation();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
      className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-md"
    >
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="grid h-9 w-9 place-items-center rounded-2xl bg-gradient-primary shadow-soft-md group-hover:shadow-glow transition-shadow duration-300">
            <Sparkles className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <div className="leading-tight">
            <div className="font-extrabold tracking-tight text-foreground">OrderSense</div>
            <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary -mt-0.5">AI</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => {
            const active = pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  "relative px-4 py-2 rounded-full text-sm font-semibold transition-colors",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-secondary"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative">{l.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {pathname !== "/" && <LocationPicker />}
          {pathname === "/" && (
            <Button variant="ghost" className="rounded-full hidden sm:inline-flex font-semibold">
              Log in
            </Button>
          )}
          <Button asChild className="rounded-full bg-primary hover:bg-primary-hover shadow-soft-md font-semibold">
            <Link to="/chat">Try OrderSense</Link>
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
