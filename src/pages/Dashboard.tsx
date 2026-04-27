import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Store,
  Activity,
  AlertTriangle,
  Flame,
  TrendingUp,
  TrendingDown,
  Minus,
  Search,
  Rocket,
  Inbox,
  Clock3,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RestaurantCard } from "@/components/restaurant/RestaurantCard";
import { StatusPill } from "@/components/restaurant/StatusPill";
import { PeakDemandBanner } from "@/components/layout/PeakDemandBanner";
import { FilterSortBar, type RiskFilter, type SortKey } from "@/components/dashboard/FilterSortBar";
import { restaurants as seedRestaurants, type Restaurant } from "@/data/restaurants";
import { queueStatusLabel, bestTimeToOrder } from "@/utils/calculateDelayRisk";

type Trend = "up" | "down" | "flat";

function jitter(r: Restaurant): Restaurant {
  // Small random walk on delayPercent (+/- 6), clamped 4-95
  const drift = Math.round((Math.random() - 0.5) * 12);
  const next = Math.max(4, Math.min(95, r.delayPercent + drift));
  const delayRisk: Restaurant["delayRisk"] = next >= 60 ? "high" : next >= 30 ? "medium" : "low";
  return { ...r, delayPercent: next, delayRisk };
}

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [risk, setRisk] = useState<RiskFilter>("all");
  const [sort, setSort] = useState<SortKey>("fastest");
  const [live, setLive] = useState<Restaurant[]>(seedRestaurants);
  const prevDelays = useRef<Record<string, number>>(
    Object.fromEntries(seedRestaurants.map((r) => [r.id, r.delayPercent])),
  );
  const [trends, setTrends] = useState<Record<string, Trend>>({});

  // Auto-refresh every 5s — feels live
  useEffect(() => {
    const id = setInterval(() => {
      setLive((curr) => {
        const next = curr.map(jitter);
        const t: Record<string, Trend> = {};
        next.forEach((r) => {
          const prev = prevDelays.current[r.id] ?? r.delayPercent;
          t[r.id] = r.delayPercent > prev + 1 ? "up" : r.delayPercent < prev - 1 ? "down" : "flat";
          prevDelays.current[r.id] = r.delayPercent;
        });
        setTrends(t);
        return next;
      });
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const totalRestaurants = live.length;
  const activeOrders = live.reduce((sum, r) => sum + r.orderVolume, 0);
  const avgDelay = Math.round(live.reduce((sum, r) => sum + r.delayPercent, 0) / live.length);
  const slammed = live.filter((r) => r.delayPercent >= 60).length;
  const peakLevel = avgDelay > 50 ? "Peak" : avgDelay > 30 ? "Elevated" : "Calm";
  const fastestOverall = [...live].sort((a, b) => a.deliveryTime - b.deliveryTime)[0];
  const best = useMemo(() => bestTimeToOrder(), []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return live.filter((r) => {
      if (q && !r.name.toLowerCase().includes(q) && !r.cuisine.toLowerCase().includes(q)) return false;
      if (risk !== "all" && r.delayRisk !== risk) return false;
      return true;
    });
  }, [live, search, risk]);

  const sortedByLoad = useMemo(() => {
    const arr = [...filtered];
    switch (sort) {
      case "fastest":
        return arr.sort((a, b) => a.deliveryTime - b.deliveryTime);
      case "lowest-risk":
        return arr.sort((a, b) => a.delayPercent - b.delayPercent);
      case "highest-rating":
        return arr.sort((a, b) => b.rating - a.rating);
      case "nearest":
        return arr.sort((a, b) => a.distanceKm - b.distanceKm);
    }
  }, [filtered, sort]);

  const fastest = useMemo(
    () => [...filtered].sort((a, b) => a.deliveryTime - b.deliveryTime).slice(0, 3),
    [filtered],
  );

  const TrendIcon = ({ id }: { id: string }) => {
    const t = trends[id];
    if (t === "up") return <TrendingUp className="h-3 w-3 text-destructive" />;
    if (t === "down") return <TrendingDown className="h-3 w-3 text-success" />;
    return <Minus className="h-3 w-3 text-muted-foreground" />;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-10">
        <PeakDemandBanner avgDelay={avgDelay} />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8"
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Live demand</span>
            <h1 className="mt-1 text-3xl md:text-4xl font-extrabold tracking-tight">City pulse</h1>
            <p className="mt-1 text-muted-foreground">A real-time read on every monitored kitchen.</p>
          </div>
          <div className="rounded-full bg-surface border border-border/60 px-4 py-2 text-xs font-semibold flex items-center gap-2 shadow-soft-sm self-start sm:self-end">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-75 animate-pulse-ring" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            Auto-refreshing every 5s
          </div>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard label="Restaurants tracked" value={totalRestaurants} icon={Store} index={0} />
          <StatsCard label="Active orders" value={activeOrders} delta="+12% vs avg" icon={Activity} tone="default" index={1} />
          <StatsCard
            label="Avg delay risk"
            value={`${avgDelay}%`}
            icon={AlertTriangle}
            tone={avgDelay > 50 ? "danger" : avgDelay > 30 ? "warning" : "success"}
            index={2}
          />
          <StatsCard
            label="Demand level"
            value={peakLevel}
            delta={`${slammed} kitchens busy`}
            icon={Flame}
            tone={peakLevel === "Peak" ? "danger" : peakLevel === "Elevated" ? "warning" : "success"}
            index={3}
          />
          <StatsCard
            label="Fastest restaurant"
            value={fastestOverall.name}
            delta={`${fastestOverall.deliveryTime} mins`}
            icon={Rocket}
            tone="success"
            index={4}
          />
          <StatsCard
            label="Best time to order"
            value={best.label}
            delta={best.inMinutes === 0 ? "Right now — Low risk" : `${best.risk} delay risk`}
            icon={Clock3}
            tone="success"
            index={5}
          />
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3 justify-between">
          <div className="flex items-center gap-2 rounded-full bg-surface border border-border/60 px-4 py-2 shadow-soft-sm flex-1 min-w-[240px] max-w-md">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search restaurants by name or cuisine…"
              className="flex-1 bg-transparent outline-none text-sm font-medium placeholder:text-muted-foreground"
            />
          </div>
          <FilterSortBar risk={risk} onRiskChange={setRisk} sort={sort} onSortChange={setSort} />
        </div>

        <div className="mt-6 grid lg:grid-cols-3 gap-6">
          {/* Load table */}
          <section className="lg:col-span-2 rounded-3xl bg-surface border border-border/60 p-6 shadow-soft-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-extrabold tracking-tight">Kitchen load</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Live · updates every 5 seconds</p>
              </div>
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>

            {sortedByLoad.length === 0 ? (
              <div className="grid place-items-center text-center py-12">
                <div className="mx-auto h-12 w-12 grid place-items-center rounded-2xl bg-secondary mb-3">
                  <Inbox className="h-5 w-5 text-primary" />
                </div>
                <p className="font-bold text-sm">No restaurants found</p>
                <p className="text-xs text-muted-foreground mt-1">Try another search or filter</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sortedByLoad.map((r, i) => (
                  <motion.div
                    key={r.id}
                    layout
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.04 }}
                    className="flex items-center gap-4 rounded-2xl bg-surface-alt/60 p-3 hover:bg-surface-alt transition-colors"
                  >
                    <div className={`shrink-0 grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${r.imageGradient} text-2xl`}>
                      {r.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-bold truncate flex items-center gap-1.5">
                          {r.name}
                          <TrendIcon id={r.id} />
                        </div>
                        <StatusPill level={r.delayRisk} label={`${r.delayPercent}%`} />
                      </div>
                      <div className="mt-2 h-1.5 rounded-full bg-border/70 overflow-hidden">
                        <motion.div
                          animate={{ width: `${r.delayPercent}%` }}
                          transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
                          className={
                            r.delayRisk === "high"
                              ? "h-full bg-destructive"
                              : r.delayRisk === "medium"
                                ? "h-full bg-warning"
                                : "h-full bg-success"
                          }
                        />
                      </div>
                      <div className="mt-1.5 flex items-center justify-between text-[11px] text-muted-foreground font-semibold">
                        <span>
                          Queue: {r.delayPercent}% — {queueStatusLabel(r.delayPercent)} · Reliability {r.reliabilityScore}/100
                        </span>
                        <span className="tabular-nums">{r.deliveryTime} min ETA</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </section>

          {/* Fastest right now */}
          <section>
            <div className="flex items-center justify-between mb-5 px-1">
              <h2 className="text-xl font-extrabold tracking-tight">Fastest now</h2>
              <span className="text-xs font-bold uppercase tracking-wider text-success">Live</span>
            </div>
            {fastest.length === 0 ? (
              <div className="rounded-3xl bg-surface border border-border/60 p-6 text-center shadow-soft-sm">
                <p className="font-bold text-sm">No restaurants found</p>
                <p className="text-xs text-muted-foreground mt-1">Try another search or filter</p>
              </div>
            ) : (
              <div className="space-y-3">
                {fastest.map((r, i) => (
                  <RestaurantCard key={r.id} restaurant={r} compact highlighted={i === 0} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
