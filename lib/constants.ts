export interface CarInfoItem {
  label: string;
  value: string;
}

export interface Car {
  id: string;
  provider: string;
  brand: string;
  model: string;
  monthly_price: number;
  /** Ar pasiūlymas šiuo metu yra tiekėjo sąraše (true/undefined = rodyti, false = nerodyti) */
  available?: boolean;
  transmission: string;
  fuel: string;
  type: string;
  commitment_months: number;
  initial_payment: number;
  one_time_fee: number;
  img_url: string;
  /** Nuotrauka iš katalogo/sąrašo puslapio – naudojama pagrindiniame sąraše */
  listing_img_url?: string;
  /** Nuotrauka iš tiekėjo detail puslapio – tik pasiūlymų skiltyje (mažas langelis), ne sąraše */
  detail_img_url?: string;
  /** Nuskreipta iš skilties „Automobilio informacija“ (MyBee ir kt.) */
  car_info?: CarInfoItem[];
  /** Tiesioginė nuoroda į pasiūlymą tiekėjo svetainėje (pvz. MyBee automobilio puslapis) */
  offer_url?: string;
  /** Rida įskaičiuota per mėn. (km), jei nurodyta */
  mileage_per_month?: number;
  /** Būklė: "Nauja" | "Naudota" */
  condition?: string;
  /** Rida (odometras) km */
  mileage_km?: number;
  /** Atsakomybė (žala/franšizė) € jei nurodyta */
  liability_eur?: number;
}

export const PROVIDER_LABELS: Record<string, string> = {
  ADMITAFLEX: "AdmitaFlex",
  MYBEE: "MyBee",
  "SIXT+": "SIXT+",
  "HERTZ LEASE": "Hertz Lease",
  GBY: "GBY",
  "AVIS FLEX": "Avis Flex",
};

// Feature flags (laikinai paslėpti, bet ne ištrinti)
export const SHOW_CONTACT_UI = false;
