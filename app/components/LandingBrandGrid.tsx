import Image from "next/image";
import Link from "next/link";
import { getDiscoveredBrandLogos } from "@/lib/brand-logo";

function catalogHref(catalogBrand: string | null) {
  if (!catalogBrand) return "/katalogas";
  return `/katalogas?marke=${encodeURIComponent(catalogBrand)}`;
}

function BrandCard({
  label,
  src,
  href,
  className,
}: {
  label: string;
  src: string;
  href: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={className}
    >
      <div className="relative h-24 w-full">
        <Image
          src={src}
          alt={label}
          fill
          className="object-contain object-center p-1"
          sizes="(max-width: 640px) 160px, (max-width: 1024px) 25vw, 160px"
        />
      </div>
      <p className="mt-4 text-center text-sm font-bold uppercase tracking-wide text-gray-900">
        {label}
      </p>
    </Link>
  );
}

export default function LandingBrandGrid() {
  const items = getDiscoveredBrandLogos();

  if (items.length === 0) {
    return null;
  }

  const cardBase =
    "flex flex-col items-center rounded-2xl border border-gray-200 bg-[#fcfcfc] p-5 shadow-sm transition hover:border-gray-300 hover:shadow-md";

  return (
    <section className="border-b border-gray-100 bg-[#fcfcfc]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        {/* Antraštė: mobilėje – viena eilutė, mygtukas dešinėje */}
        <div className="flex flex-row items-center justify-between gap-3 sm:items-end">
          <h2 className="min-w-0 text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Automobilių markės
          </h2>
          <Link
            href="/katalogas"
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#39ff14] px-4 py-2 text-xs font-semibold text-black shadow-sm transition hover:bg-[#32c616] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#39ff14] focus-visible:ring-offset-2 sm:px-6 sm:py-2.5 sm:text-sm"
          >
            Pamatykite visus
          </Link>
        </div>

        {/* Mobile: horizontalus slankiklis (swipe) */}
        <div
          className="mt-10 -mx-4 flex gap-4 overflow-x-auto overflow-y-hidden px-4 pb-3 pt-1 [scrollbar-width:none] [-ms-overflow-style:none] sm:mt-12 sm:hidden [&::-webkit-scrollbar]:hidden snap-x snap-mandatory overscroll-x-contain"
          role="region"
          aria-label="Markių logotipai – slinkite horizontaliai"
        >
          {items.map(({ slug, label, src, catalogBrand }) => (
            <BrandCard
              key={slug + src}
              label={label}
              src={src}
              href={catalogHref(catalogBrand)}
              className={`${cardBase} w-[42vw] max-w-[168px] shrink-0 snap-start`}
            />
          ))}
        </div>

        {/* Tablet ir desktop: tinklelis */}
        <div className="mt-12 hidden grid-cols-3 gap-4 sm:grid md:grid-cols-4 lg:grid-cols-6">
          {items.map(({ slug, label, src, catalogBrand }) => (
            <BrandCard
              key={slug + src}
              label={label}
              src={src}
              href={catalogHref(catalogBrand)}
              className={`${cardBase} p-6`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
