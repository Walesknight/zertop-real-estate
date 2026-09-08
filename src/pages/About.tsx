import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Globe2,
  Landmark,
  MapPin,
  ShieldCheck,
  Sparkles,
  Target,
  UserRound,
} from "lucide-react";

type AboutProps = {
  onBack: () => void;
  onProperties: () => void;
  onDevelopments: () => void;
  onContact: () => void;
};

export default function About({
  onBack,
  onProperties,
  onDevelopments,
  onContact,
}: AboutProps) {
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
              onClick={onDevelopments}
              className="text-sm text-white/70 transition hover:text-[#f59e0b]"
            >
              Developments
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

        <div className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-[#f59e0b]/10 blur-[110px]" />

        <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-[#dc2626]/10 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-5 py-20 md:px-6 md:py-24">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#f59e0b]">
            About Zertop Limited
          </p>

          <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight md:text-6xl">
            Building brighter tomorrows through{" "}
            <span className="bg-gradient-to-r from-[#f59e0b] via-[#f97316] to-[#dc2626] bg-clip-text text-transparent">
              real estate.
            </span>
          </h1>

          <p className="mt-6 max-w-3xl text-base leading-8 text-white/50 md:text-lg">
            Zertop Limited is a real-estate and property
            development company focused on creating
            valuable opportunities for individuals,
            families and investors through strategic
            developments, property management and
            investment-focused solutions.
          </p>
        </div>
      </section>

      {/* COMPANY STORY */}
      <section className="bg-[#080808]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 md:px-6 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#f59e0b]">
              Our Story
            </p>

            <h2 className="mt-4 text-3xl font-bold leading-tight md:text-4xl">
              A growing real-estate company built around
              opportunity and long-term value.
            </h2>

            <p className="mt-6 leading-8 text-white/50">
              Zertop Limited was established on
              August 23, 2016, with a focus on real-estate
              development, property management and
              investment consultancy.
            </p>

            <p className="mt-4 leading-8 text-white/50">
              Since inception, the company has continued
              to position itself around strategic
              locations, innovative housing concepts and
              property investment opportunities designed
              for a growing market.
            </p>

            <p className="mt-4 leading-8 text-white/50">
              Through its developments and partnerships,
              Zertop aims to create communities and
              property opportunities that combine
              accessibility, investment potential and
              future-focused development.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <InfoCard
              icon={<Landmark size={24} />}
              title="Established"
              value="2016"
              description="Building property and investment opportunities since 2016."
            />

            <InfoCard
              icon={<Building2 size={24} />}
              title="Core Business"
              value="Real Estate"
              description="Property development, management and investment solutions."
            />

            <InfoCard
              icon={<MapPin size={24} />}
              title="Key Market"
              value="Lagos"
              description="Developments focused on strategic growth corridors."
            />

            <InfoCard
              icon={<Globe2 size={24} />}
              title="Outlook"
              value="Global"
              description="A growing vision extending beyond the Nigerian market."
            />
          </div>
        </div>
      </section>

      {/* WHAT WE DO */}
      <section className="border-y border-white/10 bg-[#0d0d0d]">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-6">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#f59e0b]">
              What We Do
            </p>

            <h2 className="mt-4 text-3xl font-bold md:text-4xl">
              Real-estate solutions built around growth.
            </h2>

            <p className="mt-5 leading-8 text-white/50">
              Zertop operates across key areas of the
              property value chain, helping clients and
              investors identify, secure and manage
              real-estate opportunities.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <ServiceCard
              icon={<Building2 size={26} />}
              title="Property Development"
              description="Residential estates, housing developments and future-focused property projects."
            />

            <ServiceCard
              icon={<ShieldCheck size={26} />}
              title="Property Management"
              description="Structured support for the management and administration of property assets."
            />

            <ServiceCard
              icon={<Target size={26} />}
              title="Investment Consultancy"
              description="Helping investors identify suitable real-estate opportunities and strategic locations."
            />
          </div>
        </div>
      </section>

      {/* FOUNDER */}
      <section className="bg-[#080808]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 md:px-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#111111] p-8">
            <div className="absolute right-[-80px] top-[-60px] h-48 w-48 rounded-full bg-[#f59e0b]/10 blur-3xl" />

            <div className="relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f59e0b]/20 to-[#dc2626]/20">
                <UserRound
                  size={32}
                  className="text-[#f59e0b]"
                />
              </div>

              <p className="mt-7 text-xs font-bold uppercase tracking-[0.2em] text-[#f59e0b]">
                Founder & CEO
              </p>

              <h2 className="mt-3 text-3xl font-black">
                Chamberlain Joseph
              </h2>

              <p className="mt-4 leading-7 text-white/45">
                Leading Zertop Limited with a vision
                focused on property development,
                investment opportunities and sustainable
                growth.
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#f59e0b]">
              Leadership
            </p>

            <h2 className="mt-4 text-3xl font-bold leading-tight md:text-4xl">
              Building with vision, strategy and
              long-term ambition.
            </h2>

            <p className="mt-6 leading-8 text-white/50">
              Under the leadership of Chamberlain
              Joseph, Zertop Limited has continued to
              pursue opportunities in real-estate
              development, investment and strategic
              expansion.
            </p>

            <p className="mt-4 leading-8 text-white/50">
              His leadership approach emphasizes value
              creation, strategic positioning and the
              development of properties and communities
              capable of supporting long-term growth.
            </p>

            <p className="mt-4 leading-8 text-white/50">
              The company's direction reflects a broader
              ambition to strengthen its presence in
              Nigeria while developing relationships and
              opportunities across international markets.
            </p>
          </div>
        </div>
      </section>

      {/* VISION */}
      <section className="border-y border-white/10 bg-[#0d0d0d]">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-6">
          <div className="grid gap-6 md:grid-cols-3">
            <VisionCard
              icon={<Target size={25} />}
              title="Our Vision"
              text="To create valuable real-estate opportunities and developments that support long-term growth, investment and better communities."
            />

            <VisionCard
              icon={<Sparkles size={25} />}
              title="Innovation"
              text="To embrace modern technology, improved property experiences and new approaches that make real estate more accessible and efficient."
            />

            <VisionCard
              icon={<ShieldCheck size={25} />}
              title="Our Commitment"
              text="To provide property solutions built around transparency, strategic value and a professional client experience."
            />
          </div>
        </div>
      </section>

      {/* GLOBAL FOOTPRINT */}
      <section className="bg-[#080808]">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-6">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#f59e0b]">
              Our Footprint
            </p>

            <h2 className="mt-4 text-3xl font-bold md:text-4xl">
              Building from Lagos with a broader
              international outlook.
            </h2>

            <p className="mt-5 leading-8 text-white/50">
              Zertop's growth vision extends beyond its
              Nigerian operations, with the company's
              supplied profile highlighting opportunities
              and relationships across selected
              international markets.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {[
              "Lagos, Nigeria",
              "Ibeju-Lekki / Epe",
              "London, United Kingdom",
              "Kigali, Rwanda",
              "Nairobi, Kenya",
            ].map((location) => (
              <div
                key={location}
                className="rounded-2xl border border-white/10 bg-[#111111] p-5"
              >
                <MapPin
                  size={22}
                  className="text-[#f59e0b]"
                />

                <p className="mt-4 font-semibold">
                  {location}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY INVEST */}
      <section className="border-y border-white/10 bg-[#0d0d0d]">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-6">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#f59e0b]">
                Why Zertop
              </p>

              <h2 className="mt-4 text-3xl font-bold md:text-4xl">
                Property opportunities designed around
                value.
              </h2>
            </div>

            <div className="space-y-4">
              {[
                "Strategic property locations",
                "Flexible payment structures",
                "Master-planned development concepts",
                "Investment-focused real-estate opportunities",
                "Customer-focused property support",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#080808] p-4"
                >
                  <CheckCircle2
                    size={20}
                    className="shrink-0 text-[#f59e0b]"
                  />

                  <span className="text-sm text-white/65">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#080808]">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-6">
          <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#111111] p-8 md:p-12">
            <div className="absolute right-[-100px] top-[-80px] h-64 w-64 rotate-[-35deg] bg-gradient-to-r from-[#f59e0b] to-[#f97316] opacity-10" />

            <div className="absolute right-[-120px] top-[110px] h-48 w-64 rotate-[-35deg] bg-[#dc2626] opacity-10" />

            <div className="relative z-10 grid items-center gap-8 lg:grid-cols-[1fr_auto]">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#f59e0b]">
                  Explore Zertop
                </p>

                <h2 className="mt-4 max-w-2xl text-3xl font-bold md:text-4xl">
                  Discover our properties and
                  developments.
                </h2>

                <p className="mt-4 max-w-2xl leading-7 text-white/45">
                  Explore current listings, development
                  opportunities and available investment
                  options.
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
                  onClick={onDevelopments}
                  className="rounded-xl border border-white/15 bg-white/[0.03] px-6 py-3.5 font-semibold text-white/80 transition hover:border-[#f59e0b]/50"
                >
                  Developments
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

type InfoCardProps = {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
};

function InfoCard({
  icon,
  title,
  value,
  description,
}: InfoCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#111111] p-6">
      <div className="text-[#f59e0b]">
        {icon}
      </div>

      <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-white/30">
        {title}
      </p>

      <p className="mt-2 text-2xl font-bold">
        {value}
      </p>

      <p className="mt-3 text-sm leading-6 text-white/40">
        {description}
      </p>
    </div>
  );
}

type ServiceCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

function ServiceCard({
  icon,
  title,
  description,
}: ServiceCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#080808] p-7">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#f59e0b]/20 to-[#dc2626]/15 text-[#f59e0b]">
        {icon}
      </div>

      <h3 className="mt-5 text-xl font-semibold">
        {title}
      </h3>

      <p className="mt-3 leading-7 text-white/45">
        {description}
      </p>
    </div>
  );
}

type VisionCardProps = {
  icon: React.ReactNode;
  title: string;
  text: string;
};

function VisionCard({
  icon,
  title,
  text,
}: VisionCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#080808] p-7">
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