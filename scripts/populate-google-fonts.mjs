#!/usr/bin/env node
/**
 * Fetches the full Google Fonts catalog from the public metadata API
 * and upserts into the Supabase `fonts` table.
 *
 * Requires: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (env or .env)
 * Run: node scripts/populate-google-fonts.mjs
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const GOOGLE_FONTS_METADATA_URL = 'https://fonts.google.com/metadata/fonts';

function loadEnv() {
  try {
    const envPath = resolve(__dirname, '..', '.env');
    const content = readFileSync(envPath, 'utf8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const eq = trimmed.indexOf('=');
        if (eq > 0) {
          const key = trimmed.slice(0, eq).trim();
          const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
          if (!process.env[key]) process.env[key] = value;
        }
      }
    }
  } catch (_) {
    // .env optional
  }
}

loadEnv();

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing SUPABASE_URL and/or SUPABASE_SERVICE_ROLE_KEY.');
  console.error('Set them in .env or environment. Get the service role key from Supabase Dashboard → Settings → API.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

const categoryMap = {
  'Sans Serif': 'sans-serif',
  'Serif': 'serif',
  'Display': 'display',
  'Handwriting': 'handwriting',
  'Monospace': 'monospace',
};

function slugify(str) {
  return String(str)
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

async function fetchGoogleFonts() {
  const res = await fetch(GOOGLE_FONTS_METADATA_URL, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; FontJoyStudio/1.0)' },
  });
  if (!res.ok) throw new Error(`Google Fonts API error: ${res.status}`);
  let text = await res.text();
  text = text.replace(/^\)\]\}'/, '');
  const data = JSON.parse(text);
  return data.familyMetadataList || [];
}

function transformFont(apiFont) {
  const weights = Object.keys(apiFont.fonts || {})
    .filter((k) => !k.includes('i'))
    .map((k) => parseInt(k, 10))
    .filter((w) => !Number.isNaN(w));
  const sortedWeights = weights.length ? [...new Set(weights)].sort((a, b) => a - b) : [400];
  const designer = (apiFont.designers && apiFont.designers[0]) || 'Google Fonts';
  const foundrySlug = slugify(designer);
  const category =
    categoryMap[apiFont.category] ||
    apiFont.category?.toLowerCase().replace(/\s/g, '-') ||
    'sans-serif';
  const legibility =
    apiFont.category === 'Display' || apiFont.category === 'Handwriting' ? 'medium' : 'high';

  return {
    family: apiFont.family,
    category,
    weights: sortedWeights,
    foundry: designer,
    foundry_slug: foundrySlug,
    designers: apiFont.designers || [designer],
    legibility,
    popularity: Number(apiFont.popularity) || 0,
    trending: Number(apiFont.trending) || 0,
    date_added: apiFont.dateAdded || null,
    last_modified: apiFont.lastModified || null,
    classifications: apiFont.classifications || [],
    updated_at: new Date().toISOString(),
  };
}

async function main() {
  console.log('Fetching Google Fonts metadata...');
  const list = await fetchGoogleFonts();
  console.log(`Received ${list.length} fonts. Transforming...`);

  const rows = list.map(transformFont);

  console.log('Upserting into Supabase (fonts table)...');
  const BATCH = 100;
  for (let i = 0; i < rows.length; i += BATCH) {
    const chunk = rows.slice(i, i + BATCH);
    const { error } = await supabase.from('fonts').upsert(chunk, {
      onConflict: 'family',
      ignoreDuplicates: false,
    });
    if (error) {
      console.error('Upsert error:', error);
      throw error;
    }
    console.log(`  ${Math.min(i + BATCH, rows.length)} / ${rows.length}`);
  }

  console.log('Done. Fonts table is up to date.');

  // Seed popular_pairings if we have the font families (optional)
  const popularPairs = [
    ['Playfair Display', 'Raleway'],
    ['Montserrat', 'Lora'],
    ['DM Serif Display', 'Space Grotesk'],
    ['Oswald', 'Open Sans'],
    ['Cormorant Garamond', 'Work Sans'],
    ['Crimson Text', 'Nunito'],
    ['Libre Baskerville', 'Source Sans Pro'],
    ['Arvo', 'PT Sans'],
    ['Merriweather', 'Roboto'],
    ['Poppins', 'Lora'],
    ['Inter', 'EB Garamond'],
    ['Bebas Neue', 'Open Sans'],
    ['Abril Fatface', 'Poppins'],
    ['DM Sans', 'DM Serif Display'],
    ['Plus Jakarta Sans', 'Libre Baskerville'],
  ];

  const families = new Set(rows.map((r) => r.family));
  const validPairs = popularPairs.filter(
    ([h, b]) => families.has(h) && families.has(b)
  );
  if (validPairs.length === 0) {
    console.log('Skipping popular_pairings seed (no matching families in DB yet).');
    return;
  }

  const pairingRows = validPairs.map(([header_family, body_family], idx) => ({
    header_family,
    body_family,
    sort_order: idx,
  }));

  const { error: pairError } = await supabase
    .from('popular_pairings')
    .upsert(pairingRows, { onConflict: 'header_family,body_family', ignoreDuplicates: true });
  if (pairError) {
    console.warn('popular_pairings seed warning:', pairError.message);
  } else {
    console.log(`Seeded ${pairingRows.length} popular pairings.`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
