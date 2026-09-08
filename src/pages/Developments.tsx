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
    <div className="min-h-screen bg-[#080808] text-white">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#080808]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-6">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center"
          >
            <img
              src="/zertop-logo.png"
              alt="Zertop Limited"
              className="h-10 w-auto object-contain md:h-12"
            />
          </button>

          <nav className="hidden items-center gap-7 lg:flex">
            <button
              onClick={onBack}
              className="text-sm text-white/70 transition hover:text-[#f59e0b]"
            >
              Home
            </button>

            <button
              onClick={onProperties}
              className="text-sm text-white/70 transition hover:text-[#f59e0b]"
            >
              Properties
            </button>

            <button
              onClick={onAbout}
              className="text-sm text-white/70 transition hover:text-[#f59e0b]"
            >
              About
            </button>

            <button
              onClick={onContact}
              className="text-sm text-white/70 transition hover:text-[#f59e0b]"
            >
              Contact
            </button>
          </nav>

          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/[0.03] px-4 py-2 text-sm text-white/70 transition hover:border-[#f59e0b]/50 hover:text-white"
          >
            <ArrowLeft size={17} />
            Home
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/10 bg-[#0d0d0d]">
        <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-[#f59e0b] via-[#f97316] to-[#dc2626]" />

        <div className="pointer-events-none absolute -left-24 top-20 h-80 w-80 rounded-full bg-[#f59e0b]/10 blur-[110px]" />

        <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-[#dc2626]/10 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-5 py-20 md:px-6 md:py-24">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#f59e0b]">
            Our Developments
          </p>

          <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight md:text-6xl">
            Creating developments built around{" "}
            <span className="bg-gradient-to-r from-[#f59e0b] via-[#f97316] to-[#dc2626] bg-clip-text text-transparent">
              opportunity.
            </span>
          </h1>

          <p className="mt-6 max-w-3xl text-base leading-8 text-white/50 md:text-lg">
            Explore Zertop Limited developments designed around
            strategic locations, modern infrastructure, accessible
            communities and long-term real-estate value.
          </p>
        </div>
      </section>

      {/* HILLTOP GARDENS */}
      <section className="bg-[#080808]">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            {/* VISUAL */}
            <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#111111]">
              <div className="flex aspect-[16/11] items-center justify-center bg-gradient-to-br from-[#171717] via-[#101010] to-[#080808] p-8">
                <div className="text-center">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-[#f59e0b]/20 to-[#dc2626]/20">
                    <Building2
                      size={38}
                      className="text-[#f59e0b]"
                    />
                  </div>

                  <h2 className="mt-6 text-3xl font-black md:text-4xl">
                    Hilltop Gardens
                  </h2>

                  <p className="mt-2 text-sm font-bold uppercase tracking-[0.18em] text-[#f59e0b]">
                    Estate
                  </p>

                  <div className="mx-auto mt-6 h-1 w-28 rounded-full bg-gradient-to-r from-[#f59e0b] via-[#f97316] to-[#dc2626]" />
                </div>
              </div>

              <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[#f59e0b] via-[#f97316] to-[#dc2626]" />
            </div>

            {/* CONTENT */}
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#f59e0b]">
                Featured Development
              </p>

              <h2 className="mt-4 text-3xl font-black md:text-5xl">
                Hilltop Gardens Estate
              </h2>

              <div className="mt-5 flex items-start gap-3 text-white/55">
                <MapPin
                  size={20}
                  className="mt-1 shrink-0 text-[#f59e0b]"
                />

                <p className="leading-7">
                  Odo Elewu Junction, off Iloti Road, Epe,
                  Lagos State.
                </p>
              </div>

              <p className="mt-6 leading-8 text-white/50">
                Hilltop Gardens is one of Zertop Limited&apos;s
                real-estate developments in the Epe growth corridor,
                designed around accessibility, infrastructure and
                residential opportunity.
              </p>

              <p className="mt-4 leading-8 text-white/50">
                The estate is positioned close to educational
                institutions, transport links and other developments
                within Epe, providing potential homeowners and
                investors with access to a rapidly developing area.
              </p>

              <button
                type="button"
                onClick={onProperties}
                className="mt-8 flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#f59e0b] via-[#f97316] to-[#dc2626] px-6 py-3.5 font-bold transition hover:brightness-110"
              >
                View Available Properties
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* HILLTOP FEATURES */}
      <section className="border-y border-white/10 bg-[#0d0d0d]">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-6">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* FEATURES */}
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#f59e0b]">
                Estate Features
              </p>

              <h2 className="mt-4 text-3xl font-bold md:text-4xl">
                Infrastructure designed for better living.
              </h2>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {hilltopFeatures.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#080808] p-4"
                  >
                    <CheckCircle2
                      size={20}
                      className="shrink-0 text-[#f59e0b]"
                    />

                    <span className="text-sm font-medium text-white/65">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* PROXIMITY */}
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#f59e0b]">
                Close Proximity
              </p>

              <h2 className="mt-4 text-3xl font-bold md:text-4xl">
                Connected to important locations in Epe.
              </h2>

              <div className="mt-8 space-y-4">
                {nearbyPlaces.map((place) => (
                  <div
                    key={place}
                    className="flex items-center gap-4 rounded-xl border border-white/10 bg-[#080808] p-4"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#f59e0b]/10">
                      <Route
                        size={20}
                        className="text-[#f59e0b]"
                      />
                    </div>

                    <span className="text-sm font-medium text-white/65">
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
      <section className="bg-[#080808]">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-6">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#f59e0b]">
              Hilltop Gardens
            </p>

            <h2 className="mt-4 text-3xl font-bold md:text-4xl">
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
      <section className="border-y border-white/10 bg-[#0d0d0d]">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-6">
          <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#111111] p-8 md:p-12">
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#f59e0b]/10 blur-[100px]" />

            <div className="pointer-events-none absolute -bottom-24 left-20 h-72 w-72 rounded-full bg-[#dc2626]/10 blur-[100px]" />

            <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-[#f59e0b]/20 to-[#dc2626]/20">
                  <Sparkles
                    size={34}
                    className="text-[#f59e0b]"
                  />
                </div>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#f59e0b]">
                  Development Portfolio
                </p>

                <h2 className="mt-4 text-3xl font-black md:text-5xl">
                  Ocean&apos;s Whisper
                </h2>

                <p className="mt-5 max-w-2xl leading-8 text-white/50">
                  Ocean&apos;s Whisper is included in Zertop
                  Limited&apos;s supplied development portfolio.
                  Additional information about location, property
                  types, pricing and estate features can be published
                  as the project information becomes available.
                </p>

                <button
                  type="button"
                  onClick={onContact}
                  className="mt-7 rounded-xl border border-[#f59e0b]/40 bg-[#f59e0b]/10 px-6 py-3.5 font-semibold text-[#f59e0b] transition hover:bg-[#f59e0b]/15"
                >
                  Enquire About This Development
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DEVELOPMENT APPROACH */}
      <section className="bg-[#080808]">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-6">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#f59e0b]">
                Our Approach
              </p>

              <h2 className="mt-4 text-3xl font-bold md:text-4xl">
                Developments positioned for tomorrow.
              </h2>
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
      <section className="border-t border-white/10 bg-[#0d0d0d]">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-6">
          <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#111111] p-8 md:p-12">
            <div className="absolute right-[-100px] top-[-80px] h-64 w-64 rotate-[-35deg] bg-gradient-to-r from-[#f59e0b] to-[#f97316] opacity-10" />

            <div className="absolute right-[-130px] top-[110px] h-48 w-64 rotate-[-35deg] bg-[#dc2626] opacity-10" />

            <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[1fr_auto]">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#f59e0b]">
                  Find Your Opportunity
                </p>

                <h2 className="mt-4 max-w-2xl text-3xl font-bold md:text-4xl">
                  Interested in a Zertop development?
                </h2>

                <p className="mt-4 max-w-2xl leading-7 text-white/45">
                  Explore available properties or contact the Zertop
                  team for information about current developments and
                  investment opportunities.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={onProperties}
                  className="rounded-xl bg-gradient-to-r from-[#f59e0b] via-[#f97316] to-[#dc2626] px-6 py-3.5 font-bold transition hover:brightness-110"
                >
                  View Properties
                </button>

                <button
                  onClick={onContact}
                  className="rounded-xl border border-white/15 bg-white/[0.03] px-6 py-3.5 font-semibold text-white/80 transition hover:border-[#f59e0b]/50"
                >
                  Contact Zertop
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-[#050505]">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-10 md:flex-row md:items-end md:justify-between md:px-6">
          <div>
            <img
              src="/zertop-logo.png"
              alt="Zertop Limited"
              className="h-12 w-auto object-contain"
            />

            <p className="mt-4 max-w-md text-sm leading-6 text-white/35">
              Real Estate & Property Development.
              Building brighter tomorrows.
            </p>
          </div>

          <div className="text-sm text-white/30 md:text-right">
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
  icon: React.ReactNode;
  title: string;
  text: string;
};

function DevelopmentValueCard({
  icon,
  title,
  text,
}: DevelopmentValueCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#111111] p-7">
      <div className="text-[#f59e0b]">
        {icon}
      </div>

      <h3 className="mt-5 text-xl font-semibold">
        {title}
      </h3>

      <p className="mt-3 leading-7 text-white/45">
        {text}
      </p>
    </div>
  );
}

type ApproachCardProps = {
  icon: React.ReactNode;
  title: string;
  text: string;
};

function ApproachCard({
  icon,
  title,
  text,
}: ApproachCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#111111] p-6">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f59e0b]/10 text-[#f59e0b]">
        {icon}
      </div>

      <h3 className="mt-5 font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-white/40">
        {text}
      </p>
    </div>
  );
}