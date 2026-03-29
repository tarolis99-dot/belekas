import Image from "next/image";

type ProviderLogo = {
  key: string;
  label: string;
  src: string;
};

const PROVIDERS: ProviderLogo[] = [
  { key: "admitaflex", label: "AdmitaFlex", src: "/provider-logos/admitaflex.png" },
  { key: "mybee", label: "MyBee", src: "/provider-logos/mybee.png" },
  { key: "sixt", label: "SIXT+", src: "/provider-logos/sixt.png" },
  { key: "avis", label: "AVIS", src: "/provider-logos/avis.png" },
  { key: "gby", label: "GBY", src: "/provider-logos/gby.png" },
];

export default function LandingProviderLogos({ inHero = false }: { inHero?: boolean }) {
  return (
    <div className={inHero ? "mt-10" : "border-b border-gray-100 bg-[#fcfcfc]"}>
      <div className={inHero ? "" : "mx-auto max-w-7xl px-4 pb-10 pt-6 sm:px-6 sm:pb-12 sm:pt-8 lg:px-8 lg:pb-16 lg:pt-10"}>
        {!inHero ? (
          <p className="text-center text-sm font-semibold text-gray-900">
            Visi rinkos lyderiai vienoje vietoje
          </p>
        ) : null}
        {inHero ? (
          <div className="mt-2 grid w-full grid-cols-5 items-center justify-items-center gap-x-6 gap-y-6">
            {PROVIDERS.map((p) => (
              <div
                key={p.key}
                className="relative h-10 w-full max-w-[135px] opacity-40 grayscale sm:h-10 sm:max-w-[150px] lg:h-11 lg:max-w-[170px]"
                title={p.label}
              >
                <Image
                  src={p.src}
                  alt={p.label}
                  fill
                  className="object-contain object-center"
                  sizes="170px"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:mt-8 sm:gap-x-12 lg:gap-x-16">
            {PROVIDERS.map((p) => (
              <div
                key={p.key}
                className="relative h-10 w-[140px] opacity-40 grayscale sm:h-12 sm:w-[160px] lg:h-14 lg:w-[180px]"
                title={p.label}
              >
                <Image
                  src={p.src}
                  alt={p.label}
                  fill
                  className="object-contain object-center"
                  sizes="180px"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

