import { MapPin, ChevronDown } from "lucide-react";
import { useLocationStore, LOCATIONS } from "@/store/locationStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LocationPicker() {
  const { city, setCity } = useLocationStore();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1.5 rounded-full bg-surface border border-border/60 px-3 py-1.5 text-xs font-semibold hover:border-primary/40 transition-colors shadow-soft-sm">
        <MapPin className="h-3.5 w-3.5 text-primary" />
        <span>Delivering to <span className="font-bold text-foreground">{city}</span></span>
        <ChevronDown className="h-3 w-3 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-2xl">
        {LOCATIONS.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => setCity(loc)}
            className="rounded-lg cursor-pointer"
          >
            <MapPin className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
            {loc}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
