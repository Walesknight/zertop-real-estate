import { useEffect, useMemo, useState } from "react";

import {
  ArrowLeft,
  Bath,
  BedDouble,
  Filter,
  LandPlot,
  MapPin,
  Search,
} from "lucide-react";

import { supabase } from "../lib/supabase";

type PublicPropertiesProps = {
  onBack: () => void;
  onViewProperty: (propertyId: string) => void;
};

type Property = {
  id: string;
  title: string;
  property_type: string;
  listing_type: string;
  location: string | null;
  city?: string | null;
  state?: string | null;
  price: number;
  bedrooms: number;
  bathrooms: number;
  land_size?: number | null;
  land_size_unit?: string | null;
  status: string;
  estate_id: string | null;

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

export default function PublicProperties({
  onBack,
  onViewProperty,
}: PublicPropertiesProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [search, setSearch] = useState("");
  const [propertyType, setPropertyType] = useState("all");
  const [listingType, setListingType] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    setLoading(true);

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
        bedrooms,
        bathrooms,
        land_size,
        land_size_unit,
        status,
        estate_id,
        estates (
          name
        ),
        property_images (
          image_url,
          is_primary
        )
      `)
      .eq("status", "available")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Properties loading error:", error);
      setLoading(false);
      return;
    }

    setProperties((data || []) as Property[]);
    setLoading(false);
  };

  const getEstateName = (property: Property) => {
    if (!property.estates) {
      return "Zertop Limited";
    }

    if (Array.isArray(property.estates)) {
      return property.estates[0]?.name || "Zertop Limited";
    }

    return property.estates.name;
  };

  const getPrimaryImage = (property: Property) => {
    const images = property.property_images || [];

    return (
      images.find((image) => image.is_primary)?.image_url ||
      images[0]?.image_url ||
      null
    );
  };

  const getListingLabel = (listingType: string) => {
    if (listingType === "sale") return "For Sale";
    if (listingType === "rent") return "For Rent";
    if (listingType === "lease") return "For Lease";

    return listingType;
  };

  const getPropertyLocation = (property: Property) => {
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

  const propertyTypes = useMemo(() => {
    return Array.from(
      new Set(
        properties
          .map((property) => property.property_type)
          .filter(Boolean)
      )
    );
  }, [properties]);

  const filteredProperties = properties.filter((property) => {
    const term = search.trim().toLowerCase();

    const matchesSearch =
      !term ||
      property.title.toLowerCase().includes(term) ||
      property.property_type.toLowerCase().includes(term) ||
      property.location?.toLowerCase().includes(term) ||
      property.city?.toLowerCase().includes(term) ||
      property.state?.toLowerCase().includes(term) ||
      getEstateName(property).toLowerCase().includes(term);

    const matchesPropertyType =
      propertyType === "all" ||
      property.property_type === propertyType;

    const matchesListingType =
      listingType === "all" ||
      property.listing_type === listingType;

    return (
      matchesSearch &&
      matchesPropertyType &&
      matchesListingType
    );
  });

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#080808]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-6">
          <img
            src="/zertop-logo.png"
            alt="Zertop Limited"
            className="h-10 w-auto object-contain md:h-12"
          />

          <button
            onClick={onBack}
            className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/[0.03] px-4 py-2 text-sm font-medium text-white/70 transition hover:border-[#f59e0b]/50 hover:text-white"
          >
            <ArrowLeft size={17} />
            Back Home
          </button>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="relative overflow-hidden border-b border-white/10 bg-[#0d0d0d]">
          <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-[#f59e0b] via-[#f97316] to-[#dc2626]" />

          <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-[#f59e0b]/10 blur-[100px]" />

          <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-[#dc2626]/10 blur-[110px]" />

          <div className="relative mx-auto max-w-7xl px-5 py-16 md:px-6 md:py-20">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#f59e0b]">
              Zertop Properties
            </p>

            <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight md:text-5xl lg:text-6xl">
              Find a property worth{" "}
              <span className="bg-gradient-to-r from-[#f59e0b] via-[#f97316] to-[#dc2626] bg-clip-text text-transparent">
                taking the next step on.
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-white/45 md:text-lg">
              Browse available homes, land and investment
              opportunities from Zertop Limited.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-10 md:px-6">
          {/* SEARCH + FILTERS */}
          <div className="rounded-2xl border border-white/10 bg-[#111111] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
            <div className="grid gap-4 lg:grid-cols-[1fr_220px_220px]">
              {/* SEARCH */}
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#080808] px-4 transition focus-within:border-[#f59e0b]/60">
                <Search
                  size={19}
                  className="shrink-0 text-[#f59e0b]"
                />

                <input
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search property, estate or location..."
                  className="w-full bg-transparent py-3.5 text-sm text-white outline-none placeholder:text-white/25"
                />
              </div>

              {/* PROPERTY TYPE */}
              <div className="relative">
                <Filter
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#f59e0b]"
                />

                <select
                  value={propertyType}
                  onChange={(e) =>
                    setPropertyType(e.target.value)
                  }
                  className="w-full appearance-none rounded-xl border border-white/10 bg-[#080808] py-3.5 pl-11 pr-4 text-sm text-white/70 outline-none transition focus:border-[#f59e0b]/60"
                >
                  <option value="all">
                    All Property Types
                  </option>

                  {propertyTypes.map((type) => (
                    <option
                      key={type}
                      value={type}
                    >
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* LISTING TYPE */}
              <select
                value={listingType}
                onChange={(e) =>
                  setListingType(e.target.value)
                }
                className="w-full rounded-xl border border-white/10 bg-[#080808] px-4 py-3.5 text-sm text-white/70 outline-none transition focus:border-[#f59e0b]/60"
              >
                <option value="all">
                  All Listings
                </option>

                <option value="sale">
                  For Sale
                </option>

                <option value="rent">
                  For Rent
                </option>

                <option value="lease">
                  For Lease
                </option>
              </select>
            </div>
          </div>

          {/* RESULT COUNT */}
          {!loading && (
            <div className="mt-10 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f59e0b]">
                  Property Catalogue
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  Available Properties
                </h2>

                <p className="mt-2 text-sm text-white/35">
                  {filteredProperties.length}{" "}
                  {filteredProperties.length === 1
                    ? "property"
                    : "properties"}{" "}
                  found
                </p>
              </div>

              {(search ||
                propertyType !== "all" ||
                listingType !== "all") && (
                <button
                  onClick={() => {
                    setSearch("");
                    setPropertyType("all");
                    setListingType("all");
                  }}
                  className="text-sm font-semibold text-[#f59e0b] transition hover:text-[#f97316]"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}

          {/* LOADING */}
          {loading ? (
            <div className="py-24 text-center">
              <img
                src="/zertop-logo.png"
                alt="Zertop Limited"
                className="mx-auto h-12 w-auto object-contain opacity-70"
              />

              <p className="mt-5 text-white/40">
                Loading available properties...
              </p>
            </div>
          ) : filteredProperties.length === 0 ? (
            /* EMPTY */
            <div className="mt-8 rounded-2xl border border-white/10 bg-[#111111] p-12 text-center">
              <Search
                className="mx-auto text-white/20"
                size={38}
              />

              <h3 className="mt-5 text-xl font-semibold">
                No properties found
              </h3>

              <p className="mt-2 text-sm text-white/35">
                Try changing your search or filters.
              </p>

              <button
                onClick={() => {
                  setSearch("");
                  setPropertyType("all");
                  setListingType("all");
                }}
                className="mt-6 rounded-xl bg-gradient-to-r from-[#f59e0b] via-[#f97316] to-[#dc2626] px-5 py-2.5 text-sm font-bold transition hover:brightness-110"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            /* PROPERTY GRID */
            <div className="mt-8 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {filteredProperties.map((property) => {
                const image =
                  getPrimaryImage(property);

                const showBedrooms =
                  Number(property.bedrooms) > 0;

                const showBathrooms =
                  Number(property.bathrooms) > 0;

                const showLandSize =
                  property.land_size &&
                  Number(property.land_size) > 0;

                return (
                  <article
                    key={property.id}
                    className="group overflow-hidden rounded-2xl border border-white/10 bg-[#111111] shadow-[0_20px_60px_rgba(0,0,0,0.28)] transition duration-300 hover:-translate-y-1 hover:border-[#f59e0b]/40"
                  >
                    {/* IMAGE */}
                    <div className="relative overflow-hidden">
                      {image ? (
                        <img
                          src={image}
                          alt={property.title}
                          className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex aspect-[16/10] items-center justify-center bg-[#181818] text-sm text-white/25">
                          Property Image Coming Soon
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/10" />

                      <span className="absolute left-4 top-4 rounded-full bg-gradient-to-r from-[#f59e0b] via-[#f97316] to-[#dc2626] px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-lg">
                        {getListingLabel(
                          property.listing_type
                        )}
                      </span>

                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#f59e0b]">
                          {property.property_type}
                        </p>
                      </div>
                    </div>

                    {/* CONTENT */}
                    <div className="p-5">
                      <h2 className="line-clamp-2 text-xl font-bold">
                        {property.title}
                      </h2>

                      <p className="mt-3 text-sm font-medium text-white/60">
                        {getEstateName(property)}
                      </p>

                      <div className="mt-3 flex items-start gap-2 text-sm text-white/40">
                        <MapPin
                          size={16}
                          className="mt-0.5 shrink-0 text-[#f97316]"
                        />

                        <span>
                          {getPropertyLocation(
                            property
                          )}
                        </span>
                      </div>

                      {/* FEATURES */}
                      {(showBedrooms ||
                        showBathrooms ||
                        showLandSize) && (
                        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 border-y border-white/10 py-4 text-sm text-white/45">
                          {showBedrooms && (
                            <span className="flex items-center gap-2">
                              <BedDouble
                                size={17}
                                className="text-[#f59e0b]"
                              />

                              {property.bedrooms}{" "}
                              {property.bedrooms === 1
                                ? "Bed"
                                : "Beds"}
                            </span>
                          )}

                          {showBathrooms && (
                            <span className="flex items-center gap-2">
                              <Bath
                                size={17}
                                className="text-[#f97316]"
                              />

                              {property.bathrooms}{" "}
                              {property.bathrooms === 1
                                ? "Bath"
                                : "Baths"}
                            </span>
                          )}

                          {showLandSize && (
                            <span className="flex items-center gap-2">
                              <LandPlot
                                size={17}
                                className="text-[#dc2626]"
                              />

                              {Number(
                                property.land_size
                              ).toLocaleString()}{" "}
                              {property.land_size_unit ||
                                "sqm"}
                            </span>
                          )}
                        </div>
                      )}

                      {/* PRICE */}
                      <div className="mt-5">
                        <p className="text-xs uppercase tracking-[0.15em] text-white/30">
                          Price
                        </p>

                        <p className="mt-1 text-2xl font-black">
                          ₦
                          {Number(
                            property.price
                          ).toLocaleString()}
                        </p>
                      </div>

                      {/* CTA */}
                      <button
                        onClick={() =>
                          onViewProperty(property.id)
                        }
                        className="mt-5 w-full rounded-xl bg-gradient-to-r from-[#f59e0b] via-[#f97316] to-[#dc2626] py-3.5 font-bold transition hover:brightness-110"
                      >
                        View Property Details
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* FOOTER */}
      <footer className="mt-16 border-t border-white/10 bg-[#050505]">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-10 md:flex-row md:items-end md:justify-between md:px-6">
          <div>
            <img
              src="/zertop-logo.png"
              alt="Zertop Limited"
              className="h-12 w-auto object-contain"
            />

            <p className="mt-4 max-w-md text-sm leading-6 text-white/35">
              Real Estate & Property Development.
              Discover properties, land and investment
              opportunities from Zertop Limited.
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