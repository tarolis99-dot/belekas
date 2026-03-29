import Image from "next/image";
import Link from "next/link";
import { getCars } from "@/lib/cars";
import { getFeaturedModels } from "@/lib/featured-models";
import { getListingImages } from "@/lib/listing-images";
import ContactLeadForm from "./components/ContactLeadForm";
import SiteHeader from "./components/SiteHeader";
import LandingBrandGrid from "./components/LandingBrandGrid";
import LandingBodyTypes from "./components/LandingBodyTypes";
import LandingProviderLogos from "./components/LandingProviderLogos";
import type { ReactNode } from "react";

export const dynamic = "force-dynamic";

const VALUE_PROPS: { title: string; description: ReactNode; icon: (props: { className?: string }) => ReactNode }[] = [
  {
    title: "Visi tiekėjai vienoje vietoje",
    description:
      "Pamirškite dešimtis atidarytų naršyklės langų. „MyBee“, „Sixt“, „Admita“ ir kitų tiekėjų pasiūlymai sugrupuoti greitam ir patogiam lyginimui.",
    icon: CompareIcon,
  },
  {
    title: "Skaidrumo standartas",
    description: (
      <>
        Visos kainos perskaičiuotos pagal <strong>12</strong> mėn. ir <strong>2000</strong> km/mėn. bazę,
        parinkus artimiausią <strong>1000</strong> € pradinį įnašą. Nes lyginti nuomos kainas be suvienodintų
        sąlygų yra tas pats, kas tikėti, jog turguje parduodamo seno "Passat'o" rida yra tikra.
      </>
    ),
    icon: PackageIcon,
  },
  {
    title: "Tiesioginis kelias",
    description:
      "Radote tinkamą automobilį? Vienas paspaudimas ir būsite nukreipti tiesiai į tikslų tiekėjo pasiūlymą. Jokių klaidžiojimų bendruose kataloguose ar pakartotinių paieškų.",
    icon: FlexIcon,
  },
] ;

function CompareIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  );
}

function PackageIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
      />
    </svg>
  );
}

function FlexIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

