import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getCarById,
  getOffersForModel,
  getCanonicalModel,
  PROVIDER_LABELS,
  type Car,
} from "@/lib/cars";
import { getListingImages, resolveListingImageSrc } from "@/lib/listing-images";
import SiteHeader from "../../components/SiteHeader";

export const dynamic = "force-dynamic";

const SERVICE_PACKAGE_ITEMS: { title: string; text: string }[] = [
  {
    title: "Pilnas draudimas",
    text: "KASKO ir civilinė atsakomybė jau įskaičiuota.",
  },
  {
    title: "Techninė priežiūra",
    text: "Aptarnavimai, tepalų keitimas ir remontas – nemokamai.",
  },
  {
    title: "Sezoninės padangos",
    text: "Padangų saugojimas ir keitimas du kartus per metus.",
  },
  {
    title: "Pagalba kelyje",
    text: "24/7 pagalba sugedus ar įvykus avarijai.",
  },
  {
    title: "Pakaitinis auto",
    text: "Sugedus automobiliui, gausite kitą transporto priemonę.",
  },
];

function computeOfferBestScore(offer: Car) {
  // Geriausias pasiūlymas:
  // mėnesinė kaina + (pradinis įnašas + vienkartinis sutarties sudarymo mokestis) / 12
  // (AVIS FLEX atveju "pradinis" laikomas `liability_eur`).
  const months = 12;
  const initial =
    offer.provider === "AVIS FLEX" ? offer.liability_eur ?? offer.initial_payment : offer.initial_payment;
  // MyBee kortelėse vienkartinis mokestis rodomas kaip 150 €,
  // todėl į "geriausio pasiūlymo" palyginimą jį įtraukiame nuosekliai.
  const oneTime = offer.provider === "MYBEE" ? 150 : offer.one_time_fee ?? 0;
  return offer.monthly_price + (initial + oneTime) / months;
}

function ProviderLogo({ provider }: { provider: string }) {
  const label = PROVIDER_LABELS[provider] || provider;
  const initial = label.slice(0, 2).toUpperCase();
  return (
    <div
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-sm font-bold text-gray-700"
      aria-hidden
    >
      {initial}
    </div>
  );
}

/** Dokumento ikona (individualus pasiūlymas) — kaip „Paslaugų paketas“ kortelių išdėstyme. */
function LeasingInquiryIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.65}
      stroke="currentColor"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
      />
    </svg>
  );
}

/** CTA kortelė „Pasiūlymai“ sąraše: šviesiai pilkas fonas + šešėlis, ikona kaip antraštė. */
function LeasingInquiryCard() {
  return (
    <li>
      <a
        href="/#kontaktai"
        className="flex items-center gap-4 rounded-xl border border-gray-200/95 bg-[#f7f7f7] p-5 transition hover:border-gray-300/95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#39ff14] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fcfcfc]"
      >
        <LeasingInquiryIcon className="h-10 w-10 shrink-0 text-gray-900" />
        <div className="min-w-0 flex-1">
          <p className="text-base font-bold leading-snug text-gray-900">
            Domina pirkimas ar lizingas?
          </p>
          <p className="mt-1.5 text-sm font-normal leading-relaxed text-gray-600">
            Gaukite individualų pasiūlymą.
          </p>
        </div>
      </a>
    </li>
  );
}

