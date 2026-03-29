/** Tas pats modelis, skirtingi pavadinimai – grupuojame į vieną kortelę ir pasiūlymus */

export const MODEL_CANONICAL: Record<string, Record<string, string>> = {
  MG: {
    "ZS HYBRID+": "ZS",
    Zs: "ZS",
    "MG Zs": "ZS",
    "MG ZS": "ZS",
  },
  Cupra: { TERRAMAR: "Terramar" },
  Audi: { "Q5 Sportback": "Q5", "Q 5": "Q5", "A6 C8": "A6" },
  BMW: {
    "1 Series M Pack": "1 Series",
    // kad failai typu `bmw_1series.jpg` susilygintų su kanoniniu `BMW 1 Series`
    "1series": "1 Series",
    "1 series": "1 Series",
  },
  Volkswagen: {
    Golfvariant: "Golf Variant",
    GOLF: "Golf",
    "T-cross": "T-Cross",
    "T-roc": "T-Roc",
    "T roc": "T-Roc",
    "Tiguan New": "Tiguan",
    TIGUAN: "Tiguan",
    "Tiguan LIFE 30Y": "Tiguan",
    "T-CROSS LIFE 30Y": "T-Cross",
    "Tayron LIFE": "Tayron",
  },
  Toyota: {
    Corollacross: "Corolla Cross",
    "Yaris Cross Hybrid": "Yaris Cross",
    "Yaris Hybrid 1.5": "Yaris",
    "Corolla Hybrid 1.8": "Corolla",
    "Corolla Sedan": "Corolla",
  },
  KIA: { "Ceed SW": "Ceed Sportswagon" },
  Nissan: { "Qashqai MHEV": "Qashqai" },
  Seat: { "Leon Style Sportstourer": "Leon Sportstourer", "Arona Style Plus": "Arona" },
  "Škoda": {
    "Oktavia Selection": "Octavia Combi",
    "Octavia Sw": "Octavia Combi",
    "Superb Sw": "Superb Combi",
    "Octavia AMBITION": "Octavia",
    "Octavia Combi AMBITION": "Octavia Combi",
    "Karoq AMBITION": "Karoq",
  },
  "Mercedes-Benz": { Eqs: "EQS" },
};

export function getCanonicalModel(brand: string, model: string): string {
  // Brand'ai ir modeliai duomenyse gali būti skirtingų raidžių dydžių (pvz. VOLKSWAGEN vs Volkswagen).
  // Todėl kanonizaciją darome case-insensitive.
  const b = (brand || "").trim();
  const m = (model || "").trim();
  if (!b || !m) return m || model;

  const brandKey =
    Object.keys(MODEL_CANONICAL).find((k) => k.toLowerCase() === b.toLowerCase()) ?? b;
  const map = MODEL_CANONICAL[brandKey];
  if (!map) return m;

  // 1) exact match
  if (map[m]) return map[m];
  // 2) case-insensitive match
  const modelKey = Object.keys(map).find((k) => k.toLowerCase() === m.toLowerCase());
  return modelKey ? map[modelKey] : m;
}
