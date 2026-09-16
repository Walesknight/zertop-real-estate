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
      [property.location, property.city, property.state]
        .filter(Boolean)
        .join(", ") || "Location available on request"
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
    <div className="min-h-screen bg-white text-[#0b1b35]">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 md:px-6">
          <img
            src="/zertop-logo.png"
            alt="Zertop Limited"
            className="h-12 w-auto object-contain md:h-14"
          />

          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-semibold text-[#0b1b35] transition hover:border-orange-300 hover:bg-orange-50"
          >
            <ArrowLeft size={17} />
            Back Home
          </button>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="relative overflow-hidden border-b border-gray-200 bg-[#fffaf5]">
          <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-[#f5a400] via-[#f97316] to-[#ef233c]" />

          <div className="pointer-events-none absolute -left-24 top-8 h-80 w-80 rounded-full bg-yellow-100/70 blur-[100px]" />

          <div className="pointer-events-none absolute -right-20 top-0 h-80 w-80 rounded-full bg-red-100/60 blur-[110px]" />

          <div className="relative mx-auto max-w-7xl px-5 py-16 md:px-6 md:py-20">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#f97316]">
              Zertop Properties
            </p>

            <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight text-[#0b1b35] md:text-5xl lg:text-6xl">
              Find a property worth{" "}
              <span className="bg-gradient-to-r from-[#f5a400] via-[#f97316] to-[#ef233c] bg-clip-text text-transparent">
                taking the next step on.
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-gray-600 md:text-lg">
              Browse available homes, land and investment opportunities
              from Zertop Limited.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-10 md:px-6">
          {/* SEARCH + FILTERS */}
          <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <div className="grid gap-4 lg:grid-cols-[1fr_220px_220px]">
              {/* SEARCH */}
              <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 transition focus-within:border-[#f97316] focus-within:bg-white">
                <Search
                  size={19}
                  className="shrink-0 text-[#f97316]"
                />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search property, estate or location..."
                  className="w-full bg-transparent py-3.5 text-sm text-[#0b1b35] outline-none placeholder:text-gray-400"
                />
              </div>

              {/* PROPERTY TYPE */}
              <div className="relative">
                <Filter
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#f97316]"
                />

                <select
                  value={propertyType}
                  onChange={(e) =>
                    setPropertyType(e.target.value)
                  }
                  className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-11 pr-4 text-sm text-gray-700 outline-none transition focus:border-[#f97316] focus:bg-white"
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
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-700 outline-none transition focus:border-[#f97316] focus:bg-white"
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
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f97316]">
                  Property Catalogue
                </p>

                <h2 className="mt-2 text-2xl font-black text-[#0b1b35]">
                  Available Properties
                </h2>

                <p className="mt-2 text-sm text-gray-500">
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
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setPropertyType("all");
                    setListingType("all");
                  }}
                  className="text-sm font-bold text-[#f97316] transition hover:text-[#ef233c]"
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
                className="mx-auto h-14 w-auto object-contain opacity-80"
              />

              <p className="mt-5 text-gray-500">
                Loading available properties...
              </p>
            </div>
          ) : filteredProperties.length === 0 ? (
            /* EMPTY */
            <div className="mt-8 rounded-3xl border border-gray-200 bg-gray-50 p-12 text-center">
              <Search
                className="mx-auto text-gray-300"
                size={38}
              />

              <h3 className="mt-5 text-xl font-bold text-[#0b1b35]">
                No properties found
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Try changing your search or filters.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setPropertyType("all");
                  setListingType("all");
                }}
                className="mt-6 rounded-xl bg-gradient-to-r from-[#f5a400] via-[#f97316] to-[#ef233c] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-100 transition hover:-translate-y-0.5"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            /* PROPERTY GRID */
            <div className="mt-8 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {filteredProperties.map((property) => {
                const image = getPrimaryImage(property);

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
                    className="group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl"
                  >
                    {/* IMAGE */}
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

                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                      <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-[#ef233c] shadow-lg">
                        {getListingLabel(property.listing_type)}
                      </span>

                      <div className="absolute bottom-4 left-4">
                        <span className="rounded-full bg-[#0b1b35]/90 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-white backdrop-blur">
                          {property.property_type}
                        </span>
                      </div>
                    </div>

                    {/* CONTENT */}
                    <div className="p-6">
                      <h2 className="line-clamp-2 text-xl font-black text-[#0b1b35]">
                        {property.title}
                      </h2>

                      <p className="mt-3 text-sm font-semibold text-gray-600">
                        {getEstateName(property)}
                      </p>

                      <div className="mt-3 flex items-start gap-2 text-sm text-gray-500">
                        <MapPin
                          size={16}
                          className="mt-0.5 shrink-0 text-[#f97316]"
                        />

                        <span>
                          {getPropertyLocation(property)}
                        </span>
                      </div>

                      {/* FEATURES */}
                      {(showBedrooms ||
                        showBathrooms ||
                        showLandSize) && (
                        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 border-y border-gray-100 py-4 text-sm text-gray-600">
                          {showBedrooms && (
                            <span className="flex items-center gap-2">
                              <BedDouble
                                size={17}
                                className="text-[#f5a400]"
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
                                className="text-[#ef233c]"
                              />

                              {Number(
                                property.land_size
                              ).toLocaleString()}{" "}
                              {property.land_size_unit || "sqm"}
                            </span>
                          )}
                        </div>
                      )}

                      {/* PRICE */}
                      <div className="mt-5">
                        <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
                          Price
                        </p>

                        <p className="mt-1 text-2xl font-black text-[#0b1b35]">
                          ₦{Number(property.price).toLocaleString()}
                        </p>
                      </div>

                      {/* CTA */}
                      <button
                        type="button"
                        onClick={() =>
                          onViewProperty(property.id)
                        }
                        className="mt-5 w-full rounded-xl bg-[#0b1b35] py-3.5 font-bold text-white transition hover:bg-[#f97316]"
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
      <footer className="mt-16 border-t border-gray-200 bg-[#f8fafc]">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-10 md:flex-row md:items-end md:justify-between md:px-6">
          <div>
            <img
              src="/zertop-logo.png"
              alt="Zertop Limited"
              className="h-14 w-auto object-contain"
            />

            <p className="mt-4 max-w-md text-sm leading-6 text-gray-500">
              Real Estate & Property Development.
              Discover properties, land and investment
              opportunities from Zertop Limited.
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