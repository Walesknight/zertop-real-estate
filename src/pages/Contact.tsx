import type { ReactNode } from "react";

import {
  ArrowLeft,
  Building2,
  Globe2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";

type ContactProps = {
  onBack: () => void;
  onProperties: () => void;
  onAbout: () => void;
  onDevelopments: () => void;
};

const WHATSAPP_NUMBER = "2349058910187";

export default function Contact({
  onBack,
  onProperties,
  onAbout,
  onDevelopments,
}: ContactProps) {
  const openWhatsApp = () => {
    const message = `
Hello Zertop Limited,

I would like to make an enquiry about your properties and developments.
    `.trim();

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      message
    )}`;

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div className="min-h-screen bg-white text-[#0b1b35]">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 md:px-6">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center"
          >
            <img
              src="/zertop-logo.png"
              alt="Zertop Limited"
              className="h-12 w-auto object-contain md:h-14"
            />
          </button>

          <nav className="hidden items-center gap-7 lg:flex">
            <button
              type="button"
              onClick={onBack}
              className="text-sm font-medium text-gray-600 transition hover:text-[#f97316]"
            >
              Home
            </button>

            <button
              type="button"
              onClick={onProperties}
              className="text-sm font-medium text-gray-600 transition hover:text-[#f97316]"
            >
              Properties
            </button>

            <button
              type="button"
              onClick={onAbout}
              className="text-sm font-medium text-gray-600 transition hover:text-[#f97316]"
            >
              About
            </button>

            <button
              type="button"
              onClick={onDevelopments}
              className="text-sm font-medium text-gray-600 transition hover:text-[#f97316]"
            >
              Developments
            </button>
          </nav>

          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-semibold text-[#0b1b35] transition hover:border-orange-300 hover:bg-orange-50"
          >
            <ArrowLeft size={17} />
            Home
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-gray-200 bg-[#fffaf5]">
        <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-[#f5a400] via-[#f97316] to-[#ef233c]" />

        <div className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-yellow-100/70 blur-[100px]" />

        <div className="pointer-events-none absolute -right-20 top-0 h-80 w-80 rounded-full bg-red-100/60 blur-[110px]" />

        <div className="relative mx-auto max-w-7xl px-5 py-20 md:px-6 md:py-24">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#f97316]">
            Contact Zertop
          </p>

          <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight text-[#0b1b35] md:text-6xl">
            Start a conversation about your{" "}
            <span className="bg-gradient-to-r from-[#f5a400] via-[#f97316] to-[#ef233c] bg-clip-text text-transparent">
              property goals.
            </span>
          </h1>

          <p className="mt-6 max-w-3xl text-base leading-8 text-gray-600 md:text-lg">
            Contact Zertop Limited for property enquiries,
            inspections, investment opportunities and information
            about our developments.
          </p>
        </div>
      </section>

      {/* CONTACT CARDS */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <ContactCard
              icon={<Phone size={25} />}
              title="Call Us"
            >
              <a
                href="tel:+2348135420099"
                className="block transition hover:text-[#f97316]"
              >
                0813 542 0099
              </a>

              <a
                href="tel:+2349054787868"
                className="mt-1 block transition hover:text-[#f97316]"
              >
                0905 478 7868
              </a>

              <a
                href="tel:+2349042509860"
                className="mt-1 block transition hover:text-[#f97316]"
              >
                0904 250 9860
              </a>
            </ContactCard>

            <ContactCard
              icon={<Mail size={25} />}
              title="Email"
            >
              <a
                href="mailto:admin@zertoplimited.com"
                className="block break-all transition hover:text-[#f97316]"
              >
                admin@zertoplimited.com
              </a>

              <a
                href="mailto:zertopreal@gmail.com"
                className="mt-2 block break-all transition hover:text-[#f97316]"
              >
                zertopreal@gmail.com
              </a>
            </ContactCard>

            <ContactCard
              icon={<Globe2 size={25} />}
              title="Website"
            >
              <a
                href="https://www.zertoplimited.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-[#f97316]"
              >
                www.zertoplimited.com
              </a>
            </ContactCard>

            <ContactCard
              icon={<MessageCircle size={25} />}
              title="WhatsApp"
            >
              <button
                type="button"
                onClick={openWhatsApp}
                className="font-bold text-[#16a34a] transition hover:text-[#15803d]"
              >
                Chat with Zertop
              </button>
            </ContactCard>
          </div>
        </div>
      </section>

      {/* OFFICE */}
      <section className="border-y border-gray-200 bg-[#f8fafc]">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 md:px-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#f97316]">
              Visit Our Office
            </p>

            <h2 className="mt-4 text-3xl font-black text-[#0b1b35] md:text-4xl">
              Zertop Limited, Lagos.
            </h2>

            <p className="mt-5 max-w-lg leading-8 text-gray-600">
              Visit the Zertop team for property discussions,
              development enquiries and investment consultations.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-[30px] border border-orange-100 bg-white p-7 shadow-[0_20px_60px_rgba(15,23,42,0.08)] md:p-10">
            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-yellow-100/70 blur-3xl" />

            <div className="relative flex gap-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50">
                <MapPin
                  size={25}
                  className="text-[#f97316]"
                />
              </div>

              <div>
                <p className="text-sm font-bold text-gray-400">
                  Office Address
                </p>

                <p className="mt-3 max-w-xl text-lg font-bold leading-8 text-[#0b1b35]">
                  Suite B31 & B32, 1st Floor,
                  Royale Plaza International, Bogije,
                  Km 35, Lekki-Epe Expressway,
                  Lagos, Nigeria.
                </p>

                <p className="mt-4 text-sm leading-6 text-gray-500">
                  Ibeju-Lekki / Lekki-Epe corridor.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK ENQUIRY */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-6">
          <div className="relative overflow-hidden rounded-[30px] bg-gradient-to-r from-[#f5a400] via-[#f97316] to-[#ef233c] p-8 text-white shadow-xl md:p-12">
            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full border-[35px] border-white/10" />

            <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[1fr_auto]">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/75">
                  Quick Enquiry
                </p>

                <h2 className="mt-4 max-w-2xl text-3xl font-black md:text-4xl">
                  Found a property or development that interests you?
                </h2>

                <p className="mt-4 max-w-2xl leading-7 text-white/85">
                  Speak directly with the Zertop team through
                  WhatsApp for property details, payment information
                  and inspections.
                </p>
              </div>

              <button
                type="button"
                onClick={openWhatsApp}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#16a34a] px-7 py-4 font-bold text-white shadow-lg transition hover:bg-[#15803d]"
              >
                <MessageCircle size={19} />
                Chat on WhatsApp
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* EXPLORE */}
      <section className="border-t border-gray-200 bg-[#f8fafc]">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-6">
          <div className="mb-9 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#f97316]">
              Explore Zertop
            </p>

            <h2 className="mt-4 text-3xl font-black text-[#0b1b35] md:text-4xl">
              Continue exploring our property opportunities.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <button
              type="button"
              onClick={onProperties}
              className="group rounded-3xl border border-gray-200 bg-white p-7 text-left shadow-sm transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50">
                <Building2
                  size={27}
                  className="text-[#f97316]"
                />
              </div>

              <h3 className="mt-5 text-xl font-bold text-[#0b1b35]">
                Browse Properties
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                Explore currently available Zertop
                property opportunities.
              </p>
            </button>

            <button
              type="button"
              onClick={onDevelopments}
              className="group rounded-3xl border border-gray-200 bg-white p-7 text-left shadow-sm transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50">
                <MapPin
                  size={27}
                  className="text-[#f97316]"
                />
              </div>

              <h3 className="mt-5 text-xl font-bold text-[#0b1b35]">
                Our Developments
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                Discover Hilltop Gardens and Zertop&apos;s
                growing development portfolio.
              </p>
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-10 md:flex-row md:items-end md:justify-between md:px-6">
          <div>
            <img
              src="/zertop-logo.png"
              alt="Zertop Limited"
              className="h-14 w-auto object-contain"
            />

            <p className="mt-4 max-w-md text-sm leading-6 text-gray-500">
              Real Estate & Property Development.
              Building brighter tomorrows.
            </p>
          </div>

          <div className="text-sm text-gray-400 md:text-right">
            <p>© 2026 Zertop Limited.</p>
            <p className="mt-1">
              All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

type ContactCardProps = {
  icon: ReactNode;
  title: string;
  children: ReactNode;
};

function ContactCard({
  icon,
  title,
  children,
}: ContactCardProps) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-[#f8fafc] p-6 transition hover:-translate-y-1 hover:border-orange-200 hover:bg-white hover:shadow-lg">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-[#f97316]">
        {icon}
      </div>

      <h3 className="mt-5 text-lg font-bold text-[#0b1b35]">
        {title}
      </h3>

      <div className="mt-3 text-sm leading-6 text-gray-600">
        {children}
      </div>
    </div>
  );
}