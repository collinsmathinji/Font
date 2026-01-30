import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { FontData } from "@/lib/fonts";
import { useSearchFontsFromSupabase } from "@/hooks/useFontsFromSupabase";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  onSelectFont: (font: FontData, position: "header" | "body") => void;
}

export function SearchBar({ onSelectFont }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  const { data: filteredFonts = [], isLoading } = useSearchFontsFromSupabase(debouncedQuery);
  const displayFonts = filteredFonts.slice(0, 8);

  const handleSelectFont = (font: FontData) => {
    onSelectFont(font, "header");
    setQuery("");
  };

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <div
        className={cn(
          "flex items-center gap-3 px-5 py-3 rounded-full",
          "bg-search-bg transition-all duration-200",
          isFocused && "ring-2 ring-foreground/10"
        )}
      >
        {isLoading && debouncedQuery ? (
          <Loader2 className="w-4 h-4 text-muted-foreground flex-shrink-0 animate-spin" />
        ) : (
          <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        )}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder="Search our entire free font library..."
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
        />
      </div>

      {displayFonts.length > 0 && isFocused && query.trim() && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-xl shadow-lg overflow-hidden z-50 animate-slide-up">
          {displayFonts.map((font) => (
            <button
              key={font.family}
              onClick={() => handleSelectFont(font)}
              className={cn(
                "w-full px-5 py-3 text-left",
                "hover:bg-secondary transition-colors duration-150",
                "flex items-center justify-between"
              )}
            >
              <div>
                <div
                  className="font-medium"
                  style={{ fontFamily: `"${font.family}", ${font.category}` }}
                >
                  {font.family}
                </div>
                <div className="text-xs text-muted-foreground">{font.foundry}</div>
              </div>
              <span className="text-xs text-muted-foreground capitalize">
                {font.category}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
