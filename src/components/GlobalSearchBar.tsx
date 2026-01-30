import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Loader2 } from "lucide-react";
import { loadGoogleFont } from "@/lib/fonts";
import { useSearchFontsFromSupabase } from "@/hooks/useFontsFromSupabase";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";

export function GlobalSearchBar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  const { data: searchFonts = [], isLoading } = useSearchFontsFromSupabase(debouncedQuery);

  const results = useMemo(() => {
    if (!debouncedQuery.trim()) return { fonts: [], foundries: [], designers: [] };

    const lowerQuery = debouncedQuery.toLowerCase();
    const fonts = searchFonts.slice(0, 15);

    // Foundries: distinct foundry/foundry_slug from matched fonts
    const foundryMap = new Map<string, { name: string; slug: string }>();
    fonts.forEach((font) => {
      if (!foundryMap.has(font.foundrySlug)) {
        foundryMap.set(font.foundrySlug, { name: font.foundry, slug: font.foundrySlug });
      }
    });
    const foundries = Array.from(foundryMap.values()).slice(0, 5);

    // Designers: unique designer names that match query (from foundry names / first designer)
    const designers = foundries.map((f) => ({ name: f.name, slug: f.slug, fontCount: fonts.filter((x) => x.foundrySlug === f.slug).length }));

    fonts.forEach((f) => loadGoogleFont(f.family, [400]));

    return { fonts, foundries, designers };
  }, [debouncedQuery, searchFonts]);

  const hasResults =
    results.fonts.length > 0 || results.foundries.length > 0 || results.designers.length > 0;

  const handleSelectFont = (family: string, foundrySlug?: string) => {
    if (foundrySlug) {
      navigate(`/foundry/${foundrySlug}`);
    } else {
      const font = results.fonts.find((f) => f.family === family);
      if (font) navigate(`/foundry/${font.foundrySlug}`);
    }
    setQuery("");
  };

  const handleSelectFoundry = (slug: string) => {
    navigate(`/foundry/${slug}`);
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
          placeholder="Search all Google Fonts, foundries, designers..."
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
        />
      </div>

      {hasResults && isFocused && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-xl shadow-lg overflow-hidden z-50 animate-slide-up max-h-[60vh] overflow-y-auto">
          {(results.foundries.length > 0 || results.designers.length > 0) && (
            <>
              <div className="px-5 py-2 text-xs font-medium text-muted-foreground bg-secondary/50">
                Foundries & Designers
              </div>
              {results.foundries.map((foundry) => (
                <button
                  key={foundry.slug}
                  onClick={() => handleSelectFoundry(foundry.slug)}
                  className={cn(
                    "w-full px-5 py-3 text-left",
                    "hover:bg-secondary transition-colors duration-150",
                    "flex items-center justify-between"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex-shrink-0"
                      style={{ backgroundColor: "#FF6B35" }}
                    />
                    <div>
                      <div className="font-medium">{foundry.name}</div>
                    </div>
                  </div>
                </button>
              ))}
            </>
          )}

          {results.fonts.length > 0 && (
            <>
              <div className="px-5 py-2 text-xs font-medium text-muted-foreground bg-secondary/50">
                Fonts
              </div>
              {results.fonts.map((font) => (
                <button
                  key={font.family}
                  onClick={() => handleSelectFont(font.family, font.foundrySlug)}
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
            </>
          )}

          {isLoading && debouncedQuery && (
            <div className="px-5 py-4 text-sm text-muted-foreground text-center">
              Searching fonts...
            </div>
          )}
        </div>
      )}
    </div>
  );
}
