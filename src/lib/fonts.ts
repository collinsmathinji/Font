export interface FontData {
  family: string;
  category: "sans-serif" | "serif" | "display" | "handwriting" | "monospace";
  weights: number[];
  foundry: string;
  foundrySlug: string;
  legibility: "high" | "medium" | "low";
  /** From DB; used for sorting on Foundry page */
  popularity?: number;
}

export interface FoundryData {
  name: string;
  slug: string;
  handle?: string;
  bio?: string;
  website?: string;
  instagram?: string;
  isFoundry?: boolean;
}

/** Fallback popular pairings (family names) when DB has none */
export const POPULAR_PAIRINGS_FALLBACK: [string, string][] = [
  ["Playfair Display", "Raleway"],
  ["Montserrat", "Lora"],
  ["DM Serif Display", "Space Grotesk"],
  ["Oswald", "Open Sans"],
  ["Cormorant Garamond", "Work Sans"],
  ["Crimson Text", "Nunito"],
  ["Libre Baskerville", "Source Sans Pro"],
  ["Arvo", "PT Sans"],
  ["Merriweather", "Roboto"],
  ["Poppins", "Lora"],
  ["Inter", "EB Garamond"],
  ["Bebas Neue", "Open Sans"],
  ["Abril Fatface", "Poppins"],
  ["DM Sans", "DM Serif Display"],
  ["Plus Jakarta Sans", "Libre Baskerville"],
];

/** Fallback font list when Supabase is not configured (e.g. deployed without env vars) */
export const FALLBACK_FONTS: FontData[] = [
  { family: "Playfair Display", category: "serif", weights: [400, 500, 600, 700, 800, 900], foundry: "Claus Eggers Sørensen", foundrySlug: "claus-eggers-sorensen", legibility: "medium" },
  { family: "Raleway", category: "sans-serif", weights: [100, 200, 300, 400, 500, 600, 700, 800, 900], foundry: "The League of Moveable Type", foundrySlug: "the-league-of-moveable-type", legibility: "high" },
  { family: "Montserrat", category: "sans-serif", weights: [100, 200, 300, 400, 500, 600, 700, 800, 900], foundry: "Julieta Ulanovsky", foundrySlug: "julieta-ulanovsky", legibility: "high" },
  { family: "Lora", category: "serif", weights: [400, 500, 600, 700], foundry: "Cyreal", foundrySlug: "cyreal", legibility: "high" },
  { family: "DM Serif Display", category: "serif", weights: [400], foundry: "Colophon Foundry", foundrySlug: "colophon-foundry", legibility: "medium" },
  { family: "Space Grotesk", category: "sans-serif", weights: [300, 400, 500, 600, 700], foundry: "Florian Karsten", foundrySlug: "florian-karsten", legibility: "high" },
  { family: "Oswald", category: "sans-serif", weights: [200, 300, 400, 500, 600, 700], foundry: "Vernon Adams", foundrySlug: "vernon-adams", legibility: "medium" },
  { family: "Open Sans", category: "sans-serif", weights: [300, 400, 500, 600, 700, 800], foundry: "Steve Matteson", foundrySlug: "steve-matteson", legibility: "high" },
  { family: "Cormorant Garamond", category: "serif", weights: [300, 400, 500, 600, 700], foundry: "Christian Thalmann", foundrySlug: "christian-thalmann", legibility: "high" },
  { family: "Work Sans", category: "sans-serif", weights: [100, 200, 300, 400, 500, 600, 700, 800, 900], foundry: "Wei Huang", foundrySlug: "wei-huang", legibility: "high" },
  { family: "Crimson Text", category: "serif", weights: [400, 600, 700], foundry: "Sebastian Kosch", foundrySlug: "sebastian-kosch", legibility: "high" },
  { family: "Nunito", category: "sans-serif", weights: [200, 300, 400, 500, 600, 700, 800, 900], foundry: "Vernon Adams", foundrySlug: "vernon-adams", legibility: "high" },
  { family: "Libre Baskerville", category: "serif", weights: [400, 700], foundry: "Impallari Type", foundrySlug: "impallari-type", legibility: "high" },
  { family: "Source Sans Pro", category: "sans-serif", weights: [200, 300, 400, 600, 700, 900], foundry: "Paul D. Hunt", foundrySlug: "paul-d-hunt", legibility: "high" },
  { family: "Arvo", category: "serif", weights: [400, 700], foundry: "Anton Koovit", foundrySlug: "anton-koovit", legibility: "high" },
  { family: "PT Sans", category: "sans-serif", weights: [400, 700], foundry: "ParaType", foundrySlug: "paratype", legibility: "high" },
  { family: "Merriweather", category: "serif", weights: [300, 400, 700, 900], foundry: "Sorkin Type", foundrySlug: "sorkin-type", legibility: "high" },
  { family: "Roboto", category: "sans-serif", weights: [100, 300, 400, 500, 700, 900], foundry: "Christian Robertson", foundrySlug: "christian-robertson", legibility: "high" },
  { family: "Poppins", category: "sans-serif", weights: [100, 200, 300, 400, 500, 600, 700, 800, 900], foundry: "Indian Type Foundry", foundrySlug: "indian-type-foundry", legibility: "high" },
  { family: "Inter", category: "sans-serif", weights: [100, 200, 300, 400, 500, 600, 700, 800, 900], foundry: "Rasmus Andersson", foundrySlug: "rasmus-andersson", legibility: "high" },
  { family: "EB Garamond", category: "serif", weights: [400, 500, 600, 700, 800], foundry: "Georg Duffner", foundrySlug: "georg-duffner", legibility: "high" },
  { family: "Bebas Neue", category: "display", weights: [400], foundry: "Ryoichi Tsunekawa", foundrySlug: "ryoichi-tsunekawa", legibility: "medium" },
  { family: "Abril Fatface", category: "display", weights: [400], foundry: "TypeTogether", foundrySlug: "typetogether", legibility: "low" },
  { family: "DM Sans", category: "sans-serif", weights: [100, 200, 300, 400, 500, 600, 700, 800, 900], foundry: "Colophon Foundry", foundrySlug: "colophon-foundry", legibility: "high" },
  { family: "Plus Jakarta Sans", category: "sans-serif", weights: [200, 300, 400, 500, 600, 700, 800], foundry: "Tokotype", foundrySlug: "tokotype", legibility: "high" },
];

