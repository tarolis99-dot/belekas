const ltToAscii: Record<string, string> = {
  ą: "a",
  č: "c",
  ę: "e",
  ė: "e",
  į: "i",
  š: "s",
  ų: "u",
  ū: "u",
  ž: "z",
};

/** Normalizuoja palyginimui (markė iš URL / failo vardo vs katalogo `car.brand`). */
export function normalizeLoose(s: string): string {
  return (s || "")
    .trim()
    .toLowerCase()
    .replace(/[ąčęėįšųūž]/g, (ch) => ltToAscii[ch] || ch)
    .replace(/[^a-z0-9]+/g, "");
}

/**
 * URL query `marke` / `brand` → tikslus `car.brand` iš katalogo.
 */
export function resolveMarkeToCatalogBrand(
  raw: string | null | undefined,
  catalogBrands: string[]
): string | null {
  if (raw == null || !String(raw).trim()) return null;
  const t = String(raw).trim();
  if (catalogBrands.includes(t)) return t;
  const lower = t.toLowerCase();
  for (const b of catalogBrands) {
    if (b.toLowerCase() === lower) return b;
  }
  const n = normalizeLoose(t);
  for (const b of catalogBrands) {
    if (normalizeLoose(b) === n) return b;
  }
  return null;
}

/**
 * Failo slug (pvz. `mercedes-benz`) → tikslus `car.brand`.
 */
export function matchSlugToCatalogBrand(slug: string, catalogBrands: string[]): string | null {
  const n = normalizeLoose(slug);
  for (const b of catalogBrands) {
    if (normalizeLoose(b) === n) return b;
  }
  return null;
}
