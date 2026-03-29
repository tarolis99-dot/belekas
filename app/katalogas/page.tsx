import Link from "next/link";
import { getCars } from "@/lib/cars";
import ListingWithFilters from "../ListingWithFilters";
import { getListingImages } from "@/lib/listing-images";
import SiteHeader from "../components/SiteHeader";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Automobilių katalogas — Rentalize",
  description:
    "Filtruokite ilgalaikės nuomos pasiūlymus pagal kainą, markę, kėbulo tipą ir tiekėją.",
};

export default function KatalogasPage() {
  const cars = getCars();
  const listingImages = getListingImages();

  return (
    <div className="min-h-screen bg-[#fcfcfc]">
      <SiteHeader activeNav="katalogas" />

      <main className="bg-[#fcfcfc]">
        <section className="bg-[#fcfcfc]">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
            <p className="text-sm font-medium text-gray-500">
              <Link href="/" className="text-gray-500 hover:text-gray-800">
                Pradžia
              </Link>
              <span className="mx-2 text-gray-300">/</span>
              <span className="text-gray-900">Katalogas</span>
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Automobilių katalogas
            </h1>
            <p className="mt-3 max-w-2xl text-gray-600">
              Filtruokite pagal kainą, markę, kėbulo tipą ir tiekėją. Palyginkite mėnesines įmokas
              vienoje vietoje.
            </p>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-gray-500">
              Pateikiamos kainos yra orientacinės ir sugeneruotos remiantis{" "}
              <strong className="font-semibold text-gray-800">12 mėn.</strong> trukmės bei{" "}
              <strong className="font-semibold text-gray-800">2000 km/mėn.</strong> ridos standartu.
              Pradinė įmoka parinkta kuo artimesnė{" "}
              <strong className="font-semibold text-gray-800">1000 €</strong> sumai, kad galėtumėte matyti
              realų kainų skirtumą tarp tiekėjų. Kainos apskaičiuotos su PVM.
            </p>
          </div>
        </section>

        <ListingWithFilters cars={cars} listingImages={listingImages} />
      </main>

      <footer className="border-t border-gray-100 bg-[#fcfcfc] py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-sm text-gray-500 sm:flex-row sm:px-6 lg:px-8">
          <Link href="/" className="font-medium text-gray-700 hover:text-gray-900">
            ← Grįžti į pradžią
          </Link>
          <span>© {new Date().getFullYear()} Rentalize</span>
        </div>
      </footer>
    </div>
  );
}