export function getFontByFamily(fonts: FontData[], family: string): FontData | undefined {
  return fonts.find((f) => f.family === family);
}

/** Case-insensitive lookup for popular pairings (handles API/DB naming differences) */
export function getFontByFamilyRelaxed(fonts: FontData[], family: string): FontData | undefined {
  if (!family || fonts.length === 0) return undefined;
  const exact = fonts.find((f) => f.family === family);
  if (exact) return exact;
  const lower = family.toLowerCase().trim();
  return fonts.find((f) => f.family.toLowerCase().trim() === lower);
}

export function getFontsByFoundry(fonts: FontData[], foundrySlug: string): FontData[] {
  return fonts.filter((f) => f.foundrySlug === foundrySlug);
}

function calculatePairingScore(font1: FontData, font2: FontData): number {
  let score = 50;

  if (
    (font1.category === "serif" && font2.category === "sans-serif") ||
    (font1.category === "sans-serif" && font2.category === "serif")
  ) {
    score += 30;
  }

  if (font1.category === font2.category && font1.family !== font2.family) {
    score += 10;
  }

  if (font1.family === font2.family) {
    score -= 100;
  }

  if (font2.legibility === "high") {
    score += 15;
  }

  if (font2.legibility === "low") {
    score -= 20;
  }

  return score;
}

export function getComplementaryFont(
  fonts: FontData[],
  lockedFont: FontData,
  position: "header" | "body"
): FontData {
  const candidates = fonts.filter((f) => f.family !== lockedFont.family);

  const scored = candidates.map((font) => ({
    font,
    score:
      position === "body"
        ? calculatePairingScore(lockedFont, font)
        : calculatePairingScore(font, lockedFont),
  }));

  scored.sort((a, b) => b.score - a.score);

  const topCandidates = scored.slice(0, 5);
  const randomIndex = Math.floor(Math.random() * Math.max(1, topCandidates.length));
  return topCandidates[randomIndex]?.font ?? candidates[0] ?? lockedFont;
}

export function getRandomPair(fonts: FontData[]): [FontData, FontData] {
  if (fonts.length === 0) {
    const fallback: FontData = {
      family: "Roboto",
      category: "sans-serif",
      weights: [400, 700],
      foundry: "Google",
      foundrySlug: "google",
      legibility: "high",
    };
    return [fallback, fallback];
  }
  const headerFont = fonts[Math.floor(Math.random() * fonts.length)];
  const bodyFont = getComplementaryFont(fonts, headerFont, "body");
  return [headerFont, bodyFont];
}

export function loadGoogleFont(family: string, weights?: number[]): void {
  const encodedFamily = encodeURIComponent(family);
  const linkId = `font-${encodedFamily}`;

  if (document.getElementById(linkId)) return;

  const weightString =
    weights?.length ? weights.join(";") : "100;200;300;400;500;600;700;800;900";

  const link = document.createElement("link");
  link.id = linkId;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${encodedFamily}:wght@${weightString}&display=swap`;
  document.head.appendChild(link);
}

/** Preload a set of fonts (e.g. first N from list for faster pairing) */
export function preloadFonts(fonts: FontData[], limit = 20): void {
  fonts.slice(0, limit).forEach((font) => loadGoogleFont(font.family, font.weights));
}

export function getGoogleFontDownloadUrl(family: string): string {
  return `https://fonts.google.com/specimen/${encodeURIComponent(family)}`;
}
