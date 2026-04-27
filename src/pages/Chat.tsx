import { useChatStore } from "@/store/chatStore";
import { Header } from "@/components/layout/Header";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { RecommendationPanel } from "@/components/restaurant/RecommendationPanel";
import { PeakDemandBanner } from "@/components/layout/PeakDemandBanner";
import { FilterSortBar, type RiskFilter, type SortKey } from "@/components/dashboard/FilterSortBar";
import { restaurants } from "@/data/restaurants";
import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";

export default function Chat() {
  const { recommendations, isTyping } = useChatStore();
  const [isMobile, setIsMobile] = useState(false);
  const [search, setSearch] = useState("");
  const [risk, setRisk] = useState<RiskFilter>("all");
  const [sort, setSort] = useState<SortKey>("fastest");

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const avgDelay = Math.round(
    restaurants.reduce((s, r) => s + r.delayPercent, 0) / restaurants.length,
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let arr = recommendations.filter((r) => {
      if (q && !r.name.toLowerCase().includes(q) && !r.cuisine.toLowerCase().includes(q)) return false;
      if (risk !== "all" && r.delayRisk !== risk) return false;
      return true;
    });
    switch (sort) {
      case "fastest":
        arr = [...arr].sort((a, b) => a.deliveryTime - b.deliveryTime);
        break;
      case "lowest-risk":
        arr = [...arr].sort((a, b) => a.delayPercent - b.delayPercent);
        break;
      case "highest-rating":
        arr = [...arr].sort((a, b) => b.rating - a.rating);
        break;
      case "nearest":
        arr = [...arr].sort((a, b) => a.distanceKm - b.distanceKm);
        break;
    }
    return arr;
  }, [recommendations, search, risk, sort]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container py-6">
        <PeakDemandBanner avgDelay={avgDelay} />
        <div className="grid lg:grid-cols-12 gap-5 h-[calc(100vh-7rem)]">
          <div className="lg:col-span-7 min-h-0">
            <ChatWindow showInlineRecs={isMobile} />
          </div>
          <div className="hidden lg:flex lg:flex-col lg:col-span-5 min-h-0 gap-3">
            <div className="flex items-center gap-2 rounded-full bg-surface border border-border/60 px-4 py-2 shadow-soft-sm">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search picks by name or cuisine…"
                className="flex-1 bg-transparent outline-none text-sm font-medium placeholder:text-muted-foreground"
              />
            </div>
            <FilterSortBar risk={risk} onRiskChange={setRisk} sort={sort} onSortChange={setSort} />
            <div className="flex-1 min-h-0">
              <RecommendationPanel
                recommendations={filtered}
                isTyping={isTyping}
                searching={!!search.trim() || risk !== "all"}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
