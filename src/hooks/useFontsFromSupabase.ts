import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { FontData } from "@/lib/fonts";

/** Map DB row (snake_case) to app FontData */
export function rowToFontData(row: {
  family: string;
  category: string;
  weights: number[];
  foundry: string;
  foundry_slug: string;
  designers?: string[] | null;
  legibility: string;
  popularity?: number;
  trending?: number;
}): FontData {
  return {
    family: row.family,
    category: row.category as FontData["category"],
    weights: row.weights || [400],
    foundry: row.foundry,
    foundrySlug: row.foundry_slug,
    legibility: (row.legibility || "high") as FontData["legibility"],
    popularity: row.popularity,
  };
}

/** Fetch all fonts from Supabase (for pairing tool). Cached 1h. */
export function useAllFontsFromSupabase() {
  return useQuery({
    queryKey: ["fonts", "all"],
    queryFn: async (): Promise<FontData[]> => {
      const { data, error } = await supabase
        .from("fonts")
        .select("family, category, weights, foundry, foundry_slug, designers, legibility, popularity")
        .order("popularity", { ascending: false });

      if (error) {
        console.error("Error fetching fonts:", error);
        return [];
      }
      return (data || []).map(rowToFontData);
    },
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
  });
}

/** Fetch popular pairings (header_family, body_family) from Supabase */
export function usePopularPairingsFromSupabase() {
  return useQuery({
    queryKey: ["popular-pairings"],
    queryFn: async (): Promise<[string, string][]> => {
      const { data, error } = await supabase
        .from("popular_pairings")
        .select("header_family, body_family")
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("Error fetching popular pairings:", error);
        return [];
      }
      return (data || []).map((r) => [r.header_family, r.body_family] as [string, string]);
    },
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
  });
}

interface UseFontsFromSupabaseOptions {
  search?: string;
  category?: string;
  sort?: "alpha" | "popularity" | "date" | "trending";
  limit?: number;
  enabled?: boolean;
}

/** Search/filter fonts from Supabase (for global search, etc.) */
export function useFontsFromSupabase(options: UseFontsFromSupabaseOptions = {}) {
  const {
    search = "",
    category = "",
    sort = "popularity",
    limit = 0,
    enabled = true,
  } = options;

  return useQuery({
    queryKey: ["fonts", "list", search, category, sort, limit],
    queryFn: async (): Promise<FontData[]> => {
      let q = supabase
        .from("fonts")
        .select("family, category, weights, foundry, foundry_slug, designers, legibility, popularity");

      if (search.trim()) {
        const term = search.trim();
        q = q.or(`family.ilike.%${term}%,foundry.ilike.%${term}%`);
      }
      if (category && category !== "all") {
        q = q.eq("category", category);
      }
      if (sort === "alpha") {
        q = q.order("family", { ascending: true });
      } else if (sort === "trending") {
        q = q.order("trending", { ascending: false });
      } else {
        q = q.order("popularity", { ascending: false });
      }
      if (limit > 0) {
        q = q.limit(limit);
      }

      const { data, error } = await q;
      if (error) {
        console.error("Error fetching fonts:", error);
        return [];
      }
      return (data || []).map(rowToFontData);
    },
    enabled,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
  });
}

/** Search fonts by query (for GlobalSearchBar) */
export function useSearchFontsFromSupabase(searchQuery: string) {
  return useFontsFromSupabase({
    search: searchQuery,
    limit: 50,
    enabled: searchQuery.trim().length > 0,
  });
}

/** Fonts by designer/foundry slug (for Foundry page) */
export function useFontsByDesignerFromSupabase(designerSlug: string) {
  const { data: fonts, isLoading, error } = useQuery({
    queryKey: ["fonts", "foundry", designerSlug],
    queryFn: async (): Promise<FontData[]> => {
      if (!designerSlug) return [];
      const { data, error: err } = await supabase
        .from("fonts")
        .select("family, category, weights, foundry, foundry_slug, designers, legibility, popularity")
        .eq("foundry_slug", designerSlug)
        .order("popularity", { ascending: false });

      if (err) {
        console.error("Error fetching fonts by designer:", err);
        return [];
      }
      return (data || []).map(rowToFontData);
    },
    enabled: designerSlug.length > 0,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
  });

  const designerName = useMemo(() => {
    if (!fonts || fonts.length === 0) return null;
    return fonts[0].foundry;
  }, [fonts]);

  return { fonts: fonts || [], designerName, isLoading, error };
}
