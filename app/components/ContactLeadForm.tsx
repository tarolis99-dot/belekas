"use client";

import { useState, type FormEvent } from "react";

/** Pakeiskite į savo kontaktinį el. paštą. */
const CONTACT_EMAIL = "info@rentalize.lt";

export default function ContactLeadForm() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();
    const subject = encodeURIComponent("Kurb.lt — individualus pasiūlymas");
    const body = encodeURIComponent(`Vardas: ${name}\nEl. paštas: ${email}\n\n${message}`);
    const mailto = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    try {
      window.open(mailto, "_blank", "noopener,noreferrer");
    } catch {
      window.location.href = mailto;
    }
    setSent(true);
    form.reset();
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="lead-name" className="block text-sm font-medium text-gray-700">
            Vardas
          </label>
          <input
            id="lead-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400"
            placeholder="Jonas Jonaitis"
          />
        </div>
        <div>
          <label htmlFor="lead-email" className="block text-sm font-medium text-gray-700">
            El. paštas
          </label>
          <input
            id="lead-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400"
            placeholder="jonas@pavyzdys.lt"
          />
        </div>
        <div>
          <label htmlFor="lead-message" className="block text-sm font-medium text-gray-700">
            Trumpai apie poreikius <span className="font-normal text-gray-500">(būtina)</span>
          </label>
          <textarea
            id="lead-message"
            name="message"
            rows={4}
            required
            className="mt-1.5 w-full resize-y rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400"
            placeholder="Pvz.: Ieškau Toyota RAV4 nuomai iki 500€/mėn. arba panašaus visureigio lizingu 5 metams."
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-black px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Siųsti užklausą
        </button>
      </form>
      {sent && (
        <p className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-center text-sm text-gray-600">
          Jei neatsidarė paštas, rašykite:{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-gray-900 underline">
            {CONTACT_EMAIL}
          </a>
        </p>
      )}
    </div>
  );
}
