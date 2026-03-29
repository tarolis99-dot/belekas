/**
 * Rodomieji pavadinimai pagal failo vardą be plėtinio (slug).
 * Jei slug čia nėra – naudojamas automatinis formatavimas (pvz. `ford` → Ford).
 */
const BRAND_LABEL_BY_SLUG: Record<string, string> = {
  audi: "Audi",
  bmw: "BMW",
  "mercedes-benz": "Mercedes-Benz",
  toyota: "Toyota",
  volkswagen: "Volkswagen",
  tesla: "Tesla",
  skoda: "Škoda",
  cupra: "Cupra",
  kia: "Kia",
  hyundai: "Hyundai",
  nissan: "Nissan",
  ford: "Ford",
  citroen: "Citroën",
  dacia: "Dacia",
  jeep: "Jeep",
  mg: "MG",
  renault: "Renault",
  rivian: "Rivian",
  seat: "SEAT",
};

export function brandLabelFromSlug(slug: string): string {
  const key = slug.toLowerCase();
  if (BRAND_LABEL_BY_SLUG[key]) return BRAND_LABEL_BY_SLUG[key];
  return key
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join("-");
}
