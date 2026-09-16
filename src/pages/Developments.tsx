import type { ReactNode } from "react";

import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  Landmark,
  MapPin,
  Route,
  ShieldCheck,
  Sparkles,
  Trees,
} from "lucide-react";

type DevelopmentsProps = {
  onBack: () => void;
  onProperties: () => void;
  onAbout: () => void;
  onContact: () => void;
};

export default function Developments({
  onBack,
  onProperties,
  onAbout,
  onContact,
}: DevelopmentsProps) {
  const hilltopFeatures = [
    "Good Roads",
    "Gate House",
    "Perimeter Fencing",
    "Good Drainage",
    "Resort Center",
  ];

  const nearbyPlaces = [
    "Christ the King College",
    "Epe Toll Gate",
    "Lagos State University — Epe Campus",
    "St. Augustine University",
  ];

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
              onClick={onContact}
              className="text-sm font-medium text-gray-600 transition hover:text-[#f97316]"
            >
              Contact
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
            Our Developments
          </p>

          <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight text-[#0b1b35] md:text-6xl">
            Creating developments built around{" "}
            <span className="bg-gradient-to-r from-[#f5a400] via-[#f97316] to-[#ef233c] bg-clip-text text-transparent">
              opportunity.
            </span>
          </h1>

          <p className="mt-6 max-w-3xl text-base leading-8 text-gray-600 md:text-lg">
            Explore Zertop Limited developments designed around
            strategic locations, infrastructure, accessible
            communities and long-term real-estate value.
          </p>
        </div>
      </section>

      {/* HILLTOP GARDENS */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            {/* VISUAL */}
            <div className="relative">
              <div className="absolute -left-6 -top-6 h-32 w-32 rounded-[30px] bg-yellow-100" />

              <div className="absolute -bottom-6 -right-6 h-36 w-36 rounded-[34px] bg-red-50" />

              <div className="relative overflow-hidden rounded-[30px] border border-orange-100 bg-[#fffaf5] p-8 shadow-[0_25px_70px_rgba(15,23,42,0.08)]">
                <div className="flex aspect-[16/11] items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-sm">
                      <Building2
                        size={38}
                        className="text-[#f97316]"
                      />
                    </div>

                    <h2 className="mt-6 text-3xl font-black text-[#0b1b35] md:text-4xl">
                      Hilltop Gardens
                    </h2>

                    <p className="mt-2 text-sm font-bold uppercase tracking-[0.18em] text-[#f97316]">
                      Estate
                    </p>

                    <div className="mx-auto mt-6 h-1 w-28 rounded-full bg-gradient-to-r from-[#f5a400] via-[#f97316] to-[#ef233c]" />
                  </div>
                </div>
              </div>
            </div>

            {/* CONTENT */}
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#f97316]">
                Featured Development
              </p>

              <h2 className="mt-4 text-3xl font-black text-[#0b1b35] md:text-5xl">
                Hilltop Gardens Estate
              </h2>

              <div className="mt-5 flex items-start gap-3 text-gray-600">
                <MapPin
                  size={20}
                  className="mt-1 shrink-0 text-[#f97316]"
                />

                <p className="leading-7">
                  Odo Elewu Junction, off Iloti Road, Epe,
                  Lagos State.
                </p>
              </div>

              <p className="mt-6 leading-8 text-gray-600">
                Hilltop Gardens is one of Zertop Limited&apos;s
                real-estate developments in the Epe growth corridor,
                designed around accessibility, infrastructure and
                residential opportunity.
              </p>

              <p className="mt-4 leading-8 text-gray-600">
                The estate is positioned close to educational
                institutions, transport links and other developments
                within Epe, providing potential homeowners and
                investors with access to a developing area.
              </p>

              <button
                type="button"
                onClick={onProperties}
                className="mt-8 flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#f5a400] via-[#f97316] to-[#ef233c] px-6 py-3.5 font-bold text-white shadow-lg shadow-orange-100 transition hover:-translate-y-0.5"
              >
                View Available Properties
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES + LANDMARKS */}
      <section className="border-y border-gray-200 bg-[#f8fafc]">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-6">
          <div className="grid gap-14 lg:grid-cols-2">
            {/* FEATURES */}
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#f97316]">
                Estate Features
              </p>

              <h2 className="mt-4 text-3xl font-black text-[#0b1b35] md:text-4xl">
                Infrastructure designed for better living.
              </h2>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {hilltopFeatures.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-50">
                      <CheckCircle2
                        size={19}
                        className="text-[#f97316]"
                      />
                    </div>

                    <span className="text-sm font-semibold text-gray-700">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* LANDMARKS */}
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#f97316]">
                Close Proximity
              </p>

              <h2 className="mt-4 text-3xl font-black text-[#0b1b35] md:text-4xl">
                Connected to important locations in Epe.
              </h2>

              <div className="mt-8 space-y-4">
                {nearbyPlaces.map((place) => (
                  <div
                    key={place}
                    className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50">
                      <Route
                        size={20}
                        className="text-[#f97316]"
                      />
                    </div>

                    <span className="text-sm font-semibold text-gray-700">
                      {place}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DEVELOPMENT VALUE */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-6">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#f97316]">
              Hilltop Gardens
            </p>

            <h2 className="mt-4 text-3xl font-black text-[#0b1b35] md:text-4xl">
              Built around location, infrastructure and growth.
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <DevelopmentValueCard
              icon={<Route size={25} />}
              title="Good Access"
              text="Road and drainage infrastructure designed to improve movement and accessibility within the estate."
            />

            <DevelopmentValueCard
              icon={<ShieldCheck size={25} />}
              title="Secure Community"
              text="Gate house and perimeter fencing form part of the estate's planned infrastructure."
            />

            <DevelopmentValueCard
              icon={<Trees size={25} />}
              title="Lifestyle Environment"
              text="A development vision that includes residential infrastructure and a resort-centre concept."
            />
          </div>
        </div>
      </section>

      {/* OCEAN'S WHISPER */}
      <section className="border-y border-gray-200 bg-[#fffaf5]">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-6">
          <div className="relative overflow-hidden rounded-[30px] border border-orange-100 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] md:p-12">
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-yellow-100/70 blur-[100px]" />

            <div className="pointer-events-none absolute -bottom-24 left-20 h-72 w-72 rounded-full bg-red-50 blur-[100px]" />

            <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[0.75fr_1.25fr]">
              <div>
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-orange-50">
                  <Sparkles
                    size={34}
                    className="text-[#f97316]"
                  />
                </div>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#f97316]">
                  Development Portfolio
                </p>

                <h2 className="mt-4 text-3xl font-black text-[#0b1b35] md:text-5xl">
                  Ocean&apos;s Whisper
                </h2>

                <p className="mt-5 max-w-2xl leading-8 text-gray-600">
                  Ocean&apos;s Whisper is included in Zertop
                  Limited&apos;s development portfolio. Additional
                  information about the location, property types,
                  pricing and estate features can be published as
                  project information becomes available.
                </p>

                <button
                  type="button"
                  onClick={onContact}
                  className="mt-7 rounded-xl border border-orange-200 bg-orange-50 px-6 py-3.5 font-bold text-[#f97316] transition hover:bg-orange-100"
                >
                  Enquire About This Development
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DEVELOPMENT APPROACH */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-6">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#f97316]">
                Our Approach
              </p>

              <h2 className="mt-4 text-3xl font-black text-[#0b1b35] md:text-4xl">
                Developments positioned for tomorrow.
              </h2>

              <p className="mt-5 leading-8 text-gray-600">
                Zertop&apos;s development approach focuses on
                locations, infrastructure, accessibility and
                long-term property opportunity.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <ApproachCard
                icon={<MapPin size={23} />}
                title="Strategic Locations"
                text="Projects positioned around areas with development and investment potential."
              />

              <ApproachCard
                icon={<Landmark size={23} />}
                title="Planned Communities"
                text="A development approach focused on organised residential environments and infrastructure."
              />

              <ApproachCard
                icon={<ShieldCheck size={23} />}
                title="Property Value"
                text="Developments structured around accessibility, infrastructure and long-term opportunity."
              />

              <ApproachCard
                icon={<Sparkles size={23} />}
                title="Future Focus"
                text="A growing portfolio designed to respond to evolving real-estate and lifestyle needs."
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-200 bg-[#f8fafc]">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-6">
          <div className="relative overflow-hidden rounded-[30px] bg-gradient-to-r from-[#f5a400] via-[#f97316] to-[#ef233c] p-8 text-white shadow-xl md:p-12">
            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full border-[35px] border-white/10" />

            <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[1fr_auto]">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/75">
                  Find Your Opportunity
                </p>

                <h2 className="mt-4 max-w-2xl text-3xl font-black md:text-4xl">
                  Interested in a Zertop development?
                </h2>

                <p className="mt-4 max-w-2xl leading-7 text-white/85">
                  Explore available properties or contact the Zertop
                  team for information about current developments and
                  investment opportunities.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={onProperties}
                  className="rounded-xl bg-white px-6 py-3.5 font-bold text-[#ef233c] shadow-lg"
                >
                  View Properties
                </button>

                <button
                  type="button"
                  onClick={onContact}
                  className="rounded-xl border border-white/40 bg-white/10 px-6 py-3.5 font-bold text-white backdrop-blur"
                >
                  Contact Zertop
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-10 md:flex-row md:items-end md:justify-between md:px-6">
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

type DevelopmentValueCardProps = {
  icon: ReactNode;
  title: string;
  text: string;
};

function DevelopmentValueCard({
  icon,
  title,
  text,
}: DevelopmentValueCardProps) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-[#f8fafc] p-7 transition hover:-translate-y-1 hover:border-orange-200 hover:bg-white hover:shadow-lg">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-[#f97316]">
        {icon}
      </div>

      <h3 className="mt-5 text-xl font-bold text-[#0b1b35]">
        {title}
      </h3>

      <p className="mt-3 leading-7 text-gray-600">
        {text}
      </p>
    </div>
  );
}

type ApproachCardProps = {
  icon: ReactNode;
  title: string;
  text: string;
};

function ApproachCard({
  icon,
  title,
  text,
}: ApproachCardProps) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-[#f8fafc] p-6 transition hover:border-orange-200 hover:bg-white hover:shadow-md">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-[#f97316]">
        {icon}
      </div>

      <h3 className="mt-5 font-bold text-[#0b1b35]">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-gray-600">
        {text}
      </p>
    </div>
  );
}