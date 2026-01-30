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
