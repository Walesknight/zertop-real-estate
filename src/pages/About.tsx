import type { ReactNode } from "react";

import {
  Building2,
  CheckCircle2,
  Globe2,
  Landmark,
  MapPin,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";

import PublicNavbar, {
  type PublicNavigationProps,
} from "../components/PublicNavbar";

import PublicFooter from "../components/PublicFooter";

type AboutProps = PublicNavigationProps;

type TeamMember = {
  name: string;
  role: string;
  image: string;
  bio: string;
};

const teamMembers: TeamMember[] = [
  {
    name: "Ekwere Florence",
    role: "Secretary",
    image: "/team/florence-ekwere.jpeg",
    bio: "Supports the administrative coordination of Zertop Limited, helping maintain organised communication, documentation and day-to-day office operations. Her role contributes to efficient internal processes and professional client support.",
  },
  {
    name: "Mbamara Benita",
    role: "Assistant Marketer",
    image: "/team/benita-mbamara.jpeg",
    bio: "Supports Zertop's marketing activities by assisting with property promotion, client engagement and campaign execution. She helps communicate available property opportunities and supports the marketing team in reaching prospective buyers and investors.",
  },
  {
    name: "Osauyi Faith",
    role: "Chief Marketer",
    image: "/team/faith-osauyi.jpeg",
    bio: "Leads marketing and property promotion activities for Zertop Limited, coordinating campaigns, client engagement and market outreach. Her role focuses on strengthening visibility for the company's developments and connecting prospective clients with suitable opportunities.",
  },
];

export default function About({
  onHome,
  onProperties,
  onDevelopments,
  onWhyZertop,
  onAbout,
  onContact,
  onStaffLogin,
}: AboutProps) {
  return (
    <div className="min-h-screen bg-white text-[#0b1b35]">
      <PublicNavbar
        onHome={onHome}
        onProperties={onProperties}
        onDevelopments={onDevelopments}
        onWhyZertop={onWhyZertop}
        onAbout={onAbout}
        onContact={onContact}
        onStaffLogin={onStaffLogin}
      />

      <main>
        {/* HERO */}
        <section className="relative overflow-hidden border-b border-gray-200 bg-[#fffaf5]">
          <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-[#f5a400] via-[#f97316] to-[#ef233c]" />

          <div className="pointer-events-none absolute -left-24 top-8 h-80 w-80 rounded-full bg-yellow-100/70 blur-[100px]" />
          <div className="pointer-events-none absolute -right-20 top-0 h-80 w-80 rounded-full bg-red-100/60 blur-[110px]" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-20 md:px-6 md:py-24 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#f97316]">
                About Zertop Limited
              </p>

              <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight text-[#0b1b35] md:text-6xl">
                Building brighter tomorrows through{" "}
                <span className="bg-gradient-to-r from-[#f5a400] via-[#f97316] to-[#ef233c] bg-clip-text text-transparent">
                  real estate.
                </span>
              </h1>

              <p className="mt-6 max-w-3xl text-base leading-8 text-gray-600 md:text-lg">
                Zertop Limited is a real-estate and property
                development company focused on creating valuable
                opportunities for individuals, families and investors
                through strategic developments, property management and
                investment-focused solutions.
              </p>
            </div>

            <div className="rounded-[30px] border border-orange-100 bg-white p-8 shadow-[0_25px_70px_rgba(15,23,42,0.08)]">
              <img
                src="/zertop-logo.png"
                alt="Zertop Limited"
                className="h-20 w-auto object-contain"
              />

              <div className="mt-8 border-t border-gray-100 pt-6">
                <p className="text-sm leading-7 text-gray-600">
                  Real Estate & Property Development
                </p>

                <p className="mt-2 text-lg font-bold text-[#0b1b35]">
                  Building opportunities around property, investment
                  and long-term value.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* COMPANY STORY */}
        <section className="bg-white">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 md:px-6 lg:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#f97316]">
                Our Story
              </p>

              <h2 className="mt-4 text-3xl font-black leading-tight text-[#0b1b35] md:text-4xl">
                A growing real-estate company built around opportunity
                and long-term value.
              </h2>

              <p className="mt-6 leading-8 text-gray-600">
                Zertop Limited was established on August 23, 2016,
                with a focus on real-estate development, property
                management and investment consultancy.
              </p>

              <p className="mt-4 leading-8 text-gray-600">
                Since inception, the company has continued to position
                itself around strategic locations, innovative housing
                concepts and property investment opportunities designed
                for a growing market.
              </p>

              <p className="mt-4 leading-8 text-gray-600">
                Through its developments and partnerships, Zertop aims
                to create communities and property opportunities that
                combine accessibility, investment potential and
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
        <section className="border-y border-gray-200 bg-[#f8fafc]">
          <div className="mx-auto max-w-7xl px-5 py-20 md:px-6">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#f97316]">
                What We Do
              </p>

              <h2 className="mt-4 text-3xl font-black text-[#0b1b35] md:text-4xl">
                Real-estate solutions built around growth.
              </h2>

              <p className="mt-5 leading-8 text-gray-600">
                Zertop operates across key areas of the property value
                chain, helping clients and investors identify, secure
                and manage real-estate opportunities.
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

        {/* LEADERSHIP */}
        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-5 py-20 md:px-6">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#f97316]">
                Leadership
              </p>

              <h2 className="mt-4 text-3xl font-black leading-tight text-[#0b1b35] md:text-4xl">
                Leadership focused on growth, strategy and long-term
                value.
              </h2>

              <p className="mt-5 leading-8 text-gray-600">
                Zertop Limited is led by a management team focused on
                strategic growth, property development, market expansion
                and delivering long-term value to clients and investors.
              </p>
            </div>

            <div className="mt-10 grid gap-8 lg:grid-cols-2">
              {/* MANAGING DIRECTOR */}
              <article className="overflow-hidden rounded-[30px] border border-gray-200 bg-white shadow-sm">
                <div className="relative overflow-hidden bg-gray-100">
                  <img
                    src="/team/chamberling-joseph.jpeg"
                    alt="Chamberling Joseph"
                    className="aspect-[4/5] w-full object-cover object-top"
                  />

                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0b1b35]/90 via-[#0b1b35]/35 to-transparent px-6 pb-6 pt-24 text-white">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-200">
                      Managing Director
                    </p>

                    <h3 className="mt-2 text-2xl font-black">
                      Chamberling Joseph
                    </h3>
                  </div>
                </div>

                <div className="p-7 md:p-8">
                  <p className="leading-8 text-gray-600">
                    Provides strategic leadership for Zertop Limited,
                    guiding property development, investment initiatives,
                    partnerships and long-term growth. His role focuses on
                    positioning the company around sustainable real-estate
                    opportunities and strong client value.
                  </p>

                  <p className="mt-4 leading-8 text-gray-600">
                    Under his leadership, Zertop continues to pursue
                    opportunities in property development, investment and
                    strategic expansion while strengthening its presence
                    in the real-estate market.
                  </p>
                </div>
              </article>

              {/* EXECUTIVE DIRECTOR */}
              <article className="overflow-hidden rounded-[30px] border border-gray-200 bg-[#fffaf5] shadow-sm">
                <div className="relative overflow-hidden bg-gray-100">
                  <img
                    src="/team/emem-joseph-chamberlain.jpeg"
                    alt="Emem Joseph Chamberlain"
                    className="aspect-[4/5] w-full object-cover object-top"
                  />

                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0b1b35]/90 via-[#0b1b35]/35 to-transparent px-6 pb-6 pt-24 text-white">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-200">
                      Executive Director
                    </p>

                    <h3 className="mt-2 text-2xl font-black">
                      Emem Joseph Chamberlain
                    </h3>
                  </div>
                </div>

                <div className="p-7 md:p-8">
                  <p className="leading-8 text-gray-600">
                    Supports the executive leadership of Zertop Limited,
                    contributing to strategic planning, business growth,
                    operational coordination and the advancement of the
                    company&apos;s real-estate objectives.
                  </p>

                  <p className="mt-4 leading-8 text-gray-600">
                    Her role helps strengthen management execution,
                    stakeholder relationships and the company&apos;s focus on
                    delivering professional property solutions and
                    sustainable long-term value.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* TEAM */}
        <section className="border-y border-gray-200 bg-[#f8fafc]">
          <div className="mx-auto max-w-7xl px-5 py-20 md:px-6">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#f97316]">
                Our Team
              </p>

              <h2 className="mt-4 text-3xl font-black text-[#0b1b35] md:text-4xl">
                The people supporting Zertop&apos;s growth.
              </h2>

              <p className="mt-5 leading-8 text-gray-600">
                Our team supports the company across administration,
                marketing, client engagement and property promotion.
              </p>
            </div>

            <div className="mt-10 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {teamMembers.map((member) => (
                <article
                  key={member.name}
                  className="group overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl"
                >
                  <div className="overflow-hidden bg-gray-100">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="aspect-[4/5] w-full object-cover object-top transition duration-500 group-hover:scale-[1.02]"
                    />
                  </div>

                  <div className="p-6">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#f97316]">
                      {member.role}
                    </p>

                    <h3 className="mt-2 text-2xl font-black text-[#0b1b35]">
                      {member.name}
                    </h3>

                    <p className="mt-4 text-sm leading-7 text-gray-600">
                      {member.bio}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* VISION */}
        <section className="bg-white">
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
        <section className="border-y border-gray-200 bg-[#f8fafc]">
          <div className="mx-auto max-w-7xl px-5 py-20 md:px-6">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#f97316]">
                Our Footprint
              </p>

              <h2 className="mt-4 text-3xl font-black text-[#0b1b35] md:text-4xl">
                Building from Lagos with a broader international
                outlook.
              </h2>

              <p className="mt-5 leading-8 text-gray-600">
                Zertop&apos;s growth vision extends beyond its Nigerian
                operations, with the company&apos;s supplied profile
                highlighting opportunities and relationships across
                selected international markets.
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
                  className="rounded-3xl border border-gray-200 bg-white p-5 transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-md"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50">
                    <MapPin
                      size={22}
                      className="text-[#f97316]"
                    />
                  </div>

                  <p className="mt-4 font-bold text-[#0b1b35]">
                    {location}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHY ZERTOP */}
        <section className="bg-[#fffaf5]">
          <div className="mx-auto max-w-7xl px-5 py-20 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#f97316]">
                  Why Zertop
                </p>

                <h2 className="mt-4 text-3xl font-black text-[#0b1b35] md:text-4xl">
                  Property opportunities designed around value.
                </h2>

                <p className="mt-5 max-w-xl leading-8 text-gray-600">
                  Zertop&apos;s approach combines strategic locations,
                  flexible property opportunities and professional
                  support throughout the property journey.
                </p>
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
                    className="flex items-center gap-3 rounded-2xl border border-orange-100 bg-white p-4 shadow-sm"
                  >
                    <CheckCircle2
                      size={20}
                      className="shrink-0 text-[#f97316]"
                    />

                    <span className="text-sm font-semibold text-gray-700">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-5 py-20 md:px-6">
            <div className="relative overflow-hidden rounded-[30px] bg-gradient-to-r from-[#f5a400] via-[#f97316] to-[#ef233c] p-8 text-white shadow-xl md:p-12">
              <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full border-[35px] border-white/10" />

              <div className="relative z-10 grid items-center gap-8 lg:grid-cols-[1fr_auto]">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/75">
                    Explore Zertop
                  </p>

                  <h2 className="mt-4 max-w-2xl text-3xl font-black md:text-4xl">
                    Discover our properties and developments.
                  </h2>

                  <p className="mt-4 max-w-2xl leading-7 text-white/85">
                    Explore current listings, development opportunities
                    and available investment options.
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
                    onClick={onDevelopments}
                    className="rounded-xl border border-white/40 bg-white/10 px-6 py-3.5 font-bold text-white backdrop-blur"
                  >
                    Developments
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter
        onHome={onHome}
        onProperties={onProperties}
        onDevelopments={onDevelopments}
        onWhyZertop={onWhyZertop}
        onAbout={onAbout}
        onContact={onContact}
      />
    </div>
  );
}

type InfoCardProps = {
  icon: ReactNode;
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
    <div className="rounded-3xl border border-gray-200 bg-[#f8fafc] p-6 transition hover:border-orange-200 hover:bg-white hover:shadow-md">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-[#f97316]">
        {icon}
      </div>

      <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-gray-400">
        {title}
      </p>

      <p className="mt-2 text-2xl font-black text-[#0b1b35]">
        {value}
      </p>

      <p className="mt-3 text-sm leading-6 text-gray-500">
        {description}
      </p>
    </div>
  );
}

type ServiceCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
};

function ServiceCard({
  icon,
  title,
  description,
}: ServiceCardProps) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-[#f97316]">
        {icon}
      </div>

      <h3 className="mt-5 text-xl font-bold text-[#0b1b35]">
        {title}
      </h3>

      <p className="mt-3 leading-7 text-gray-600">
        {description}
      </p>
    </div>
  );
}

type VisionCardProps = {
  icon: ReactNode;
  title: string;
  text: string;
};

function VisionCard({
  icon,
  title,
  text,
}: VisionCardProps) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">
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
