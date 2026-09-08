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
              onClick={onDevelopments}
              className="text-sm text-white/70 transition hover:text-[#f59e0b]"
            >
              Developments
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
            Contact Zertop
          </p>

          <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight md:text-6xl">
            Start a conversation about your{" "}
            <span className="bg-gradient-to-r from-[#f59e0b] via-[#f97316] to-[#dc2626] bg-clip-text text-transparent">
              property goals.
            </span>
          </h1>

          <p className="mt-6 max-w-3xl text-base leading-8 text-white/50 md:text-lg">
            Contact Zertop Limited for property enquiries,
            inspections, investment opportunities and
            information about our developments.
          </p>
        </div>
      </section>

      {/* CONTACT CARDS */}
      <section className="bg-[#080808]">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <ContactCard
              icon={<Phone size={25} />}
              title="Call Us"
            >
              <a
                href="tel:+2348135420099"
                className="block hover:text-[#f59e0b]"
              >
                0813 542 0099
              </a>

              <a
                href="tel:+2349054787868"
                className="mt-1 block hover:text-[#f59e0b]"
              >
                0905 478 7868
              </a>

              <a
                href="tel:+2349042509860"
                className="mt-1 block hover:text-[#f59e0b]"
              >
                0904 250 9860
              </a>
            </ContactCard>

            <ContactCard
              icon={<Mail size={25} />}
              title="Email"
            >
              <a
                href="mailto:admin@zertop.com.ng"
                className="block break-all hover:text-[#f59e0b]"
              >
                admin@zertop.com.ng
              </a>

              <a
                href="mailto:zertopreal@gmail.com"
                className="mt-2 block break-all hover:text-[#f59e0b]"
              >
                zertopreal@gmail.com
              </a>
            </ContactCard>

            <ContactCard
              icon={<Globe2 size={25} />}
              title="Website"
            >
              <p>www.zertop.com.ng</p>
            </ContactCard>

            <ContactCard
              icon={<MessageCircle size={25} />}
              title="WhatsApp"
            >
              <button
                type="button"
                onClick={openWhatsApp}
                className="font-semibold text-[#f59e0b] hover:text-[#f97316]"
              >
                Chat with Zertop
              </button>
            </ContactCard>
          </div>
        </div>
      </section>

      {/* OFFICE */}
      <section className="border-y border-white/10 bg-[#0d0d0d]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 md:px-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#f59e0b]">
              Visit Our Office
            </p>

            <h2 className="mt-4 text-3xl font-bold md:text-4xl">
              Zertop Limited, Lagos.
            </h2>

            <p className="mt-5 max-w-lg leading-8 text-white/50">
              Visit the Zertop team for property discussions,
              development enquiries and investment consultations.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#111111] p-7 md:p-10">
            <div className="absolute right-[-80px] top-[-60px] h-52 w-52 rounded-full bg-[#f59e0b]/10 blur-3xl" />

            <div className="relative flex gap-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f59e0b]/10">
                <MapPin
                  size={25}
                  className="text-[#f59e0b]"
                />
              </div>

              <div>
                <p className="text-sm font-semibold text-white/40">
                  Office Address
                </p>

                <p className="mt-3 max-w-xl text-lg font-semibold leading-8">
                  Suite B31 & B32, 1st Floor,
                  Royale Plaza International, Bogije,
                  Km 35, Lekki-Epe Expressway,
                  Lagos, Nigeria.
                </p>

                <p className="mt-4 text-sm leading-6 text-white/40">
                  Ibeju-Lekki / Lekki-Epe corridor.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK ENQUIRY */}
      <section className="bg-[#080808]">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-6">
          <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#111111] p-8 md:p-12">
            <div className="absolute right-[-100px] top-[-80px] h-64 w-64 rotate-[-35deg] bg-gradient-to-r from-[#f59e0b] to-[#f97316] opacity-10" />

            <div className="absolute right-[-130px] top-[110px] h-48 w-64 rotate-[-35deg] bg-[#dc2626] opacity-10" />

            <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[1fr_auto]">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#f59e0b]">
                  Quick Enquiry
                </p>

                <h2 className="mt-4 max-w-2xl text-3xl font-bold md:text-4xl">
                  Found a property or development that
                  interests you?
                </h2>

                <p className="mt-4 max-w-2xl leading-7 text-white/45">
                  Speak directly with the Zertop team
                  through WhatsApp for property details,
                  payment information and inspections.
                </p>
              </div>

              <button
                type="button"
                onClick={openWhatsApp}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#16a34a] px-7 py-4 font-bold transition hover:bg-[#15803d]"
              >
                <MessageCircle size={19} />
                Chat on WhatsApp
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* EXPLORE */}
      <section className="border-t border-white/10 bg-[#0d0d0d]">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-6">
          <div className="grid gap-6 md:grid-cols-2">
            <button
              type="button"
              onClick={onProperties}
              className="group rounded-2xl border border-white/10 bg-[#080808] p-7 text-left transition hover:border-[#f59e0b]/40"
            >
              <Building2
                size={27}
                className="text-[#f59e0b]"
              />

              <h3 className="mt-5 text-xl font-semibold">
                Browse Properties
              </h3>

              <p className="mt-3 leading-7 text-white/40">
                Explore currently available Zertop
                property opportunities.
              </p>
            </button>

            <button
              type="button"
              onClick={onDevelopments}
              className="group rounded-2xl border border-white/10 bg-[#080808] p-7 text-left transition hover:border-[#f59e0b]/40"
            >
              <MapPin
                size={27}
                className="text-[#f59e0b]"
              />

              <h3 className="mt-5 text-xl font-semibold">
                Our Developments
              </h3>

              <p className="mt-3 leading-7 text-white/40">
                Discover Hilltop Gardens and Zertop's
                growing development portfolio.
              </p>
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-[#050505]">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-10 md:flex-row md:items-end md:justify-between md:px-6">
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

type ContactCardProps = {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
};

function ContactCard({
  icon,
  title,
  children,
}: ContactCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#111111] p-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#f59e0b]/20 to-[#dc2626]/15 text-[#f59e0b]">
        {icon}
      </div>

      <h3 className="mt-5 text-lg font-semibold">
        {title}
      </h3>

      <div className="mt-3 text-sm leading-6 text-white/45">
        {children}
      </div>
    </div>
  );
}