import Image from "next/image";
import Link from "next/link";

type BodyTypeItem = {
  typeValue: string;
  label: string;
  imgSrc: string;
};

// Tvarką laikome pagal tavo užsakymą.
const BODY_TYPES: BodyTypeItem[] = [
  {
    typeValue: "Hečbekas",
    label: "Hečbekas",
    imgSrc: "/body-types/Hecbekas.jpg",
  },
  {
    typeValue: "SUV / Krosoveris",
    label: "SUV / Krosoveris",
    imgSrc: "/body-types/SUV-Krosoveris.jpg",
  },
  {
    typeValue: "Universalas",
    label: "Universalas",
    imgSrc: "/body-types/Universalas.jpg",
  },
  {
    typeValue: "Sedanas",
    label: "Sedanas",
    imgSrc: "/body-types/Sedanas.jpg",
  },
  {
    typeValue: "Keleivinis mikroautobusas",
    label: "Keleivinis mikroautobusas",
    imgSrc: "/body-types/Keleivinis mikroautobusas.jpg",
  },
  {
    typeValue: "Krovininis",
    label: "Krovininis",
    imgSrc: "/body-types/Krovininis.jpg",
  },
];

const cardBase =
  "flex flex-col bg-[#fcfcfc] overflow-hidden";

export default function LandingBodyTypes() {
  return (
    <section className="border-b border-gray-100 bg-[#fcfcfc]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="flex flex-row items-center justify-between gap-3 sm:items-end">
          <div className="min-w-0">
            <h2 className="min-w-0 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Kėbulo tipai
            </h2>
            <p className="mt-3 max-w-xl text-gray-600">
              Nuo kompaktiškų miesto hečbekų iki erdvių šeimos visureigių. Atraskite tinkamiausią kėbulo tipą
              savo poreikiams.
            </p>
          </div>
          <Link
            href="/katalogas"
            className="inline-flex w-fit shrink-0 items-center justify-center rounded-full bg-[#39ff14] px-4 py-2 text-xs font-semibold text-black shadow-sm transition hover:bg-[#32c616] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#39ff14] focus-visible:ring-offset-2 sm:px-6 sm:py-2.5 sm:text-sm"
          >
            Pamatykite visus
          </Link>
        </div>

        {/* Mobile: swipe (horizontalus scroll) */}
        <div
          className="mt-10 -mx-4 flex gap-4 overflow-x-auto overflow-y-hidden px-4 pb-3 pt-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory touch-pan-x overscroll-x-contain sm:hidden"
          role="region"
          aria-label="Kėbulo tipai – slinkite horizontaliai"
        >
          {BODY_TYPES.map((item) => (
            <Link
              key={item.typeValue}
              href={`/katalogas?tipas=${encodeURIComponent(item.typeValue)}`}
              className={`${cardBase} w-[64vw] max-w-[240px] shrink-0 snap-start`}
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-[#f7f7f7]">
                <Image
                  src={item.imgSrc}
                  alt={item.label}
                  fill
                  className="object-contain object-center px-2 pt-4"
                  sizes="(max-width: 640px) 72vw, 280px"
                />
              </div>
              <p className="px-3 pb-3 pt-3 text-center text-[13px] font-bold leading-tight tracking-wide text-gray-900">
                {item.label}
              </p>
            </Link>
          ))}
        </div>

        {/* Tablet/Desktop: grid */}
        <div className="mt-10 hidden gap-3 sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {BODY_TYPES.map((item) => (
            <Link
              key={item.typeValue}
              href={`/katalogas?tipas=${encodeURIComponent(item.typeValue)}`}
              className={cardBase}
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-[#f7f7f7]">
                <Image
                  src={item.imgSrc}
                  alt={item.label}
                  fill
                  className="object-contain object-center px-2 pt-4"
                  sizes="(max-width: 768px) 28vw, 180px"
                />
              </div>
              <p className="px-3 pb-3 pt-3 text-center text-[13px] font-bold leading-tight tracking-wide text-gray-900">
                {item.label}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