export default async function AutomobilioDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const car = getCarById(id);
  if (!car) notFound();

  const offersRaw = getOffersForModel(car.brand, car.model);
  const offersWithScore = offersRaw.map((offer) => ({
    offer,
    score: computeOfferBestScore(offer),
  }));
  const bestScore = Math.min(...offersWithScore.map((x) => x.score));
  const hasMultipleOffers = offersWithScore.length > 1;
  const offers = offersWithScore.slice().sort((a, b) => a.offer.monthly_price - b.offer.monthly_price);
  const offersCount = offers.length;
  const offersLabel =
    offersCount === 1 ? "pasiūlymas" : offersCount === 0 ? "pasiūlymų" : "pasiūlymai";
  const displayModel = getCanonicalModel(car.brand, car.model);
  const listingImages = getListingImages();
  const localHero = resolveListingImageSrc(listingImages, car.brand, displayModel);
  const listImg = car.listing_img_url || car.img_url;
  const fallbackImg = listImg ? (listImg.startsWith("http") ? listImg : `/${listImg}`) : "";
  const imgSrc = localHero || fallbackImg;

  return (
    <div className="min-h-screen bg-[#fcfcfc]">
      <SiteHeader />

      <div className="mx-auto max-w-7xl px-4 pt-4 pb-6 sm:px-6 sm:pt-6 sm:pb-8 lg:px-8 lg:pt-7 lg:pb-10">
        <div className="mt-4 grid gap-10 lg:grid-cols-[1fr_400px] lg:gap-16">
          {/* Left column: title + image + specs (vienas „stulpelis“ — lygiuojasi su nuotrauka) */}
          <div className="min-w-0 space-y-10">
            <div className="flex items-start justify-between gap-4">
              <div className="pt-1">
                <Link
                  href="/katalogas"
                  className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                >
                  <span aria-hidden>←</span>
                  Grįžti į katalogą
                </Link>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium uppercase tracking-wide text-gray-500">{car.brand}</p>
                <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">{displayModel}</h1>
              </div>
            </div>

            {/* Hero: pilkas fonas šonuose (object-contain „letterbox“), be baltos ant img */}
            <div className="relative w-full overflow-hidden rounded-xl border border-gray-200 bg-[#f7f7f7]">
              <div className="relative aspect-[16/10] w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imgSrc}
                  alt={`${car.brand} ${car.model}`}
                  className="absolute inset-0 h-full w-full object-contain object-center"
                />
              </div>
            </div>

            {/* Mobile: pasiūlymai iškart po nuotraukos (be pl-12 – simetriškas lygiavimas su hero) */}
            <div className="space-y-4 lg:hidden">
              <div className="rounded-xl bg-transparent py-6">
                <h2 className="text-lg font-semibold text-gray-900">Pasiūlymai</h2>
                <p className="mt-1 text-sm text-gray-500">
                  {car.brand} {displayModel} –{" "}
                  <span className="font-medium text-black">
                    {offersCount} {offersLabel}
                  </span>
                </p>
                <ul className="mt-6 space-y-4">
                  {offers.map(({ offer, score }) => (
                    <li
                      key={offer.id}
                      className="flex flex-col gap-3 rounded-lg border border-gray-200/95 bg-[#f7f7f7] p-4 transition hover:border-gray-300/95"
                    >
                      <div className="flex flex-col items-start gap-2">
                        <div className="flex w-full items-center justify-between gap-3">
                          <p className="min-w-0 truncate text-base font-semibold text-gray-900">
                            {PROVIDER_LABELS[offer.provider] || offer.provider}
                          </p>
                          {hasMultipleOffers && score === bestScore ? (
                            <span className="shrink-0 inline-flex rounded-full bg-[#39ff14] px-2.5 py-1 text-xs font-semibold text-black">
                              Geriausias pasiūlymas
                            </span>
                          ) : null}
                        </div>
                        <p className="text-xl font-bold text-gray-900">
                          {offer.monthly_price.toLocaleString("lt-LT")}€
                          <span className="text-sm font-medium text-gray-500"> / mėn.</span>
                        </p>
                      </div>

                      <div className="text-left text-xs leading-relaxed text-gray-500">
                        <p className="font-medium text-gray-700">Kaina sugeneruota:</p>
                        <ul className="mt-1.5 list-disc space-y-1 pl-5">
                          {offer.provider === "AVIS FLEX" ? (
                            <li>
                              <strong className="font-semibold text-gray-700">
                                {(offer.liability_eur ?? 900).toLocaleString("lt-LT")} €
                              </strong>{" "}
                              atsakomybės mokestis
                            </li>
                          ) : (
                            <li>
                              <strong className="font-semibold text-gray-700">
                                {(offer.initial_payment ?? 1000).toLocaleString("lt-LT")} €
                              </strong>{" "}
                              pradinis įnašas
                            </li>
                          )}
                          <li>
                            <strong className="font-semibold text-gray-700">
                              {offer.commitment_months ?? 12} mėn.
                            </strong>{" "}
                            laikotarpis
                          </li>
                          {offer.provider === "KLV" ? null : offer.provider === "MYBEE" ? (
                            <li>
                              <strong className="font-semibold text-gray-700">2000 km/mėn.</strong> limitas
                              <br />
                              <span className="text-[11px] text-gray-500">
                                (1666 km bazė + 334 papildomi km įskaičiuoti į kainą)
                              </span>
                            </li>
                          ) : (
                            <li>
                              <strong className="font-semibold text-gray-700">2000 km</strong> per mėnesį limitas
                            </li>
                          )}
                          {offer.provider === "ADMITAFLEX" ? (
                            <li>
                              Vienkartinis sutarties sudarymo mokestis{" "}
                              <strong className="font-semibold text-gray-700">149 €</strong>
                            </li>
                          ) : null}
                          {offer.provider === "MYBEE" ? (
                            <li>
                              Vienkartinis sutarties sudarymo mokestis:{" "}
                              <strong className="font-semibold text-gray-700">150 €</strong>
                            </li>
                          ) : null}
                        </ul>
                        <div className="mt-3 space-y-0.5">
                          <p className="whitespace-nowrap">
                            Pavarų dėžė:{" "}
                            {offer.transmission && offer.transmission !== "—" ? offer.transmission : "—"}
                          </p>
                          <p className="whitespace-nowrap">
                            Kuras: {offer.fuel && offer.fuel !== "—" ? offer.fuel : "—"}
                          </p>
                        </div>
                      </div>
                      <a
                        href={
                          offer.provider === "MYBEE"
                            ? offer.offer_url || "https://mybee.lt/automobiliai"
                            : offer.provider === "ADMITAFLEX"
                              ? offer.offer_url || "https://admitaflex.lt/automobiliai/"
                              : offer.provider === "SIXT+"
                                ? offer.offer_url || "https://www.sixtplus.lt/pasirinkite-automobili"
                                : offer.provider === "AVIS FLEX"
                                  ? offer.offer_url || "https://myavis.lt/avis-flex/pasiulymai/"
                                  : offer.provider === "GBY"
                                    ? offer.offer_url || "https://www.gbyrent.lt/ilgalaike-automobiliu-nuoma"
                                    : "#"
                        }
                        target={
                          offer.provider === "MYBEE" ||
                          offer.provider === "ADMITAFLEX" ||
                          offer.provider === "SIXT+" ||
                          offer.provider === "AVIS FLEX" ||
                          offer.provider === "GBY"
                            ? "_blank"
                            : undefined
                        }
                        rel={
                          offer.provider === "MYBEE" ||
                          offer.provider === "ADMITAFLEX" ||
                          offer.provider === "SIXT+" ||
                          offer.provider === "AVIS FLEX" ||
                          offer.provider === "GBY"
                            ? "noopener noreferrer"
                            : undefined
                        }
                        className="flex items-center justify-center rounded-lg bg-black py-3 text-sm font-semibold text-white transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                      >
                        Eiti į pasiūlymą
                      </a>
                    </li>
                  ))}
                  <LeasingInquiryCard />
                </ul>
              </div>
            </div>

            <section className="space-y-5">
              <h2 className="text-lg font-semibold text-gray-900">Paslaugų paketas</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <ul className="flex flex-col gap-5">
                  {SERVICE_PACKAGE_ITEMS.slice(0, 3).map((item) => (
                    <li key={item.title} className="flex gap-3">
                      <span
                        className="shrink-0 text-lg leading-none [font-family:Segoe_UI_Emoji,Apple_Color_Emoji,Noto_Color_Emoji,sans-serif]"
                        aria-hidden
                      >
                        ✅
                      </span>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900">{item.title}</p>
                        <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{item.text}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <ul className="flex flex-col gap-5">
                  {SERVICE_PACKAGE_ITEMS.slice(3, 6).map((item) => (
                    <li key={item.title} className="flex gap-3">
                      <span
                        className="shrink-0 text-lg leading-none [font-family:Segoe_UI_Emoji,Apple_Color_Emoji,Noto_Color_Emoji,sans-serif]"
                        aria-hidden
                      >
                        ✅
                      </span>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900">{item.title}</p>
                        <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{item.text}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {car.car_info && car.car_info.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Automobilio informacija
                </h2>
                <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {car.car_info.map((item, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-gray-200 px-4 py-3"
                    >
                      <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        {item.label}
                      </dt>
                      <dd className="mt-0.5 font-medium text-gray-900">
                        {item.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}
          </div>

          {/* Right column: Sticky sidebar – Pasiūlymai (desktop only) */}
          <aside className="hidden lg:block lg:sticky lg:top-8 lg:self-start">
            <div className="rounded-xl bg-transparent py-6 pl-12 pr-0">
              <h2 className="text-lg font-semibold text-gray-900">Pasiūlymai</h2>
              <p className="mt-1 text-sm text-gray-500">
                {car.brand} {displayModel} –{" "}
                <span className="font-medium text-black">
                  {offersCount} {offersLabel}
                </span>
              </p>
              <ul className="mt-6 space-y-4">
                {offers.map(({ offer, score }) => (
                  <li
                    key={offer.id}
                    className="flex flex-col gap-3 rounded-lg border border-gray-200/95 bg-[#f7f7f7] p-4 transition hover:border-gray-300/95"
                  >
                    <div className="flex flex-col items-start gap-2">
                      <div className="flex w-full items-center justify-between gap-3">
                        <p className="min-w-0 truncate text-base font-semibold text-gray-900">
                          {PROVIDER_LABELS[offer.provider] || offer.provider}
                        </p>
                        {hasMultipleOffers && score === bestScore ? (
                          <span className="shrink-0 inline-flex rounded-full bg-[#39ff14] px-2.5 py-1 text-xs font-semibold text-black">
                            Geriausias pasiūlymas
                          </span>
                        ) : null}
                      </div>
                      <p className="text-xl font-bold text-gray-900">
                        {offer.monthly_price.toLocaleString("lt-LT")}€
                        <span className="text-sm font-medium text-gray-500"> / mėn.</span>
                      </p>
                    </div>

                    <div className="text-left text-xs leading-relaxed text-gray-500">
                      <p className="font-medium text-gray-700">Kaina sugeneruota:</p>
                      <ul className="mt-1.5 list-disc space-y-1 pl-5">
                        {offer.provider === "AVIS FLEX" ? (
                          <li>
                            <strong className="font-semibold text-gray-700">
                              {(offer.liability_eur ?? 900).toLocaleString("lt-LT")} €
                            </strong>{" "}
                            atsakomybės mokestis
                          </li>
                        ) : (
                          <li>
                            <strong className="font-semibold text-gray-700">
                              {(offer.initial_payment ?? 1000).toLocaleString("lt-LT")} €
                            </strong>{" "}
                            pradinis įnašas
                          </li>
                        )}
                        <li>
                          <strong className="font-semibold text-gray-700">
                            {offer.commitment_months ?? 12} mėn.
                          </strong>{" "}
                          laikotarpis
                        </li>
                        {offer.provider === "KLV" ? null : offer.provider === "MYBEE" ? (
                          <li>
                            <strong className="font-semibold text-gray-700">2000 km/mėn.</strong> limitas
                            <br />
                            <span className="text-[11px] text-gray-500">
                              (1666 km bazė + 334 papildomi km įskaičiuoti į kainą)
                            </span>
                          </li>
                        ) : (
                          <li>
                            <strong className="font-semibold text-gray-700">2000 km</strong> per mėnesį limitas
                          </li>
                        )}
                        {offer.provider === "ADMITAFLEX" ? (
                          <li>
                            Vienkartinis sutarties sudarymo mokestis{" "}
                            <strong className="font-semibold text-gray-700">149 €</strong>
                          </li>
                        ) : null}
                        {offer.provider === "MYBEE" ? (
                          <li>
                            Vienkartinis sutarties sudarymo mokestis:{" "}
                            <strong className="font-semibold text-gray-700">150 €</strong>
                          </li>
                        ) : null}
                      </ul>
                      <div className="mt-3 space-y-0.5">
                        <p className="whitespace-nowrap">
                          Pavarų dėžė:{" "}
                          {offer.transmission && offer.transmission !== "—" ? offer.transmission : "—"}
                        </p>
                        <p className="whitespace-nowrap">
                          Kuras: {offer.fuel && offer.fuel !== "—" ? offer.fuel : "—"}
                        </p>
                      </div>
                    </div>
                    <a
                      href={
                        offer.provider === "MYBEE"
                          ? offer.offer_url || "https://mybee.lt/automobiliai"
                          : offer.provider === "ADMITAFLEX"
                            ? offer.offer_url || "https://admitaflex.lt/automobiliai/"
                            : offer.provider === "SIXT+"
                              ? offer.offer_url || "https://www.sixtplus.lt/pasirinkite-automobili"
                              : offer.provider === "AVIS FLEX"
                                ? offer.offer_url || "https://myavis.lt/avis-flex/pasiulymai/"
                                : offer.provider === "GBY"
                                  ? offer.offer_url || "https://www.gbyrent.lt/ilgalaike-automobiliu-nuoma"
                                : "#"
                      }
                      target={offer.provider === "MYBEE" || offer.provider === "ADMITAFLEX" || offer.provider === "SIXT+" || offer.provider === "AVIS FLEX" || offer.provider === "GBY" ? "_blank" : undefined}
                      rel={offer.provider === "MYBEE" || offer.provider === "ADMITAFLEX" || offer.provider === "SIXT+" || offer.provider === "AVIS FLEX" || offer.provider === "GBY" ? "noopener noreferrer" : undefined}
                      className="flex items-center justify-center rounded-lg bg-black py-3 text-sm font-semibold text-white transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                      Eiti į pasiūlymą
                    </a>
                  </li>
                ))}
                <LeasingInquiryCard />
              </ul>
            </div>
          </aside>
        </div>

      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const { getCars } = await import("@/lib/cars");
  const cars = getCars();
  return cars.map((car) => ({ id: car.id }));
}
