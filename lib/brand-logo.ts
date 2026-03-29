import fs from "fs";
import path from "path";
import { getCars } from "./cars";
import { brandLabelFromSlug } from "./landing-brands";
import { matchSlugToCatalogBrand } from "./filter-normalize";

const EXTENSIONS = [".png", ".webp", ".svg"] as const;

export type DiscoveredBrandLogo = {
  slug: string;
  label: string;
  /** Viešas kelias, pvz. `/brand-logos/bmw.png` */
  src: string;
  /** Tikslus `car.brand` kataloge – nuorodoms `?marke=` */
  catalogBrand: string | null;
};

/**
 * Skaito `public/brand-logos/` ir grąžina tik markes, kurioms yra paveikslėlis.
 * Ignoruojami ne paveikslai (pvz. README.md).
 */
export function getDiscoveredBrandLogos(): DiscoveredBrandLogo[] {
  const dir = path.join(process.cwd(), "public", "brand-logos");
  if (!fs.existsSync(dir)) return [];

  const cars = getCars();
  const catalogBrands = [
    ...new Set(
      cars
        .filter((c) => (c as { available?: boolean }).available !== false)
        .map((c) => c.brand)
        .filter(Boolean)
    ),
  ];

  const files = fs.readdirSync(dir);
  const out: DiscoveredBrandLogo[] = [];

  for (const file of files) {
    const lower = file.toLowerCase();
    const ext = EXTENSIONS.find((e) => lower.endsWith(e));
    if (!ext) continue;

    const slug = file.slice(0, -ext.length).trim();
    if (!slug) continue;

    const slugKey = slug.toLowerCase();
    out.push({
      slug: slugKey,
      label: brandLabelFromSlug(slugKey),
      src: `/brand-logos/${file}`,
      catalogBrand: matchSlugToCatalogBrand(slugKey, catalogBrands),
    });
  }

  // Deterministinis rūšiavimas: kad serveris ir naršyklė sutaptų (vengiam localeCompare skirtumų).
  out.sort((a, b) => (a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0));
  return out;
}
