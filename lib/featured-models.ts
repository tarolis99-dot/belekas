import type { Car } from "./constants";
import { getCanonicalModel } from "./car-aliases";
import { resolveListingImageSrc, type ListingImages } from "./listing-images";

export type FeaturedModel = {
  representative: Car;
  brand: string;
  model: string;
  minPrice: number;
  offerCount: number;
  imgSrc: string;
};

function resolveCarImage(car: Car, listingImages: ListingImages, canonicalModel: string): string {
  const local = resolveListingImageSrc(listingImages, car.brand, canonicalModel);
  if (local) return local;
  const remote = car.listing_img_url || car.img_url;
  if (!remote) return "";
  return remote.startsWith("http") ? remote : `/${remote.replace(/^\//, "")}`;
}

/**
 * Grupuoja pagal markę + kanoninį modelį ir parenka populiariausius (daugiausia pasiūlymų),
 * pirmenybė — su nuotrauka.
 */
export function getFeaturedModels(
  cars: Car[],
  listingImages: ListingImages,
  limit = 4
): FeaturedModel[] {
  const available = cars.filter((c) => (c as { available?: boolean }).available !== false);
  const map = new Map<string, Car[]>();
  for (const car of available) {
    const key = `${car.brand}|${getCanonicalModel(car.brand, car.model)}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(car);
  }

  const rows: FeaturedModel[] = Array.from(map.values()).map((group) => {
    const minPrice = Math.min(...group.map((c) => c.monthly_price));
    const representative = group.find((c) => c.monthly_price === minPrice) || group[0];
    const model = getCanonicalModel(representative.brand, representative.model);
    return {
      representative,
      brand: representative.brand,
      model,
      minPrice,
      offerCount: group.length,
      imgSrc: resolveCarImage(representative, listingImages, model),
    };
  });

  rows.sort((a, b) => {
    const hasA = a.imgSrc ? 1 : 0;
    const hasB = b.imgSrc ? 1 : 0;
    if (hasB !== hasA) return hasB - hasA;
    if (b.offerCount !== a.offerCount) return b.offerCount - a.offerCount;
    return a.minPrice - b.minPrice;
  });

  return rows.slice(0, limit);
}
