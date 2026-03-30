"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { SHOW_CONTACT_UI } from "@/lib/constants";

export type SiteHeaderProps = {
  /** Aktyvus meniu punktas (pvz. katalogo puslapyje). */
  activeNav?: "katalogas";
};

// Hover spalva – kaip „Eiti į pasiūlymą“ mygtuko hover.
const hoverLikeCta = "hover:text-[#32c616]";
// X spalva – visada neoninė.
const alwaysNeon = "text-[#CCFF00]";
const focusNeonLight =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CCFF00]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fcfcfc]";
const focusNeonDark =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CCFF00]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]";

function HamburgerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function SiteHeader({ activeNav }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const close = () => setMenuOpen(false);

  const overlayLinkBase =
    "block w-full max-w-md rounded-lg py-4 text-center text-2xl font-semibold tracking-tight text-white transition-colors focus:outline-none focus-visible:text-[#CCFF00] sm:text-3xl";

  return (
    <header className="sticky top-0 z-30 bg-[#fcfcfc]/95 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-bold tracking-tight text-gray-900">
          Rentalize
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {activeNav === "katalogas" ? (
            <span className="shrink-0 text-sm font-semibold text-gray-900">Katalogas</span>
          ) : (
            <Link
              href="/katalogas"
              className="shrink-0 text-sm font-medium text-gray-700 transition hover:text-gray-900"
            >
              Katalogas
            </Link>
          )}
          <Link
            href="/#vertė"
            className="shrink-0 text-sm font-medium text-gray-500 transition hover:text-gray-800"
          >
            Apie
          </Link>
          {SHOW_CONTACT_UI ? (
            <Link
              href="/#kontaktai"
              className="shrink-0 text-sm font-medium text-gray-500 hover:text-gray-800"
            >
              Susisiekime
            </Link>
          ) : null}
        </div>

        <button
          type="button"
          className={`rounded-lg p-2 text-gray-900 transition md:hidden ${hoverLikeCta} ${focusNeonLight}`}
          aria-label="Atidaryti meniu"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav-overlay"
          onClick={() => setMenuOpen(true)}
        >
          <HamburgerIcon className="h-6 w-6" />
        </button>
      </nav>

      {mounted && menuOpen
        ? createPortal(
            <div
              id="mobile-nav-overlay"
              className="fixed inset-0 z-[200] flex min-h-dvh flex-col bg-[#0a0a0a]/80 backdrop-blur-md backdrop-saturate-150"
              style={{
                // Production'e kai kuriuose build'uose Tailwind backdrop klasės kartais "neišlenda" dėl purging/caching.
                // Inline stilius užtikrina blur visur (Chrome/Safari, Vercel).
                backdropFilter: "blur(12px) saturate(1.5)",
                WebkitBackdropFilter: "blur(12px) saturate(1.5)",
              }}
              role="dialog"
              aria-modal="true"
              aria-label="Navigacija"
            >
              <button
                type="button"
                className={`absolute right-4 top-4 z-10 rounded-lg p-3 transition sm:right-6 sm:top-5 ${alwaysNeon} ${focusNeonDark}`}
                aria-label="Uždaryti meniu"
                onClick={close}
              >
                <CloseIcon className="h-7 w-7" />
              </button>

              <nav className="flex flex-1 flex-col items-center justify-center gap-1 px-6 pb-24 pt-16">
                {activeNav === "katalogas" ? (
                  <span
                    className={`${overlayLinkBase} ${alwaysNeon}`}
                    aria-current="page"
                  >
                    Katalogas
                  </span>
                ) : (
                  <Link
                    href="/katalogas"
                    className={`${overlayLinkBase} ${hoverLikeCta}`}
                    onClick={close}
                  >
                    Katalogas
                  </Link>
                )}
                <Link
                  href="/#vertė"
                  className={`${overlayLinkBase} ${hoverLikeCta}`}
                  onClick={close}
                >
                  Apie
                </Link>
                {SHOW_CONTACT_UI ? (
                  <Link
                    href="/#kontaktai"
                    className={`${overlayLinkBase} ${hoverLikeCta}`}
                    onClick={close}
                  >
                    Susisiekime
                  </Link>
                ) : null}
              </nav>
            </div>,
            document.body
          )
        : null}
    </header>
  );
}
