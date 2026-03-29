"use client";

import { useMemo, useState, useCallback, useEffect, useRef, type ReactNode } from "react";
import Link from "next/link";
import type { Car } from "@/lib/constants";
import { PROVIDER_LABELS } from "@/lib/constants";
import { getCanonicalModel } from "@/lib/car-aliases";
import type { ListingImages } from "@/lib/listing-images";
import { normalizeLoose, resolveMarkeToCatalogBrand } from "@/lib/filter-normalize";

const CHEVRON = (
  <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

function FilterAccordionSection({
  title,
  isOpen,
  onToggle,
  badgeCount,
  children,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  badgeCount: number;
  children: ReactNode;
}) {
  return (
    <div className="border-b border-gray-100">
      <button
        type="button"
        className="flex w-full items-center gap-2 py-3 text-left outline-none hover:bg-gray-50/80 lg:hover:bg-transparent"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="flex min-w-0 flex-1 items-center gap-2">
          <span className="text-sm font-semibold text-black">{title}</span>
          {badgeCount > 0 ? (
            <span className="inline-flex h-5 min-w-[1.25rem] shrink-0 items-center justify-center rounded bg-[#39ff14] px-1.5 text-xs font-semibold tabular-nums text-black">
              {badgeCount > 99 ? "99+" : badgeCount}
            </span>
          ) : null}
        </span>
        <span className={`shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>{CHEVRON}</span>
      </button>
      {isOpen ? <div className="pb-3 pt-0">{children}</div> : null}
    </div>
  );
}

const FILTERS_STORAGE_KEY = "rentalize_listing_filters_v1";

/** Įjungti „Privatus (su PVM)“ / „Verslui (be PVM)“ perjungėją filtruose. */
const SHOW_CUSTOMER_SEGMENT_TOGGLE = false;

/** Kanoninis raktas filtrui: `markė|modelis` (kaip sąrašo grupavime). */
function carModelKey(car: Car): string {
  return `${car.brand}|${getCanonicalModel(car.brand, car.model)}`;
}

function brandLogoPath(brand: string): string {
  const slug = brand
    .trim()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
  return `/brand-logos/${slug}.png`;
}

export default function ListingWithFilters({ cars, listingImages }: { cars: Car[]; listingImages: ListingImages }) {
  const [search, setSearch] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [brands, setBrands] = useState<Set<string>>(new Set());
  /** Pasirinkti konkretūs modeliai (markė|kanoninis modelis). Jei tuščia – veikia tik markių rinkinys. */
  const [modelKeys, setModelKeys] = useState<Set<string>>(new Set());
  /** Kurios markės eilutės išskleistos (modelių sąrašas). */
  const [expandedBrands, setExpandedBrands] = useState<Set<string>>(new Set());
  const [fuels, setFuels] = useState<Set<string>>(new Set());
  const [types, setTypes] = useState<Set<string>>(new Set());
  const [providers, setProviders] = useState<Set<string>>(() => new Set(cars.map((c) => c.provider)));
  const [transmissions, setTransmissions] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<"price_asc" | "price_desc">("price_asc");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    price: false,
    brand: false,
    fuel: false,
    type: false,
    provider: false,
    transmission: false,
  });

  const didLoadFromStorageRef = useRef(false);

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // URL ?marke= / ?brand= + sessionStorage (grįžimas iš detalės).
  useEffect(() => {
    if (didLoadFromStorageRef.current) return;
    didLoadFromStorageRef.current = true;
    if (typeof window === "undefined") return;

    const available = cars.filter((c: any) => c.available !== false);
    const allowed = {
      brands: new Set(available.map((c: any) => c.brand).filter(Boolean)),
      fuels: new Set(available.map((c: any) => c.fuel).filter(Boolean)),
      types: new Set(available.map((c: any) => c.type).filter(Boolean)),
      providers: new Set(available.map((c: any) => c.provider).filter(Boolean)),
      transmissions: new Set(available.map((c: any) => c.transmission).filter(Boolean)),
    };

    const catalogBrandList = [...allowed.brands] as string[];
    const params = new URLSearchParams(window.location.search);
    const markeRaw = params.get("marke") ?? params.get("brand");
    const brandFromUrl = resolveMarkeToCatalogBrand(markeRaw, catalogBrandList);
    const lockBrandsFromUrl = Boolean(brandFromUrl);

    const allowedTypeList = [...allowed.types] as string[];
    const typeRaw = params.get("tipas") ?? params.get("type");
    let typeFromUrl: string | null = null;
    if (typeRaw) {
      if (allowedTypeList.includes(typeRaw)) {
        typeFromUrl = typeRaw;
      } else {
        const n = normalizeLoose(typeRaw);
        typeFromUrl = allowedTypeList.find((t) => normalizeLoose(t) === n) || null;
      }
    }
    const lockTypesFromUrl = Boolean(typeFromUrl);

    if (brandFromUrl) {
      setBrands(new Set([brandFromUrl]));
      setOpenAccordions((prev) => ({ ...prev, brand: true }));
      setExpandedBrands((prev) => new Set(prev).add(brandFromUrl));
    }

    if (typeFromUrl) {
      setTypes(new Set([typeFromUrl]));
      setOpenAccordions((prev) => ({ ...prev, type: true }));
    }

    try {
      const raw = window.sessionStorage.getItem(FILTERS_STORAGE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw);

      if (typeof parsed.search === "string") setSearch(parsed.search);
      if (typeof parsed.priceMin === "string" || typeof parsed.priceMin === "number") setPriceMin(String(parsed.priceMin ?? ""));
      if (typeof parsed.priceMax === "string" || typeof parsed.priceMax === "number") setPriceMax(String(parsed.priceMax ?? ""));
      if (parsed.sort === "price_asc" || parsed.sort === "price_desc") setSort(parsed.sort);

      if (!lockBrandsFromUrl && Array.isArray(parsed.brands)) {
        setBrands(new Set(parsed.brands.filter((v: any) => allowed.brands.has(v))));
      }
      if (Array.isArray(parsed.fuels)) setFuels(new Set(parsed.fuels.filter((v: any) => allowed.fuels.has(v))));
      if (!lockTypesFromUrl && Array.isArray(parsed.types)) {
        setTypes(new Set(parsed.types.filter((v: any) => allowed.types.has(v))));
      }
      if (Array.isArray(parsed.providers)) setProviders(new Set(parsed.providers.filter((v: any) => allowed.providers.has(v))));
      if (Array.isArray(parsed.transmissions))
        setTransmissions(new Set(parsed.transmissions.filter((v: any) => allowed.transmissions.has(v))));

      if (!lockBrandsFromUrl && Array.isArray(parsed.modelKeys)) {
        const valid = (parsed.modelKeys as string[]).filter((k) => {
          const i = k.indexOf("|");
          if (i < 0) return false;
          const b = k.slice(0, i);
          const m = k.slice(i + 1);
          if (!allowed.brands.has(b)) return false;
          return available.some(
            (c: Car) => c.brand === b && getCanonicalModel(c.brand, c.model) === m
          );
        });
        setModelKeys(new Set(valid));
      }
    } catch (e) {
      console.warn("[filters] Failed to restore from sessionStorage:", e);
    }
  }, [cars]);

  // Persist filters so Back/forward keeps the same UI state.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const payload = {
        search,
        priceMin,
        priceMax,
        sort,
        brands: [...brands],
        modelKeys: [...modelKeys],
        fuels: [...fuels],
        types: [...types],
        providers: [...providers],
        transmissions: [...transmissions],
      };
      window.sessionStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      // Ignore quota errors, private mode, etc.
    }
  }, [search, priceMin, priceMax, sort, brands, modelKeys, fuels, types, providers, transmissions]);

  const toggleFilter = useCallback(
    (kind: "fuel" | "type" | "provider" | "transmission", value: string) => {
      const setters = {
        fuel: setFuels,
        type: setTypes,
        provider: setProviders,
        transmission: setTransmissions,
      };
      const state = { fuel: fuels, type: types, provider: providers, transmission: transmissions }[kind];
      const next = new Set(state);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      setters[kind](next);
    },
    [fuels, types, providers, transmissions]
  );

  const toggleExpandBrand = useCallback((brand: string) => {
    setExpandedBrands((prev) => {
      const next = new Set(prev);
      if (next.has(brand)) next.delete(brand);
      else next.add(brand);
      return next;
    });
  }, []);

  const toggleBrandSelection = useCallback((brand: string) => {
    setBrands((prevB) => {
      const had = prevB.has(brand);
      const nextB = new Set(prevB);
      if (had) {
        nextB.delete(brand);
        setModelKeys((prevM) => {
          const n = new Set(prevM);
          const prefix = `${brand}|`;
          for (const k of n) {
            if (k.startsWith(prefix)) n.delete(k);
          }
          return n;
        });
      } else {
        nextB.add(brand);
      }
      return nextB;
    });
  }, []);

  const toggleModelSelection = useCallback((brand: string, canonicalModel: string) => {
    const key = `${brand}|${canonicalModel}`;
    setModelKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
    setBrands((prev) => new Set(prev).add(brand));
  }, []);

  const clearBrandModelFilters = useCallback(() => {
    setBrands(new Set());
    setModelKeys(new Set());
  }, []);

  const resetFilters = useCallback(() => {
    setSearch("");
    setPriceMin("");
    setPriceMax("");
    setBrands(new Set());
    setModelKeys(new Set());
    setFuels(new Set());
    setTypes(new Set());
    setProviders(new Set(cars.map((c) => c.provider)));
    setTransmissions(new Set());
    if (typeof window !== "undefined") window.sessionStorage.removeItem(FILTERS_STORAGE_KEY);
  }, [cars]);

  const filteredAndSorted = useMemo(() => {
    let list = cars.filter((car) => {
      if ((car as any).available === false) return false;
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        if (
          !car.brand.toLowerCase().includes(q) &&
          !car.model.toLowerCase().includes(q) &&
          !(car.type || "").toLowerCase().includes(q)
        )
          return false;
      }
      if (priceMin !== "" && !Number.isNaN(Number(priceMin)) && car.monthly_price < Number(priceMin)) return false;
      if (priceMax !== "" && !Number.isNaN(Number(priceMax)) && car.monthly_price > Number(priceMax)) return false;
      if (brands.size > 0 && !brands.has(car.brand)) return false;
      const prefix = `${car.brand}|`;
      const hasSpecificModelsForBrand = [...modelKeys].some((k) => k.startsWith(prefix));
      if (hasSpecificModelsForBrand && !modelKeys.has(carModelKey(car))) return false;
      if (fuels.size && !fuels.has(car.fuel)) return false;
      if (types.size && !types.has(car.type)) return false;
      if (providers.size && !providers.has(car.provider)) return false;
      if (transmissions.size && !transmissions.has(car.transmission)) return false;
      return true;
    });
    list = [...list].sort((a, b) =>
      sort === "price_desc" ? b.monthly_price - a.monthly_price : a.monthly_price - b.monthly_price
    );
    return list;
  }, [cars, search, priceMin, priceMax, brands, modelKeys, fuels, types, providers, transmissions, sort]);

  // Grupuojame pagal modelį (brand+model): viena kortelė vienam modeliui, atsidarius – visi pasiūlymai
  const byModel = useMemo(() => {
    const map = new Map<string, Car[]>();
    for (const car of filteredAndSorted) {
      const key = `${car.brand}|${getCanonicalModel(car.brand, car.model)}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(car);
    }
    return Array.from(map.entries()).map(([, group]) => {
      const minPrice = Math.min(...group.map((c) => c.monthly_price));
      const representative = group.find((c) => c.monthly_price === minPrice) || group[0];
      const canonicalModel = getCanonicalModel(representative.brand, representative.model);
      return { brand: representative.brand, model: canonicalModel, minPrice, representative, offerCount: group.length };
    });
  }, [filteredAndSorted]);

  const brandModelTree = useMemo(() => {
    const available = cars.filter((c: any) => c.available !== false);
    const map = new Map<string, Set<string>>();
    for (const car of available) {
      const canon = getCanonicalModel(car.brand, car.model);
      if (!map.has(car.brand)) map.set(car.brand, new Set());
      map.get(car.brand)!.add(canon);
    }
    return [...map.entries()]
      .map(([brand, models]) => ({
        brand,
        models: [...models].sort((a, b) => a.localeCompare(b, "lt")),
      }))
      .sort((a, b) => a.brand.localeCompare(b.brand, "lt"));
  }, [cars]);

  const unique = {
    brands: useMemo(() => [...new Set(cars.filter((c) => (c as any).available !== false).map((c) => c.brand).filter(Boolean))].sort(), [cars]),
    fuels: useMemo(() => [...new Set(cars.filter((c) => (c as any).available !== false).map((c) => c.fuel).filter(Boolean))].sort(), [cars]),
    types: useMemo(() => [...new Set(cars.filter((c) => (c as any).available !== false).map((c) => c.type).filter(Boolean))].sort(), [cars]),
    providers: useMemo(() => [...new Set(cars.filter((c) => (c as any).available !== false).map((c) => c.provider).filter(Boolean))].sort(), [cars]),
    transmissions: useMemo(() => [...new Set(cars.filter((c) => (c as any).available !== false).map((c) => c.transmission).filter(Boolean))].sort(), [cars]),
  };

  const activeFilterCount =
    (search.trim() ? 1 : 0) +
    (priceMin !== "" || priceMax !== "" ? 1 : 0) +
    (brands.size > 0 || modelKeys.size > 0 ? 1 : 0) +
    (fuels.size > 0 ? 1 : 0) +
    (types.size > 0 ? 1 : 0) +
    (unique.providers.length > 0 && providers.size < unique.providers.length ? 1 : 0) +
    (transmissions.size > 0 ? 1 : 0);

  return (
    <section id="katalogas" className="flex flex-col pb-20 lg:flex-row">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col gap-6 py-6 lg:flex-row">
          {/* Sidebar */}
          <aside
            className={`fixed inset-y-0 left-0 z-40 w-80 -translate-x-full overflow-y-auto border-r border-gray-100 bg-[#fcfcfc] px-4 py-5 transition-transform duration-200 lg:relative lg:order-1 lg:w-64 lg:translate-x-0 lg:shrink-0 xl:w-72 ${
              sidebarOpen ? "translate-x-0" : ""
            }`}
          >
            {SHOW_CUSTOMER_SEGMENT_TOGGLE ? (
              <div className="customer-toggle mb-4 flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  className="btn-option checked flex-1 rounded border-2 border-gray-900 bg-white py-2.5 text-center text-sm font-semibold text-gray-900"
                >
                  Privatus (su PVM)
                </button>
                <button
                  type="button"
                  className="btn-option flex-1 rounded border-2 border-gray-200 py-2.5 text-center text-sm font-medium text-gray-500"
                >
                  Verslui (be PVM)
                </button>
              </div>
            ) : null}
            <div className="flex items-center justify-between border-b border-gray-50 pb-3 lg:pb-4">
              <h2 className="text-sm font-bold text-black">Filtrai</h2>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="rounded p-1.5 text-gray-500 hover:bg-gray-200 lg:hidden"
                  onClick={() => setSidebarOpen(false)}
                  aria-label="Uždaryti"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="inline-flex shrink-0 items-center justify-center rounded-md border border-gray-200 bg-[#f7f7f7] px-3 py-1.5 text-sm font-semibold text-black shadow-sm transition hover:bg-[#ececec] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2"
                  onClick={resetFilters}
                >
                  Išvalyti ({activeFilterCount})
                </button>
              </div>
            </div>
            <div className="relative mt-3">
              <span
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                aria-hidden
              >
                <svg
                  className="h-4 w-4 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
              </span>
              <input
                type="search"
                placeholder=""
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Paieška kataloge"
                className="w-full rounded border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-black focus:border-gray-400 focus:outline-none"
              />
            </div>

            <div className="mt-2">
            {/* Kaina */}
            <FilterAccordionSection
              title="Kaina"
              isOpen={openAccordions.price}
              onToggle={() => toggleAccordion("price")}
              badgeCount={priceMin.trim() || priceMax.trim() ? 1 : 0}
            >
              <p className="text-xs text-gray-500">Mėnesio kaina (€)</p>
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Nuo"
                  min={0}
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  className="w-full rounded border border-gray-300 bg-white px-2.5 py-1.5 text-sm text-black focus:border-gray-400 focus:outline-none"
                />
                <span className="text-gray-400">–</span>
                <input
                  type="number"
                  placeholder="Iki"
                  min={0}
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  className="w-full rounded border border-gray-300 bg-white px-2.5 py-1.5 text-sm text-black focus:border-gray-400 focus:outline-none"
                />
              </div>
            </FilterAccordionSection>

            {/* Markė */}
            <FilterAccordionSection
              title="Markė ir modelis"
              isOpen={openAccordions.brand}
              onToggle={() => toggleAccordion("brand")}
              badgeCount={modelKeys.size > 0 ? modelKeys.size : brands.size}
            >
              <div>
                <div className="border-b border-gray-100 pb-2">
                  <label className="flex cursor-pointer items-center gap-3 text-sm text-black">
                    <input
                      type="checkbox"
                      checked={brands.size === 0 && modelKeys.size === 0}
                      onChange={() => clearBrandModelFilters()}
                      className="h-4 w-4 shrink-0 rounded-sm border-gray-300 text-black accent-[#39ff14] focus:ring-[#39ff14]/30"
                    />
                    <span className="font-medium">Visos markės</span>
                  </label>
                </div>
                <div className="mt-2 space-y-1">
                {brandModelTree.map(({ brand, models }) => {
                  const expanded = expandedBrands.has(brand);
                  const logoSrc = brandLogoPath(brand);
                  return (
                    <div key={brand} className="border-b border-gray-50 pb-2 last:border-b-0 last:pb-0">
                      <div className="flex items-center gap-1">
                        <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-2.5 py-1.5 text-sm text-black">
                          <input
                            type="checkbox"
                            checked={brands.has(brand)}
                            onChange={() => toggleBrandSelection(brand)}
                            className="h-4 w-4 shrink-0 rounded-sm border-gray-300 text-black accent-[#39ff14] focus:ring-[#39ff14]/30"
                          />
                          <span className={brands.has(brand) ? "font-medium text-black" : "text-gray-600"}>{brand}</span>
                        </label>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={logoSrc}
                          alt=""
                          className="h-6 w-6 shrink-0 rounded-full object-contain opacity-90"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.style.visibility = "hidden";
                          }}
                        />
                        <button
                          type="button"
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                          aria-expanded={expanded}
                          aria-label={expanded ? "Suskleisti modelius" : "Išskleisti modelius"}
                          onClick={() => toggleExpandBrand(brand)}
                        >
                          <span className={`inline-flex transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}>
                            {CHEVRON}
                          </span>
                        </button>
                      </div>
                      {expanded ? (
                        <div className="ml-7 space-y-2 border-l border-gray-100 py-1 pl-3">
                          {models.map((m) => {
                            const key = `${brand}|${m}`;
                            const checked = modelKeys.has(key);
                            return (
                              <label
                                key={key}
                                className="flex cursor-pointer items-center gap-2.5 text-sm text-black"
                              >
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => toggleModelSelection(brand, m)}
                                  className="h-4 w-4 shrink-0 rounded-sm border-gray-300 text-black accent-[#39ff14] focus:ring-[#39ff14]/30"
                                />
                                <span className={checked ? "font-medium" : "text-gray-700"}>{m}</span>
                              </label>
                            );
                          })}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
                </div>
              </div>
            </FilterAccordionSection>

            {/* Kuras */}
            <FilterAccordionSection
              title="Kuras"
              isOpen={openAccordions.fuel}
              onToggle={() => toggleAccordion("fuel")}
              badgeCount={fuels.size}
            >
              <div className="space-y-2.5">
                {unique.fuels.map((f) => (
                  <label key={f} className="flex cursor-pointer items-center gap-3 text-sm text-black">
                    <input
                      type="checkbox"
                      checked={fuels.has(f)}
                      onChange={() => toggleFilter("fuel", f)}
                      className="h-4 w-4 shrink-0 rounded-sm border-gray-300 text-black accent-[#39ff14] focus:ring-[#39ff14]/30"
                    />
                    <span>{f}</span>
                  </label>
                ))}
              </div>
            </FilterAccordionSection>

            {/* Kėbulo tipas */}
            <FilterAccordionSection
              title="Kėbulo tipas"
              isOpen={openAccordions.type}
              onToggle={() => toggleAccordion("type")}
              badgeCount={types.size}
            >
              <div className="space-y-2.5">
                {unique.types.map((t) => (
                  <label key={t} className="flex cursor-pointer items-center gap-3 text-sm text-black">
                    <input
                      type="checkbox"
                      checked={types.has(t)}
                      onChange={() => toggleFilter("type", t)}
                      className="h-4 w-4 shrink-0 rounded-sm border-gray-300 text-black accent-[#39ff14] focus:ring-[#39ff14]/30"
                    />
                    <span>{t}</span>
                  </label>
                ))}
              </div>
            </FilterAccordionSection>

            {/* Tiekėjas */}
            <FilterAccordionSection
              title="Tiekėjas"
              isOpen={openAccordions.provider}
              onToggle={() => toggleAccordion("provider")}
              badgeCount={
                unique.providers.length > 0 && providers.size < unique.providers.length ? providers.size : 0
              }
            >
              <div className="space-y-2.5">
                {unique.providers.map((p) => (
                  <label key={p} className="flex cursor-pointer items-center gap-3 text-sm text-black">
                    <input
                      type="checkbox"
                      checked={providers.has(p)}
                      onChange={() => toggleFilter("provider", p)}
                      className="h-4 w-4 shrink-0 rounded-sm border-gray-300 text-black accent-[#39ff14] focus:ring-[#39ff14]/30"
                    />
                    <span>{PROVIDER_LABELS[p] || p}</span>
                  </label>
                ))}
              </div>
            </FilterAccordionSection>

            {/* Pavarų dėžė */}
            <FilterAccordionSection
              title="Pavarų dėžė"
              isOpen={openAccordions.transmission}
              onToggle={() => toggleAccordion("transmission")}
              badgeCount={transmissions.size}
            >
              <div className="space-y-2.5">
                {unique.transmissions.map((t) => (
                  <label key={t} className="flex cursor-pointer items-center gap-3 text-sm text-black">
                    <input
                      type="checkbox"
                      checked={transmissions.has(t)}
                      onChange={() => toggleFilter("transmission", t)}
                      className="h-4 w-4 shrink-0 rounded-sm border-gray-300 text-black accent-[#39ff14] focus:ring-[#39ff14]/30"
                    />
                    <span>{t}</span>
                  </label>
                ))}
              </div>
            </FilterAccordionSection>
            </div>
          </aside>

          {/* Main content */}
          <div className="order-1 min-w-0 flex-1 lg:order-2 lg:pl-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-gray-500">
                <span className="font-medium text-gray-700">{byModel.length}</span> modeliai
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-black hover:bg-gray-50 lg:hidden"
                  onClick={() => setSidebarOpen(true)}
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Filtrai
                </button>
                <label className="inline-flex items-center gap-2">
                  <span className="text-sm text-gray-500">Rūšiuoti</span>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as "price_asc" | "price_desc")}
                    className="rounded border border-gray-300 bg-white px-3 py-2 text-sm text-black focus:border-gray-400 focus:outline-none"
                  >
                    <option value="price_asc">Pigiausi viršuje</option>
                    <option value="price_desc">Brangiausi viršuje</option>
                  </select>
                </label>
              </div>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {byModel.map(({ brand, model, minPrice, representative, offerCount }) => {
                const key = `${brand}|${model}`;
                const imgSrc =
                  listingImages.exact[key] ||
                  (() => {
                    const target = normalizeLoose(`${brand}_${model}`);
                    const hit = listingImages.fuzzy.find((f) => f.baseNorm && target.includes(f.baseNorm));
                    return hit ? hit.src : "";
                  })();
                return (
                  <Link
                    key={representative.id}
                    href={`/automobilis/${representative.id}`}
                    className="group flex flex-col overflow-hidden rounded-none bg-white transition-shadow hover:shadow-md"
                  >
                    <div className="relative min-h-[10rem] flex-1 isolate overflow-hidden bg-[#fcfcfc]">
                      {imgSrc ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={imgSrc}
                          alt={`${brand} ${model}`}
                          className="h-full w-full object-contain object-center mix-blend-multiply transition group-hover:opacity-95"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center px-6 text-center text-sm font-semibold text-gray-400">
                          {brand} {model}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col border-t border-gray-100 bg-[#fcfcfc] p-4">
                      <h3 className="text-base font-bold leading-tight text-black">
                        {brand} {model}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {representative.type || "—"}
                        {offerCount > 1 && (
                          <>
                            <span className="ml-1 text-gray-400">· </span>
                            <span className="inline-flex items-center rounded-md bg-[#39ff14] px-2 py-0.5 text-xs font-semibold text-black">
                              {offerCount} pasiūlymai
                            </span>
                          </>
                        )}
                      </p>
                      <p className="mt-2 flex items-baseline gap-1">
                        <span className="text-lg font-bold text-black">
                          nuo {minPrice.toLocaleString("lt-LT")}€
                        </span>
                        <span className="text-sm text-gray-500">/ mėn.</span>
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          aria-hidden
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </section>
  );
}
