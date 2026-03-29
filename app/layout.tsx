import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rentalize — Ilgalaikė auto nuoma",
  description:
    "Rentalize — raskite pigiausią auto nuomą ilgam laikui. Palyginkite tiekėjus vienoje vietoje.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="lt" className={inter.variable}>
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
