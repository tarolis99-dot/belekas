import fs from "fs";
import path from "path";
import { getCanonicalModel } from "./car-aliases";

function normalizeBrand(raw: string): string {
  const b = (raw || "").trim();
  if (!b) return b;
  const lower = b.toLowerCase();
  if (lower === "skoda" || lower === "škoda") return "Škoda";
  if (lower === "mercedes" || lower === "mercedes-benz" || lower === "mercedes benz") return "Mercedes-Benz";
  if (lower === "vw") return "VOLKSWAGEN";
  return b.toUpperCase();
}

/**
 * Perskaito `public/listing-images/*` ir sukuria map'ą:
 *   key = `${brand}|${canonicalModel}`
 *   value = `/listing-images/<filename>`
 *
 * Failų pavadinimas: `marke_modelis` (pvz. `TOYOTA_Yaris_Cross.webp`).
 * - Marke: paimama iki pirmo `_`
 * - Modelis: likusi dalis (gali turėti `_`)
 *
 * Svarbu: šitas map'as naudojamas tik pagrindinio sąrašo kortelėms.
 */
const ltToAscii: Record<string, string> = { ą: "a", č: "c", ę: "e", ė: "e", į: "i", š: "s", ų: "u", ū: "u", ž: "z" };

function normalizeLoose(s: string): string {
  return (s || "")
    .trim()
    .toLowerCase()
    .replace(/[ąčęėįšųūž]/g, (ch) => ltToAscii[ch] || ch)
    .replace(/[^a-z0-9]+/g, "");
}

export type ListingImages = {
  exact: Record<string, string>;
  fuzzy: Array<{ baseNorm: string; src: string }>;
};

export function getListingImages(): ListingImages {
  const dir = path.join(process.cwd(), "public", "listing-images");
  if (!fs.existsSync(dir)) return { exact: {}, fuzzy: [] };

  const files = fs.readdirSync(dir);
  const exact: Record<string, string> = {};
  const fuzzy: Array<{ baseNorm: string; src: string }> = [];

  for (const file of files) {
    if (!/\.(png|jpe?g|webp|gif)$/i.test(file)) continue;
    const base = file.replace(/\.(png|jpe?g|webp|gif)$/i, "");
    const idx = base.indexOf("_");
    if (idx <= 0) continue;

    const brandRaw = base.slice(0, idx).replace(/-/g, " ").trim();
    const modelRaw = base.slice(idx + 1).replace(/_/g, " ").replace(/-/g, " ").trim();
    if (!brandRaw || !modelRaw) continue;

    const brand = normalizeBrand(brandRaw);
    const canonicalModel = getCanonicalModel(brand, modelRaw);
    const key = `${brand}|${canonicalModel}`;
    const src = `/listing-images/${file}`;
    exact[key] = src;

    // Fuzzy: vienas failas gali tikti kelioms variacijoms (pvz. renault_master → Master 2.3L L3H2).
    fuzzy.push({ baseNorm: normalizeLoose(`${brandRaw}_${modelRaw}`), src });
  }

  // ilgesni baseNorm laimi (konkretesnis match)
  fuzzy.sort((a, b) => b.baseNorm.length - a.baseNorm.length);
  return { exact, fuzzy };
}

export function resolveListingImageSrc(listingImages: ListingImages, brand: string, model: string): string {
  const key = `${brand}|${model}`;
  const exact = listingImages.exact[key];
  if (exact) return exact;
  const target = normalizeLoose(`${brand}_${model}`);
  const hit = listingImages.fuzzy.find((f) => f.baseNorm && target.includes(f.baseNorm));
  return hit ? hit.src : "";
}