export default function HomePage() {
  const cars = getCars();
  const listingImages = getListingImages();
  const featured = getFeaturedModels(cars, listingImages, 4);

  return (
    <div className="min-h-screen bg-[#fcfcfc]">
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="border-b border-gray-100 bg-[#fcfcfc]">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 pb-10 pt-10 sm:px-6 sm:pb-14 sm:pt-12 lg:grid-cols-2 lg:items-stretch lg:gap-16 lg:px-8 lg:pb-16 lg:pt-16">
            <div className="flex max-w-xl flex-col justify-center">
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
                Palyginkite ilgalaikės nuomos kainas vienoje vietoje
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-gray-600">
                Raskite geriausią pasiūlymą savo biudžetui - su visomis paslaugomis įskaičiuotomis į
                mėnesinę įmoką.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link
                  href="/katalogas"
                  className="inline-flex items-center justify-center rounded-lg bg-[#39ff14] px-8 py-4 text-base font-semibold text-black shadow-sm transition hover:bg-[#32c616] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#39ff14] focus-visible:ring-offset-2"
                >
                  Rinktis automobilį
                </Link>
                <Link
                  href="/#vertė"
                  className="text-sm font-semibold text-gray-700 underline-offset-4 hover:text-gray-900 hover:underline"
                >
                  Kodėl Rentalize?
                </Link>
              </div>

            </div>
            <div className="relative mx-auto w-full max-w-2xl min-h-[220px] lg:max-w-none lg:min-h-0 lg:h-full">
              <div className="relative aspect-[16/10] w-full overflow-visible lg:absolute lg:inset-0 lg:aspect-auto">
                <Image
                  src="/hero-cupra-formentor.png"
                  alt="CUPRA Formentor — techninė išvaizda"
                  fill
                  className="origin-center scale-[1.05] object-contain object-center lg:scale-[1.08]"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>
          </div>
          <div className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8 lg:pb-8">
            <LandingProviderLogos inHero />
          </div>
        </section>

        <LandingBrandGrid />

        {/* Value props */}
        <section id="vertė" className="border-b border-gray-100 bg-[#fcfcfc]">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
                Nebesukite galvos
              </h2>
              <p className="mt-4 text-lg text-gray-900">
                Didžiųjų Lietuvos automobilių prenumeratos tiekėjų pasiūlymai vienoje vietoje. Sąlygos
                suvienodintos, o kainos perskaičiuotos pagal bendrą standartą.
              </p>
            </div>
            <div className="mt-20 grid gap-10 sm:grid-cols-3 sm:gap-8 lg:mt-24 lg:gap-12">
              {VALUE_PROPS.map(({ title, description, icon: Icon }) => (
                <div
                  key={title}
                  className="mt-1 flex flex-col items-center text-center rounded-2xl bg-[#fcfcfc] px-8 pb-8 pt-9 shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-[0_4px_6px_rgba(0,0,0,0.05),0_0_18px_rgba(107,114,128,0.25)]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#39ff14] text-black">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-gray-900">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <LandingBodyTypes />

        {/* Featured */}
        <section className="border-b border-gray-100 bg-[#fcfcfc]">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  Populiarūs modeliai
                </h2>
                <p className="mt-3 max-w-xl text-gray-600">
                  Geriausi rinkos pasiūlymai vienoje eilėje. Palyginkite, kaip keičiasi kaina tarp skirtingų tiekėjų tam pačiam modeliui.
                </p>
              </div>
              <Link
                href="/katalogas"
                className="shrink-0 text-sm font-semibold text-black underline-offset-4 transition hover:text-gray-900 hover:underline"
              >
                Visas katalogas →
              </Link>
            </div>
            {/* Mobile: swipe (horizontalus scroll) */}
            <div
              className="mt-10 -mx-4 flex gap-4 overflow-x-auto overflow-y-hidden px-4 pb-3 sm:hidden snap-x snap-mandatory touch-pan-x overscroll-x-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
              role="region"
              aria-label="Populiarūs modeliai – slinkite horizontaliai"
            >
              {featured.map(({ representative, brand, model, minPrice, offerCount, imgSrc }) => (
                <Link
                  key={representative.id}
                  href={`/automobilis/${representative.id}`}
                  className="group flex w-[78vw] max-w-[320px] shrink-0 snap-start flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:border-gray-300 hover:shadow-md"
                >
                  <div className="relative aspect-[5/4] bg-[#f7f7f7]">
                    {imgSrc ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={imgSrc}
                        alt={`${brand} ${model}`}
                        className="h-full w-full object-contain object-center p-4 transition group-hover:opacity-95"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center p-6 text-center text-sm font-semibold text-gray-400">
                        {brand} {model}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col border-t border-gray-100 bg-[#fcfcfc] p-5">
                    <h3 className="text-base font-bold text-gray-900">
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
                    <p className="mt-auto pt-4 text-base font-bold text-gray-900">
                      nuo {minPrice.toLocaleString("lt-LT")}€
                      <span className="text-sm font-normal text-gray-500"> / mėn.</span>
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Tablet/Desktop: grid */}
            <div className="mt-12 hidden gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-4">
              {featured.map(({ representative, brand, model, minPrice, offerCount, imgSrc }) => (
                <Link
                  key={representative.id}
                  href={`/automobilis/${representative.id}`}
                  className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:border-gray-300 hover:shadow-md"
                >
                  <div className="relative aspect-[5/4] bg-[#f7f7f7]">
                    {imgSrc ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={imgSrc}
                        alt={`${brand} ${model}`}
                        className="h-full w-full object-contain object-center p-4 transition group-hover:opacity-95"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center p-6 text-center text-sm font-semibold text-gray-400">
                        {brand} {model}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col border-t border-gray-100 bg-[#fcfcfc] p-5">
                    <h3 className="text-base font-bold text-gray-900">
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
                    <p className="mt-auto pt-4 text-base font-bold text-gray-900">
                      nuo {minPrice.toLocaleString("lt-LT")}€
                      <span className="text-sm font-normal text-gray-500"> / mėn.</span>
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="kontaktai" className="border-t border-gray-100 bg-[#fcfcfc]">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
            <div className="mx-auto max-w-xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Neradote tinkamo varianto?
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Aprašykite poreikius: modelį, ridą, terminą. Individualus pasiūlymas pasieks Jus artimiausiu metu.
              </p>
            </div>
            <div className="mt-12">
              <ContactLeadForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-100 bg-[#fafafa] py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-sm text-gray-500 sm:flex-row sm:px-6 lg:px-8">
          <span>© {new Date().getFullYear()} Rentalize</span>
          <Link href="/katalogas" className="font-medium text-gray-700 hover:text-gray-900">
            Automobilių katalogas
          </Link>
        </div>
      </footer>
    </div>
  );
}
