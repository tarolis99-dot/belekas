import { readFileSync, statSync } from "fs";
import path from "path";
import type { Car } from "./constants";

export type { Car } from "./constants";
export { PROVIDER_LABELS } from "./constants";

let cached: Car[] | null = null;
let cachedMtimeMs = 0;

export function getCars(): Car[] {
  const filePath = path.join(process.cwd(), "cars.json");
  const mtimeMs = statSync(filePath).mtimeMs;
  if (cached && cachedMtimeMs === mtimeMs) return cached;
  const data = readFileSync(filePath, "utf-8");
  cached = JSON.parse(data) as Car[];
  cachedMtimeMs = mtimeMs;
  return cached;
}

const idToAscii = (s: string) =>
  s.replace(/š/g, "s").replace(/ą/g, "a").replace(/č/g, "c").replace(/ę|ė/g, "e").replace(/į/g, "i").replace(/ų|ū/g, "u").replace(/ž/g, "z");

import { getCanonicalModel } from "./car-aliases";

export { getCanonicalModel } from "./car-aliases";

export function getCarById(id: string): Car | undefined {
  const cars = getCars();
  const exact = cars.find((c) => c.id === id);
  if (exact) return exact;
  const idNorm = idToAscii(id);
  return cars.find((c) => idToAscii(c.id) === idNorm);
}

export function getOffersForModel(brand: string, model: string): Car[] {
  const canonical = getCanonicalModel(brand, model);
  return getCars().filter(
    (c) => c.available !== false && c.brand === brand && getCanonicalModel(c.brand, c.model) === canonical
  );
}

