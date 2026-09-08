import { useEffect, useState } from "react";

import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  Clock3,
  House,
  MapPin,
  Menu,
  MessageCircle,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";

import { supabase } from "../lib/supabase";

type HomeProps = {
  onBrowseProperties: () => void;
  onStaffLogin: () => void;
  onViewProperty: (propertyId: string) => void;
  onAbout: () => void;
  onDevelopments: () => void;
  onContact: () => void;
};

type FeaturedProperty = {
  id: string;
  title: string;
  property_type: string;
  listing_type: string;
  location: string | null;
  city: string | null;
  state: string | null;
  price: number;

  estates:
    | {
        name: string;
      }
    | {
        name: string;
      }[]
    | null;

  property_images:
    | {
        image_url: string;
        is_primary: boolean;
      }[]
    | null;
};

export default function Home({
  onBrowseProperties,
  onStaffLogin,
  onViewProperty,
  onAbout,
  onDevelopments,
  onContact,
}: HomeProps) {
  const [featuredProperties, setFeaturedProperties] = useState<
    FeaturedProperty[]
  >([]);

  const [featuredLoading, setFeaturedLoading] =
    useState(true);

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  useEffect(() => {
    loadFeaturedProperties();
  }, []);

  const loadFeaturedProperties = async () => {
    setFeaturedLoading(true);

    const { data, error } = await supabase
      .from("properties")
      .select(`
        id,
        title,
        property_type,
        listing_type,
        location,
        city,
        state,
        price,
        estates (
          name
        ),
        property_images (
          image_url,
          is_primary
        )
      `)
      .eq("status", "available")
      .order("created_at", { ascending: false })
      .limit(6);

    if (error) {
      console.error(
        "Featured properties error:",
        error
      );

      setFeaturedLoading(false);
      return;
    }

    setFeaturedProperties(
      (data || []) as FeaturedProperty[]
    );

    setFeaturedLoading(false);
  };

  const getFeaturedEstateName = (
    property: FeaturedProperty
  ) => {
    if (!property.estates) {
      return "Zertop Limited";
    }

    if (Array.isArray(property.estates)) {
      return (
        property.estates[0]?.name ||
        "Zertop Limited"
      );
    }

    return property.estates.name;
  };

  const getFeaturedImage = (
    property: FeaturedProperty
  ) => {
    const images =
      property.property_images || [];

    return (
      images.find(
        (image) => image.is_primary
      )?.image_url ||
      images[0]?.image_url ||
      null
    );
  };

  const getFeaturedLocation = (
    property: FeaturedProperty
  ) => {
    return (
      [
        property.location,
        property.city,
        property.state,
      ]
        .filter(Boolean)
        .join(", ") ||
      "Location available on request"
    );
  };

  const getListingLabel = (
    listingType: string
  ) => {
    if (listingType === "sale") {
      return "For Sale";
    }

    if (listingType === "rent") {
      return "For Rent";
    }

    if (listingType === "lease") {
      return "For Lease";
    }

    return listingType;
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#080808]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-6">
          {/* LOGO */}
          <button
            type="button"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
            className="flex items-center"
          >
            <img
              src="/zertop-logo.png"
              alt="Zertop Limited"
              className="h-11 w-auto object-contain md:h-12"
            />
          </button>

          {/* DESKTOP NAV */}
          <nav className="hidden items-center gap-7 lg:flex">
            <a
              href="#home"
              className="text-sm font-medium text-white"
            >
              Home
            </a>

            <button
              onClick={onBrowseProperties}
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

            <a
              href="#why-zertop"
              className="text-sm text-white/70 transition hover:text-[#f59e0b]"
            >
              Why Zertop
            </a>

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

            <button
              onClick={onStaffLogin}
              className="rounded-lg border border-white/15 px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-[#f59e0b] hover:text-[#f59e0b]"
            >
              Staff Login
            </button>
          </nav>

          {/* MOBILE BUTTON */}
          <button
            type="button"
            onClick={() =>
              setMobileMenuOpen(
                (current) => !current
              )
            }
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 lg:hidden"
          >
            {mobileMenuOpen ? (
              <X size={20} />
            ) : (
              <Menu size={20} />
            )}
          </button>
        </div>

        {/* MOBILE MENU */}
        {mobileMenuOpen && (
          <div className="border-t border-white/10 bg-[#0b0b0b] px-5 py-5 lg:hidden">
            <div className="flex flex-col gap-1">
              <a
                href="#home"
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className="rounded-lg px-3 py-3 text-sm text-white"
              >
                Home
              </a>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onBrowseProperties();
                }}
                className="rounded-lg px-3 py-3 text-left text-sm text-white/70"
              >
                Properties
              </button>

              <a
                href="#why-zertop"
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className="rounded-lg px-3 py-3 text-sm text-white/70"
              >
                Why Zertop
              </a>

              <a
                href="#about"
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className="rounded-lg px-3 py-3 text-sm text-white/70"
              >
                About
              </a>

              <a
                href="#contact"
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className="rounded-lg px-3 py-3 text-sm text-white/70"
              >
                Contact
              </a>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onStaffLogin();
                }}
                className="mt-3 rounded-lg border border-[#f59e0b]/50 px-4 py-3 text-sm font-semibold text-[#f59e0b]"
              >
                Staff Login
              </button>
            </div>
          </div>
        )}
      </header>

      {/* HERO */}
      <section
        id="home"
        className="relative overflow-hidden border-b border-white/10"
      >
        {/* GLOW */}
        <div className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-[#f59e0b]/10 blur-[120px]" />

        <div className="pointer-events-none absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-[#dc2626]/10 blur-[140px]" />

        {/* TOP ACCENT */}
        <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-[#f59e0b] via-[#f97316] to-[#dc2626]" />

        <div className="mx-auto grid min-h-[690px] max-w-7xl items-center gap-14 px-5 py-20 md:px-6 lg:grid-cols-2">
          {/* HERO CONTENT */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#f59e0b]/25 bg-[#f59e0b]/10 px-4 py-2 text-sm font-medium text-[#f59e0b]">
              <BadgeCheck size={16} />
              Real estate opportunities built for growth
            </div>

            <h1 className="mt-7 max-w-3xl text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
              Find property that builds your{" "}
              <span className="bg-gradient-to-r from-[#f59e0b] via-[#f97316] to-[#dc2626] bg-clip-text text-transparent">
                future.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-white/55 md:text-lg">
              Explore residential properties, land
              opportunities and investment developments
              from Zertop Limited in strategic and
              growing locations.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <button
                onClick={onBrowseProperties}
                className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#f59e0b] via-[#f97316] to-[#dc2626] px-6 py-3.5 font-bold text-white shadow-[0_12px_40px_rgba(249,115,22,0.18)] transition hover:brightness-110"
              >
                Browse Properties

                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>

              <button
                type="button"
                onClick={onContact}
                className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] px-6 py-3.5 font-semibold text-white/80 transition hover:border-white/30 hover:bg-white/[0.06]"
              >
              <MessageCircle size={18} />
                Make an Enquiry
              </button>
            </div>

            {/* HERO POINTS */}
            <div className="mt-12 grid max-w-xl grid-cols-3 gap-4 border-t border-white/10 pt-7">
              <div>
                <p className="text-lg font-bold md:text-2xl">
                  Quality
                </p>

                <p className="mt-1 text-xs text-white/40 md:text-sm">
                  Property options
                </p>
              </div>

              <div>
                <p className="text-lg font-bold md:text-2xl">
                  Flexible
                </p>

                <p className="mt-1 text-xs text-white/40 md:text-sm">
                  Payment plans
                </p>
              </div>

              <div>
                <p className="text-lg font-bold md:text-2xl">
                  Trusted
                </p>

                <p className="mt-1 text-xs text-white/40 md:text-sm">
                  Buying process
                </p>
              </div>
            </div>
          </div>

          {/* HERO CARD */}
          <div className="relative z-10">
            <div className="absolute -inset-1 rounded-[28px] bg-gradient-to-br from-[#f59e0b]/40 via-transparent to-[#dc2626]/30 blur-xl" />

            <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#111111] p-3 shadow-2xl">
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#090909] p-7">
                {/* DECORATIVE LINES */}
                <div className="absolute right-[-60px] top-[-45px] h-28 w-48 rotate-[-35deg] bg-gradient-to-r from-[#f59e0b] to-[#f97316] opacity-80" />

                <div className="absolute right-[-80px] top-[75px] h-20 w-48 rotate-[-35deg] bg-[#dc2626] opacity-70" />

                <div className="relative z-10">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#f59e0b]">
                    Zertop Properties
                  </p>

                  <h2 className="mt-4 max-w-md text-3xl font-bold">
                    Your next property may be one click
                    away.
                  </h2>

                  <p className="mt-4 max-w-md leading-7 text-white/50">
                    Browse live listings, compare
                    locations, review payment options and
                    contact our team directly.
                  </p>

                  <button
                    onClick={onBrowseProperties}
                    className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f59e0b] via-[#f97316] to-[#dc2626] px-5 py-3.5 font-bold transition hover:brightness-110"
                  >
                    <Search size={18} />
                    Explore Available Properties
                  </button>
                </div>
              </div>

              <div className="grid gap-3 p-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-5">
                  <MapPin
                    className="text-[#f59e0b]"
                    size={24}
                  />

                  <h3 className="mt-4 font-semibold">
                    Strategic Locations
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-white/40">
                    Properties positioned around
                    emerging growth corridors.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-5">
                  <ShieldCheck
                    className="text-[#dc2626]"
                    size={24}
                  />

                  <h3 className="mt-4 font-semibold">
                    Guided Process
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-white/40">
                    From enquiry to inspection and
                    acquisition.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PROPERTIES */}
      <section className="relative border-b border-white/10 bg-[#0b0b0b]">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#f59e0b]">
                Featured Properties
              </p>

              <h2 className="mt-4 text-3xl font-bold md:text-4xl">
                Explore our latest property{" "}
                <span className="text-[#f97316]">
                  opportunities.
                </span>
              </h2>

              <p className="mt-4 leading-7 text-white/45">
                Browse some of our currently available
                properties and find an opportunity that
                matches your plans.
              </p>
            </div>

            <button
              onClick={onBrowseProperties}
              className="group flex items-center gap-2 text-sm font-bold text-[#f59e0b]"
            >
              View All Properties

              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>
          </div>

          {featuredLoading ? (
            <div className="py-16 text-center text-white/35">
              Loading featured properties...
            </div>
          ) : featuredProperties.length === 0 ? (
            <div className="mt-10 rounded-2xl border border-white/10 bg-[#111111] p-10 text-center">
              <Building2
                className="mx-auto text-white/20"
                size={38}
              />

              <h3 className="mt-4 text-lg font-semibold">
                Properties coming soon
              </h3>

              <p className="mt-2 text-sm text-white/35">
                New Zertop listings will appear here.
              </p>
            </div>
          ) : (
            <div className="mt-10 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {featuredProperties.map(
                (property) => {
                  const image =
                    getFeaturedImage(property);

                  return (
                    <article
                      key={property.id}
                      className="group overflow-hidden rounded-2xl border border-white/10 bg-[#111111] shadow-[0_20px_60px_rgba(0,0,0,0.3)] transition duration-300 hover:-translate-y-1 hover:border-[#f59e0b]/40"
                    >
                      <div className="relative overflow-hidden">
                        {image ? (
                          <img
                            src={image}
                            alt={property.title}
                            className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex aspect-[16/10] items-center justify-center bg-[#181818] text-sm text-white/30">
                            Property Image Coming Soon
                          </div>
                        )}

                        {/* IMAGE OVERLAY */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                        <span className="absolute left-4 top-4 rounded-full bg-gradient-to-r from-[#f59e0b] to-[#dc2626] px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-lg">
                          {getListingLabel(
                            property.listing_type
                          )}
                        </span>
                      </div>

                      <div className="p-5">
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#f59e0b]">
                          {property.property_type}
                        </p>

                        <h3 className="mt-2 line-clamp-2 text-xl font-bold">
                          {property.title}
                        </h3>

                        <p className="mt-3 text-sm font-medium text-white/60">
                          {getFeaturedEstateName(
                            property
                          )}
                        </p>

                        <div className="mt-3 flex items-start gap-2 text-sm text-white/40">
                          <MapPin
                            size={16}
                            className="mt-0.5 shrink-0 text-[#f97316]"
                          />

                          <span>
                            {getFeaturedLocation(
                              property
                            )}
                          </span>
                        </div>

                        <div className="mt-5 border-t border-white/10 pt-5">
                          <p className="text-xs uppercase tracking-wide text-white/35">
                            Price
                          </p>

                          <p className="mt-1 text-2xl font-bold">
                            ₦
                            {Number(
                              property.price
                            ).toLocaleString()}
                          </p>
                        </div>

                        <button
                          onClick={() =>
                            onViewProperty(
                              property.id
                            )
                          }
                          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f59e0b] via-[#f97316] to-[#dc2626] py-3.5 font-bold transition hover:brightness-110"
                        >
                          View Property
                          <ArrowRight size={17} />
                        </button>
                      </div>
                    </article>
                  );
                }
              )}
            </div>
          )}
        </div>
      </section>

      {/* PROPERTY TYPES */}
      <section className="bg-[#080808]">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-6">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#f59e0b]">
              Find What Fits You
            </p>

            <h2 className="mt-4 text-3xl font-bold md:text-4xl">
              Property opportunities for different{" "}
              <span className="text-[#f97316]">
                goals.
              </span>
            </h2>

            <p className="mt-4 leading-7 text-white/45">
              Whether you want a home, land or an
              investment opportunity, explore available
              Zertop listings.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: House,
                title: "Residential Properties",
                description:
                  "Discover homes and residential developments designed for modern living.",
                action: "View Properties",
              },
              {
                icon: MapPin,
                title: "Land Opportunities",
                description:
                  "Explore land options in locations with development and investment potential.",
                action: "Explore Land",
              },
              {
                icon: Building2,
                title: "Investment Properties",
                description:
                  "Find opportunities that support long-term property ownership and investment goals.",
                action: "View Opportunities",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#111111] p-7 transition hover:border-[#f59e0b]/40"
                >
                  <div className="absolute right-[-45px] top-[-45px] h-28 w-28 rounded-full bg-[#f59e0b]/5 blur-2xl" />

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#f59e0b]/20 to-[#dc2626]/10">
                    <Icon
                      className="text-[#f59e0b]"
                      size={25}
                    />
                  </div>

                  <h3 className="mt-5 text-xl font-semibold">
                    {item.title}
                  </h3>

                  <p className="mt-3 leading-7 text-white/45">
                    {item.description}
                  </p>

                  <button
                    onClick={onBrowseProperties}
                    className="mt-6 flex items-center gap-2 text-sm font-bold text-[#f59e0b]"
                  >
                    {item.action}
                    <ArrowRight size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHY ZERTOP */}
      <section
        id="why-zertop"
        className="relative overflow-hidden border-y border-white/10 bg-[#0d0d0d]"
      >
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-[#dc2626]/5 blur-[100px]" />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-20 md:px-6 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#f59e0b]">
              Why Zertop
            </p>

            <h2 className="mt-4 text-3xl font-bold md:text-4xl">
              A simpler way to discover and{" "}
              <span className="bg-gradient-to-r from-[#f59e0b] to-[#dc2626] bg-clip-text text-transparent">
                secure property.
              </span>
            </h2>

            <p className="mt-5 max-w-xl leading-8 text-white/45">
              We make it easier for prospective buyers
              and investors to explore opportunities,
              ask questions and arrange property
              inspections.
            </p>

            <button
              onClick={onBrowseProperties}
              className="mt-8 flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#f59e0b] via-[#f97316] to-[#dc2626] px-6 py-3.5 font-bold transition hover:brightness-110"
            >
              Find a Property
              <ArrowRight size={18} />
            </button>
          </div>

          <div className="grid gap-4">
            <div className="flex gap-4 rounded-2xl border border-white/10 bg-[#080808] p-6">
              <CheckCircle2
                className="mt-1 shrink-0 text-[#f59e0b]"
                size={24}
              />

              <div>
                <h3 className="font-semibold">
                  Clear Property Information
                </h3>

                <p className="mt-2 text-sm leading-6 text-white/45">
                  Review important property details,
                  location and pricing before making an
                  enquiry.
                </p>
              </div>
            </div>

            <div className="flex gap-4 rounded-2xl border border-white/10 bg-[#080808] p-6">
              <Clock3
                className="mt-1 shrink-0 text-[#f97316]"
                size={24}
              />

              <div>
                <h3 className="font-semibold">
                  Inspection Booking
                </h3>

                <p className="mt-2 text-sm leading-6 text-white/45">
                  Express your interest and request a
                  property inspection directly from the
                  website.
                </p>
              </div>
            </div>

            <div className="flex gap-4 rounded-2xl border border-white/10 bg-[#080808] p-6">
              <ShieldCheck
                className="mt-1 shrink-0 text-[#dc2626]"
                size={24}
              />

              <div>
                <h3 className="font-semibold">
                  Professional Support
                </h3>

                <p className="mt-2 text-sm leading-6 text-white/45">
                  Get assistance through your enquiry,
                  inspection and property acquisition
                  journey.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-[#080808]">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-6">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#f59e0b]">
              How It Works
            </p>

            <h2 className="mt-4 text-3xl font-bold md:text-4xl">
              From search to{" "}
              <span className="text-[#f97316]">
                inspection.
              </span>
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                number: "01",
                title: "Browse Properties",
                text: "Explore available listings and identify properties that fit your needs.",
              },
              {
                number: "02",
                title: "Send an Enquiry",
                text: "Share your contact details and tell us which property interests you.",
              },
              {
                number: "03",
                title: "Book an Inspection",
                text: "Arrange a suitable inspection time and discuss your next steps.",
              },
            ].map((step) => (
              <div
                key={step.number}
                className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#111111] p-7"
              >
                <p className="bg-gradient-to-r from-[#f59e0b] to-[#dc2626] bg-clip-text text-5xl font-black text-transparent opacity-70">
                  {step.number}
                </p>

                <h3 className="mt-6 text-xl font-semibold">
                  {step.title}
                </h3>

                <p className="mt-3 leading-7 text-white/45">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section
        id="about"
        className="relative overflow-hidden border-y border-white/10 bg-[#0d0d0d]"
      >
        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#f59e0b] via-[#f97316] to-[#dc2626]" />

        <div className="mx-auto max-w-7xl px-5 py-20 md:px-6">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#f59e0b]">
              About Zertop
            </p>

            <h2 className="mt-4 text-3xl font-bold leading-tight md:text-5xl">
              Building real-estate opportunities with{" "}
              <span className="bg-gradient-to-r from-[#f59e0b] to-[#dc2626] bg-clip-text text-transparent">
                vision.
              </span>
            </h2>

            <p className="mt-6 leading-8 text-white/50">
              Zertop Limited provides real-estate and
              property development solutions for
              individuals, families and investors. Our
              focus is helping clients identify suitable
              property opportunities and move through
              the acquisition process with greater
              clarity.
            </p>

            <p className="mt-5 leading-8 text-white/50">
              From property development to investment
              opportunities and strategic locations,
              Zertop continues to build around long-term
              value and growth.
            </p>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section
        id="contact"
        className="bg-[#080808]"
      >
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-6">
          <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#111111] p-8 md:p-12">
            <div className="absolute right-[-100px] top-[-80px] h-64 w-64 rotate-[-35deg] bg-gradient-to-r from-[#f59e0b] to-[#f97316] opacity-10" />

            <div className="absolute right-[-130px] top-[100px] h-48 w-64 rotate-[-35deg] bg-[#dc2626] opacity-10" />

            <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[1fr_auto]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#f59e0b]">
                  Ready To Get Started?
                </p>

                <h2 className="mt-4 max-w-2xl text-3xl font-bold leading-tight md:text-4xl">
                  Find a property worth taking the next
                  step on.
                </h2>

                <p className="mt-4 max-w-2xl leading-7 text-white/45">
                  Browse available listings and contact
                  Zertop when you find a property that
                  interests you.
                </p>
              </div>

              <button
                onClick={onBrowseProperties}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f59e0b] via-[#f97316] to-[#dc2626] px-7 py-4 font-bold transition hover:brightness-110"
              >
                View Available Properties
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-[#050505]">
        <div className="mx-auto max-w-7xl px-5 py-10 md:px-6">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <img
                src="/zertop-logo.png"
                alt="Zertop Limited"
                className="h-12 w-auto object-contain"
              />

              <p className="mt-4 max-w-md text-sm leading-6 text-white/35">
                Real Estate & Property Development.
                Building opportunities around property,
                investment and long-term value.
              </p>
            </div>

            <div className="text-sm text-white/35 md:text-right">
              <p>
                © 2026 Zertop Limited.
              </p>

              <p className="mt-1">
                All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}