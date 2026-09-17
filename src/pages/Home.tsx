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

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTiktok,
} from "react-icons/fa6";

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

  const [featuredLoading, setFeaturedLoading] = useState(true);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      console.error("Featured properties error:", error);

      setFeaturedLoading(false);
      return;
    }

    setFeaturedProperties((data || []) as FeaturedProperty[]);
    setFeaturedLoading(false);
  };

  const getFeaturedEstateName = (property: FeaturedProperty) => {
    if (!property.estates) {
      return "Zertop Limited";
    }

    if (Array.isArray(property.estates)) {
      return property.estates[0]?.name || "Zertop Limited";
    }

    return property.estates.name;
  };

  const getFeaturedImage = (property: FeaturedProperty) => {
    const images = property.property_images || [];

    return (
      images.find((image) => image.is_primary)?.image_url ||
      images[0]?.image_url ||
      null
    );
  };

  const getFeaturedLocation = (property: FeaturedProperty) => {
    return (
      [property.location, property.city, property.state]
        .filter(Boolean)
        .join(", ") || "Location available on request"
    );
  };

  const getListingLabel = (listingType: string) => {
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
    <div className="min-h-screen bg-white text-[#0b1b35]">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 md:px-6">
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
              className="h-12 w-auto object-contain md:h-14"
            />
          </button>

          {/* DESKTOP NAV */}
          <nav className="hidden items-center gap-7 lg:flex">
            <a
              href="#home"
              className="text-sm font-semibold text-[#0b1b35]"
            >
              Home
            </a>

            <button
              type="button"
              onClick={onBrowseProperties}
              className="text-sm font-medium text-gray-600 transition hover:text-[#f97316]"
            >
              Properties
            </button>

            <button
              type="button"
              onClick={onDevelopments}
              className="text-sm font-medium text-gray-600 transition hover:text-[#f97316]"
            >
              Developments
            </button>

            <a
              href="#why-zertop"
              className="text-sm font-medium text-gray-600 transition hover:text-[#f97316]"
            >
              Why Zertop
            </a>

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

            <button
              type="button"
              onClick={onStaffLogin}
              className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-semibold text-[#0b1b35] transition hover:border-[#f59e0b]/50 hover:bg-orange-50"
            >
              Staff Login
            </button>
          </nav>

          {/* MOBILE BUTTON */}
          <button
            type="button"
            onClick={() =>
              setMobileMenuOpen((current) => !current)
            }
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-[#0b1b35] lg:hidden"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* MOBILE MENU */}
        {mobileMenuOpen && (
          <div className="border-t border-gray-200 bg-white px-5 py-5 shadow-lg lg:hidden">
            <div className="flex flex-col gap-1">
              <a
                href="#home"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-semibold text-[#0b1b35] hover:bg-orange-50"
              >
                Home
              </a>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onBrowseProperties();
                }}
                className="rounded-xl px-4 py-3 text-left text-sm font-medium text-gray-600 hover:bg-orange-50 hover:text-[#f97316]"
              >
                Properties
              </button>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onDevelopments();
                }}
                className="rounded-xl px-4 py-3 text-left text-sm font-medium text-gray-600 hover:bg-orange-50 hover:text-[#f97316]"
              >
                Developments
              </button>

              <a
                href="#why-zertop"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-gray-600 hover:bg-orange-50 hover:text-[#f97316]"
              >
                Why Zertop
              </a>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onAbout();
                }}
                className="rounded-xl px-4 py-3 text-left text-sm font-medium text-gray-600 hover:bg-orange-50 hover:text-[#f97316]"
              >
                About
              </button>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onContact();
                }}
                className="rounded-xl px-4 py-3 text-left text-sm font-medium text-gray-600 hover:bg-orange-50 hover:text-[#f97316]"
              >
                Contact
              </button>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onStaffLogin();
                }}
                className="mt-3 rounded-xl bg-[#0b1b35] px-4 py-3 text-sm font-semibold text-white"
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
        className="relative overflow-hidden border-b border-gray-200 bg-[#fffaf5]"
      >
        {/* DECORATIVE LIGHT BACKGROUND */}
        <div className="pointer-events-none absolute -left-40 top-24 h-96 w-96 rounded-full bg-yellow-100/70 blur-[100px]" />

        <div className="pointer-events-none absolute -right-32 top-0 h-[500px] w-[500px] rounded-full bg-red-100/60 blur-[120px]" />

        <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-[#f5a400] via-[#f97316] to-[#ef233c]" />

        <div className="relative mx-auto grid min-h-[680px] max-w-7xl items-center gap-14 px-5 py-16 md:px-6 md:py-20 lg:grid-cols-2">
          {/* HERO CONTENT */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-[#f97316] shadow-sm">
              <BadgeCheck size={16} />
              Real estate opportunities built for growth
            </div>

            <h1 className="mt-7 max-w-3xl text-4xl font-black leading-[1.05] tracking-tight text-[#0b1b35] sm:text-5xl md:text-6xl">
              Find property that builds your{" "}
              <span className="bg-gradient-to-r from-[#f5a400] via-[#f97316] to-[#ef233c] bg-clip-text text-transparent">
                future.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-gray-600 md:text-lg">
              Explore residential properties, land opportunities and
              investment developments from Zertop Limited in strategic
              and growing locations.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={onBrowseProperties}
                className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#f5a400] via-[#f97316] to-[#ef233c] px-6 py-3.5 font-bold text-white shadow-lg shadow-orange-200/70 transition hover:-translate-y-0.5"
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
                className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3.5 font-semibold text-[#0b1b35] shadow-sm transition hover:border-orange-300 hover:bg-orange-50"
              >
                <MessageCircle size={18} />
                Make an Enquiry
              </button>
            </div>

            {/* HERO POINTS */}
            <div className="mt-12 grid max-w-xl grid-cols-3 gap-4 border-t border-gray-200 pt-7">
              <div>
                <p className="text-lg font-black text-[#0b1b35] md:text-2xl">
                  Quality
                </p>

                <p className="mt-1 text-xs text-gray-500 md:text-sm">
                  Property options
                </p>
              </div>

              <div>
                <p className="text-lg font-black text-[#0b1b35] md:text-2xl">
                  Flexible
                </p>

                <p className="mt-1 text-xs text-gray-500 md:text-sm">
                  Payment plans
                </p>
              </div>

              <div>
                <p className="text-lg font-black text-[#0b1b35] md:text-2xl">
                  Trusted
                </p>

                <p className="mt-1 text-xs text-gray-500 md:text-sm">
                  Buying process
                </p>
              </div>
            </div>
          </div>

          {/* HERO CARD */}
          <div className="relative z-10">
            <div className="absolute -left-6 -top-6 h-32 w-32 rounded-[30px] bg-yellow-200/50" />

            <div className="absolute -bottom-7 -right-7 h-40 w-40 rounded-[36px] bg-red-100/70" />

            <div className="relative overflow-hidden rounded-[30px] border border-gray-200 bg-white p-4 shadow-[0_30px_80px_rgba(15,23,42,0.12)]">
              <div className="relative overflow-hidden rounded-[24px] bg-[#fff7ed] p-7 md:p-9">
                {/* DECORATION */}
                <div className="absolute -right-16 -top-12 h-28 w-52 rotate-[-35deg] bg-[#f5a400]/30" />

                <div className="absolute -right-20 top-24 h-20 w-52 rotate-[-35deg] bg-[#ef233c]/20" />

                <div className="relative z-10">
                  <img
                    src="/zertop-logo.png"
                    alt="Zertop Limited"
                    className="h-16 w-auto object-contain"
                  />

                  <p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-[#f97316]">
                    Zertop Properties
                  </p>

                  <h2 className="mt-3 max-w-md text-3xl font-black leading-tight text-[#0b1b35]">
                    Your next property may be one click away.
                  </h2>

                  <p className="mt-4 max-w-md leading-7 text-gray-600">
                    Browse live listings, compare locations, review
                    payment options and contact our team directly.
                  </p>

                  <button
                    type="button"
                    onClick={onBrowseProperties}
                    className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0b1b35] px-5 py-3.5 font-bold text-white transition hover:bg-[#f97316]"
                  >
                    <Search size={18} />
                    Explore Available Properties
                  </button>
                </div>
              </div>

              <div className="grid gap-3 p-2 pt-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-gray-200 bg-white p-5">
                  <MapPin
                    className="text-[#f5a400]"
                    size={24}
                  />

                  <h3 className="mt-4 font-bold text-[#0b1b35]">
                    Strategic Locations
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    Properties positioned around emerging growth
                    corridors.
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-5">
                  <ShieldCheck
                    className="text-[#ef233c]"
                    size={24}
                  />

                  <h3 className="mt-4 font-bold text-[#0b1b35]">
                    Guided Process
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    From enquiry to inspection and acquisition.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PROPERTIES */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#f97316]">
                Featured Properties
              </p>

              <h2 className="mt-4 text-3xl font-black text-[#0b1b35] md:text-4xl">
                Explore our latest property{" "}
                <span className="text-[#f97316]">
                  opportunities.
                </span>
              </h2>

              <p className="mt-4 leading-7 text-gray-600">
                Browse some of our currently available properties and
                find an opportunity that matches your plans.
              </p>
            </div>

            <button
              type="button"
              onClick={onBrowseProperties}
              className="group flex items-center gap-2 text-sm font-bold text-[#f97316]"
            >
              View All Properties

              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>
          </div>

          {featuredLoading ? (
            <div className="py-16 text-center text-gray-400">
              Loading featured properties...
            </div>
          ) : featuredProperties.length === 0 ? (
            <div className="mt-10 rounded-3xl border border-gray-200 bg-gray-50 p-10 text-center">
              <Building2
                className="mx-auto text-gray-300"
                size={38}
              />

              <h3 className="mt-4 text-lg font-bold text-[#0b1b35]">
                Properties coming soon
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                New Zertop listings will appear here.
              </p>
            </div>
          ) : (
            <div className="mt-10 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {featuredProperties.map((property) => {
                const image = getFeaturedImage(property);

                return (
                  <article
                    key={property.id}
                    className="group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl"
                  >
                    <div className="relative overflow-hidden bg-gray-100">
                      {image ? (
                        <img
                          src={image}
                          alt={property.title}
                          className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex aspect-[16/10] items-center justify-center bg-gray-100 text-sm text-gray-400">
                          Property Image Coming Soon
                        </div>
                      )}

                      <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-[#ef233c] shadow-lg">
                        {getListingLabel(property.listing_type)}
                      </span>
                    </div>

                    <div className="p-6">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#f97316]">
                        {property.property_type}
                      </p>

                      <h3 className="mt-2 line-clamp-2 text-xl font-black text-[#0b1b35]">
                        {property.title}
                      </h3>

                      <p className="mt-3 text-sm font-semibold text-gray-600">
                        {getFeaturedEstateName(property)}
                      </p>

                      <div className="mt-3 flex items-start gap-2 text-sm text-gray-500">
                        <MapPin
                          size={16}
                          className="mt-0.5 shrink-0 text-[#f97316]"
                        />

                        <span>
                          {getFeaturedLocation(property)}
                        </span>
                      </div>

                      <div className="mt-5 border-t border-gray-100 pt-5">
                        <p className="text-xs uppercase tracking-wide text-gray-400">
                          Price
                        </p>

                        <p className="mt-1 text-2xl font-black text-[#0b1b35]">
                          ₦{Number(property.price).toLocaleString()}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => onViewProperty(property.id)}
                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0b1b35] py-3.5 font-bold text-white transition hover:bg-[#f97316]"
                      >
                        View Property
                        <ArrowRight size={17} />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* PROPERTY TYPES */}
      <section className="bg-[#f8fafc]">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-6">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#f97316]">
              Find What Fits You
            </p>

            <h2 className="mt-4 text-3xl font-black text-[#0b1b35] md:text-4xl">
              Property opportunities for different{" "}
              <span className="text-[#f97316]">
                goals.
              </span>
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              Whether you want a home, land or an investment
              opportunity, explore available Zertop listings.
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
                  className="group rounded-3xl border border-gray-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50">
                    <Icon
                      className="text-[#f97316]"
                      size={25}
                    />
                  </div>

                  <h3 className="mt-5 text-xl font-bold text-[#0b1b35]">
                    {item.title}
                  </h3>

                  <p className="mt-3 leading-7 text-gray-600">
                    {item.description}
                  </p>

                  <button
                    type="button"
                    onClick={onBrowseProperties}
                    className="mt-6 flex items-center gap-2 text-sm font-bold text-[#f97316]"
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
        className="relative overflow-hidden border-y border-gray-200 bg-white"
      >
        <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-red-50 blur-[100px]" />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-20 md:px-6 lg:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#f97316]">
              Why Zertop
            </p>

            <h2 className="mt-4 text-3xl font-black text-[#0b1b35] md:text-4xl">
              A simpler way to discover and{" "}
              <span className="bg-gradient-to-r from-[#f5a400] to-[#ef233c] bg-clip-text text-transparent">
                secure property.
              </span>
            </h2>

            <p className="mt-5 max-w-xl leading-8 text-gray-600">
              We make it easier for prospective buyers and investors
              to explore opportunities, ask questions and arrange
              property inspections.
            </p>

            <button
              type="button"
              onClick={onBrowseProperties}
              className="mt-8 flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#f5a400] via-[#f97316] to-[#ef233c] px-6 py-3.5 font-bold text-white shadow-lg shadow-orange-100"
            >
              Find a Property
              <ArrowRight size={18} />
            </button>
          </div>

          <div className="grid gap-4">
            <ReasonRow
              icon={
                <CheckCircle2
                  className="text-[#f5a400]"
                  size={24}
                />
              }
              title="Clear Property Information"
              text="Review important property details, location and pricing before making an enquiry."
            />

            <ReasonRow
              icon={
                <Clock3
                  className="text-[#f97316]"
                  size={24}
                />
              }
              title="Inspection Booking"
              text="Express your interest and request a property inspection directly from the website."
            />

            <ReasonRow
              icon={
                <ShieldCheck
                  className="text-[#ef233c]"
                  size={24}
                />
              }
              title="Professional Support"
              text="Get assistance through your enquiry, inspection and property acquisition journey."
            />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-[#f8fafc]">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-6">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#f97316]">
              How It Works
            </p>

            <h2 className="mt-4 text-3xl font-black text-[#0b1b35] md:text-4xl">
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
                className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm"
              >
                <p className="bg-gradient-to-r from-[#f5a400] to-[#ef233c] bg-clip-text text-5xl font-black text-transparent">
                  {step.number}
                </p>

                <h3 className="mt-6 text-xl font-bold text-[#0b1b35]">
                  {step.title}
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="relative overflow-hidden border-y border-gray-200 bg-white">
        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#f5a400] via-[#f97316] to-[#ef233c]" />

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 md:px-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#f97316]">
              About Zertop
            </p>

            <h2 className="mt-4 text-3xl font-black leading-tight text-[#0b1b35] md:text-5xl">
              Building real-estate opportunities with{" "}
              <span className="bg-gradient-to-r from-[#f5a400] to-[#ef233c] bg-clip-text text-transparent">
                vision.
              </span>
            </h2>

            <p className="mt-6 leading-8 text-gray-600">
              Zertop Limited provides real-estate and property
              development solutions for individuals, families and
              investors.
            </p>

            <p className="mt-5 leading-8 text-gray-600">
              From property development to investment opportunities
              and strategic locations, Zertop continues to build
              around long-term value and growth.
            </p>

            <button
              type="button"
              onClick={onAbout}
              className="mt-7 flex items-center gap-2 font-bold text-[#f97316]"
            >
              Learn More About Zertop
              <ArrowRight size={17} />
            </button>
          </div>

          <div className="rounded-[30px] border border-gray-200 bg-[#fffaf5] p-8 shadow-sm">
            <img
              src="/zertop-logo.png"
              alt="Zertop Limited"
              className="h-20 w-auto object-contain"
            />

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <SmallStat
                value="2016"
                label="Established"
              />

              <SmallStat
                value="Lagos"
                label="Key Market"
              />

              <SmallStat
                value="Epe"
                label="Growth Corridor"
              />

              <SmallStat
                value="Global"
                label="Business Outlook"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-[#fff7ed]">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-6">
          <div className="relative overflow-hidden rounded-[30px] bg-gradient-to-r from-[#f5a400] via-[#f97316] to-[#ef233c] p-8 text-white shadow-xl md:p-12">
            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full border-[35px] border-white/10" />

            <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[1fr_auto]">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-white/75">
                  Ready To Get Started?
                </p>

                <h2 className="mt-4 max-w-2xl text-3xl font-black leading-tight md:text-4xl">
                  Find a property worth taking the next step on.
                </h2>

                <p className="mt-4 max-w-2xl leading-7 text-white/85">
                  Browse available listings and contact Zertop when
                  you find a property that interests you.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={onBrowseProperties}
                  className="flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-4 font-bold text-[#ef233c] shadow-lg"
                >
                  View Properties
                  <ArrowRight size={18} />
                </button>

                <button
                  type="button"
                  onClick={onContact}
                  className="rounded-xl border border-white/40 bg-white/10 px-7 py-4 font-bold text-white backdrop-blur"
                >
                  Contact Zertop
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
<footer className="border-t border-gray-200 bg-[#f8fafc]">
  <div className="mx-auto max-w-7xl px-5 py-14 md:px-6">
    <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.9fr_1.2fr]">
      {/* BRAND */}
      <div>
        <img
          src="/zertop-logo.png"
          alt="Zertop Limited"
          className="h-14 w-auto object-contain"
        />

        <p className="mt-5 max-w-sm text-sm leading-7 text-gray-500">
          Zertop Limited is a real estate and property
          development company creating opportunities
          around property ownership, investment and
          long-term value.
        </p>

        {/* SOCIAL MEDIA */}
<div className="mt-5 flex items-center gap-3">
  <a
    href="instagram.com/zertoplimited"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Zertop Instagram"
    className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition hover:border-orange-200 hover:bg-orange-50 hover:text-[#f97316]"
  >
    <FaInstagram size={18} />
  </a>

  <a
    href="facebook.com/zertoplimited"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Zertop Facebook"
    className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition hover:border-orange-200 hover:bg-orange-50 hover:text-[#f97316]"
  >
    <FaFacebookF size={17} />
  </a>

  <a
    href="tiktok.com/zertop.real.estate"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Zertop TikTok"
    className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition hover:border-orange-200 hover:bg-orange-50 hover:text-[#f97316]"
  >
    <FaTiktok size={17} />
  </a>

  <a
    href="linkedin.com/zertoplimited"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Zertop LinkedIn"
    className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition hover:border-orange-200 hover:bg-orange-50 hover:text-[#f97316]"
  >
    <FaLinkedinIn size={17} />
  </a>
</div>

        <button
          type="button"
          onClick={onBrowseProperties}
          className="mt-6 rounded-xl bg-gradient-to-r from-[#f5a400] via-[#f97316] to-[#ef233c] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5"
        >
          Browse Properties
        </button>
      </div>

      {/* QUICK LINKS */}
      <div>
        <p className="text-sm font-black uppercase tracking-[0.15em] text-[#0b1b35]">
          Quick Links
        </p>

        <div className="mt-5 flex flex-col items-start gap-3">
          <button
            type="button"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
            className="text-sm text-gray-500 transition hover:text-[#f97316]"
          >
            Home
          </button>

          <button
            type="button"
            onClick={onBrowseProperties}
            className="text-sm text-gray-500 transition hover:text-[#f97316]"
          >
            Properties
          </button>

          <button
            type="button"
            onClick={onDevelopments}
            className="text-sm text-gray-500 transition hover:text-[#f97316]"
          >
            Developments
          </button>

          <button
            type="button"
            onClick={onAbout}
            className="text-sm text-gray-500 transition hover:text-[#f97316]"
          >
            About Us
          </button>

          <button
            type="button"
            onClick={onContact}
            className="text-sm text-gray-500 transition hover:text-[#f97316]"
          >
            Contact
          </button>
        </div>
      </div>

      {/* CONTACT */}
      <div>
        <p className="text-sm font-black uppercase tracking-[0.15em] text-[#0b1b35]">
          Contact
        </p>

        <div className="mt-5 space-y-3 text-sm leading-6 text-gray-500">
          <div>
            <a
              href="tel:+2348135420099"
              className="transition hover:text-[#f97316]"
            >
              0813 542 0099
            </a>
          </div>

          <div>
            <a
              href="tel:+2349054787868"
              className="transition hover:text-[#f97316]"
            >
              0905 478 7868
            </a>
          </div>

          <div>
            <a
              href="tel:+2349042509860"
              className="transition hover:text-[#f97316]"
            >
              0904 250 9860
            </a>
          </div>

          <div className="pt-1">
            <a
              href="mailto:admin@zertoplimited.com"
              className="break-all transition hover:text-[#f97316]"
            >
              admin@zertoplimited.com
            </a>
          </div>
        </div>
      </div>

      {/* OFFICE */}
      <div>
        <p className="text-sm font-black uppercase tracking-[0.15em] text-[#0b1b35]">
          Head Office
        </p>

        <p className="mt-5 text-sm leading-7 text-gray-500">
          Suite B31 & B32, 1st Floor,
          Royale Plaza International, Bogije,
          Km 35, Lekki-Epe Expressway,
          Lagos, Nigeria.
        </p>

        <a
          href="https://www.zertoplimited.com"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-sm font-bold text-[#f97316] transition hover:text-[#ef233c]"
        >
          www.zertoplimited.com
        </a>
      </div>
    </div>

    {/* BOTTOM BAR */}
    <div className="mt-12 flex flex-col gap-4 border-t border-gray-200 pt-6 text-sm text-gray-400 md:flex-row md:items-center md:justify-between">
      <p>
        © 2026 Zertop Limited. All rights reserved.
      </p>

      <p>
        Real Estate & Property Development
      </p>
    </div>
  </div>
</footer>
    </div>
  );
}

type ReasonRowProps = {
  icon: React.ReactNode;
  title: string;
  text: string;
};

function ReasonRow({
  icon,
  title,
  text,
}: ReasonRowProps) {
  return (
    <div className="flex gap-4 rounded-2xl border border-gray-200 bg-[#f8fafc] p-6">
      <div className="mt-1 shrink-0">
        {icon}
      </div>

      <div>
        <h3 className="font-bold text-[#0b1b35]">
          {title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-gray-600">
          {text}
        </p>
      </div>
    </div>
  );
}

type SmallStatProps = {
  value: string;
  label: string;
};

function SmallStat({
  value,
  label,
}: SmallStatProps) {
  return (
    <div className="rounded-2xl border border-orange-100 bg-white p-5">
      <p className="text-2xl font-black text-[#f97316]">
        {value}
      </p>

      <p className="mt-1 text-sm text-gray-500">
        {label}
      </p>
    </div>
  );
}