import { ListFilter, ArrowUpDown } from "lucide-react";

export type RiskFilter = "all" | "low" | "medium" | "high";
export type SortKey = "fastest" | "lowest-risk" | "highest-rating" | "nearest";

interface FilterSortBarProps {
  risk: RiskFilter;
  onRiskChange: (r: RiskFilter) => void;
  sort: SortKey;
  onSortChange: (s: SortKey) => void;
}

export function FilterSortBar({ risk, onRiskChange, sort, onSortChange }: FilterSortBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-2 rounded-full bg-surface border border-border/60 px-3 py-1.5 shadow-soft-sm">
        <ListFilter className="h-3.5 w-3.5 text-muted-foreground" />
        <select
          value={risk}
          onChange={(e) => onRiskChange(e.target.value as RiskFilter)}
          className="bg-transparent outline-none text-xs font-semibold cursor-pointer pr-1"
        >
          <option value="all">All risk</option>
          <option value="low">Low risk</option>
          <option value="medium">Medium risk</option>
          <option value="high">High risk</option>
        </select>
      </div>
      <div className="flex items-center gap-2 rounded-full bg-surface border border-border/60 px-3 py-1.5 shadow-soft-sm">
        <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortKey)}
          className="bg-transparent outline-none text-xs font-semibold cursor-pointer pr-1"
        >
          <option value="fastest">Fastest delivery</option>
          <option value="lowest-risk">Lowest delay risk</option>
          <option value="highest-rating">Highest rating</option>
          <option value="nearest">Nearest distance</option>
        </select>
      </div>
    </div>
  );
}
