import {
  useEffect,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

import {
  ArrowLeft,
  Bath,
  BedDouble,
  Building2,
  CalendarDays,
  CheckCircle2,
  LandPlot,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Toilet,
} from "lucide-react";

import { supabase } from "../lib/supabase";

type PublicPropertyDetailsProps = {
  propertyId: string;
  onBack: () => void;
};

type PropertyImage = {
  image_url: string;
  is_primary: boolean;
};

type Property = {
  id: string;
  company_id: string;
  title: string;
  description: string | null;
  property_type: string;
  listing_type: string;
  location: string | null;
  city: string | null;
  state: string | null;
  price: number;
  bedrooms: number;
  bathrooms: number;
  toilets: number;
  land_size: number | null;
  land_size_unit: string | null;
  initial_deposit: number | null;
  installment_months: number | null;

  estates:
    | {
        name: string;
      }
    | {
        name: string;
      }[]
    | null;

  property_images: PropertyImage[] | null;
};

const WHATSAPP_NUMBER = "2349058910187";

export default function PublicPropertyDetails({
  propertyId,
  onBack,
}: PublicPropertyDetailsProps) {
  const [property, setProperty] = useState<Property | null>(
    null
  );

  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [inspectionDate, setInspectionDate] =
    useState("");
  const [notes, setNotes] = useState("");

  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<
    "success" | "error" | null
  >(null);

  useEffect(() => {
    loadProperty();
  }, [propertyId]);

  const loadProperty = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("properties")
      .select(`
        id,
        company_id,
        title,
        description,
        property_type,
        listing_type,
        location,
        city,
        state,
        price,
        bedrooms,
        bathrooms,
        toilets,
        land_size,
        land_size_unit,
        initial_deposit,
        installment_months,
        estates (
          name
        ),
        property_images (
          image_url,
          is_primary
        )
      `)
      .eq("id", propertyId)
      .eq("status", "available")
      .single();

    if (error) {
      console.error("Property loading error:", error);

      setProperty(null);
      setLoading(false);
      return;
    }

    const formatted = data as Property;

    setProperty(formatted);

    const images = formatted.property_images || [];

    const primary =
      images.find((image) => image.is_primary)?.image_url ||
      images[0]?.image_url ||
      "";

    setSelectedImage(primary);
    setLoading(false);
  };

  const getEstateName = () => {
    if (!property?.estates) {
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

  const getListingLabel = () => {
    if (!property) return "";

    if (property.listing_type === "sale") {
      return "For Sale";
    }

    if (property.listing_type === "rent") {
      return "For Rent";
    }

    if (property.listing_type === "lease") {
      return "For Lease";
    }

    return property.listing_type;
  };

  const getLocation = () => {
    if (!property) return "";

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

  const formatMoney = (
    value: number | null | undefined
  ) => {
    return `₦${Math.round(
      Number(value || 0)
    ).toLocaleString()}`;
  };

  const remainingBalance = property
    ? Math.max(
        Number(property.price || 0) -
          Number(property.initial_deposit || 0),
        0
      )
    : 0;

  const estimatedMonthlyPayment =
    property &&
    Number(property.installment_months) > 0 &&
    remainingBalance > 0
      ? remainingBalance /
        Number(property.installment_months)
      : 0;

  const openWhatsApp = () => {
    if (!property) return;

    const text = `
Hello Zertop Limited,

I'm interested in this property:

${property.title}
Estate: ${getEstateName()}
Location: ${getLocation()}
Price: ${formatMoney(property.price)}

Please send me more information.
    `.trim();

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      text
    )}`;

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const submitEnquiry = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!property) return;

    setSending(true);
    setMessage("");
    setMessageType(null);

    try {
      const enquiryStatus = inspectionDate
        ? "inspection_scheduled"
        : "new";

      const enquiryNotes = [
        notes.trim(),
        inspectionDate
          ? `Preferred inspection date: ${inspectionDate}`
          : "",
      ]
        .filter(Boolean)
        .join("\n");

      const { error } = await supabase
        .from("leads")
        .insert({
          company_id: property.company_id,
          property_id: property.id,
          customer_id: null,
          full_name: fullName.trim(),
          email: email.trim() || null,
          phone: phone.trim(),
          source: "Website",
          status: enquiryStatus,
          notes: enquiryNotes || null,
        });

      if (error) {
        throw error;
      }

      setFullName("");
      setEmail("");
      setPhone("");
      setInspectionDate("");
      setNotes("");

      setMessageType("success");

      setMessage(
        "Your enquiry has been sent successfully. Zertop Limited will contact you shortly."
      );
    } catch (error) {
      console.error("Enquiry error:", error);

      setMessageType("error");

      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage(
          "Unable to send your enquiry. Please try again."
        );
      }
    } finally {
      setSending(false);
    }
  };

  /* ================================
     LOADING
  ================================= */

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-[#0b1b35]">
        <div className="text-center">
          <img
            src="/zertop-logo.png"
            alt="Zertop Limited"
            className="mx-auto h-16 w-auto object-contain"
          />

          <p className="mt-6 text-gray-500">
            Loading property...
          </p>
        </div>
      </div>
    );
  }

  /* ================================
     NOT FOUND
  ================================= */

  if (!property) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#f8fafc] px-6 text-center text-[#0b1b35]">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-sm">
          <Building2
            size={40}
            className="text-gray-300"
          />
        </div>

        <h1 className="mt-6 text-2xl font-black">
          Property not available
        </h1>

        <p className="mt-3 max-w-md leading-7 text-gray-500">
          This property may have been removed or is no
          longer available.
        </p>

        <button
          type="button"
          onClick={onBack}
          className="mt-7 rounded-xl bg-gradient-to-r from-[#f5a400] via-[#f97316] to-[#ef233c] px-6 py-3 font-bold text-white shadow-lg shadow-orange-100"
        >
          Browse Other Properties
        </button>
      </div>
    );
  }

  const showBedrooms =
    Number(property.bedrooms) > 0;

  const showBathrooms =
    Number(property.bathrooms) > 0;

  const showToilets =
    Number(property.toilets) > 0;

  const showLandSize =
    property.land_size &&
    Number(property.land_size) > 0;

  const propertyImages =
    property.property_images || [];

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24 text-[#0b1b35] lg:pb-0">
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

            <span className="hidden sm:inline">
              Back to Properties
            </span>
          </button>
        </div>
      </header>

      {/* PROPERTY HEADING */}
      <section className="relative overflow-hidden border-b border-gray-200 bg-[#fffaf5]">
        <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-[#f5a400] via-[#f97316] to-[#ef233c]" />

        <div className="pointer-events-none absolute -left-32 top-0 h-80 w-80 rounded-full bg-yellow-100/60 blur-[100px]" />

        <div className="pointer-events-none absolute -right-20 top-0 h-80 w-80 rounded-full bg-red-100/60 blur-[100px]" />

        <div className="relative mx-auto max-w-7xl px-5 py-10 md:px-6 md:py-12">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-gradient-to-r from-[#f5a400] via-[#f97316] to-[#ef233c] px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-sm">
              {getListingLabel()}
            </span>

            <span className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-600 shadow-sm">
              {property.property_type}
            </span>
          </div>

          <h1 className="mt-5 max-w-4xl text-3xl font-black leading-tight text-[#0b1b35] md:text-4xl lg:text-5xl">
            {property.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
            <div className="flex items-center gap-2 text-gray-500">
              <MapPin
                size={18}
                className="text-[#f97316]"
              />

              <span>{getLocation()}</span>
            </div>

            <p className="font-bold text-[#f97316]">
              {getEstateName()}
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-5 py-8 md:px-6 md:py-10">
        <div className="grid gap-10 lg:grid-cols-[1.45fr_0.75fr]">
          {/* ================================
              LEFT COLUMN
          ================================= */}
          <div>
            {/* MAIN IMAGE */}
            <div className="relative overflow-hidden rounded-[30px] border border-gray-200 bg-white shadow-[0_25px_70px_rgba(15,23,42,0.10)]">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={property.title}
                  className="aspect-[16/10] w-full object-cover"
                />
              ) : (
                <div className="flex aspect-[16/10] items-center justify-center bg-gray-100 text-gray-400">
                  <div className="text-center">
                    <Building2
                      className="mx-auto"
                      size={42}
                    />

                    <p className="mt-3">
                      Property Image Coming Soon
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* THUMBNAILS */}
            {propertyImages.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5 md:grid-cols-6">
                {propertyImages.map(
                  (image, index) => (
                    <button
                      key={`${image.image_url}-${index}`}
                      type="button"
                      onClick={() =>
                        setSelectedImage(
                          image.image_url
                        )
                      }
                      className={`overflow-hidden rounded-xl border-2 bg-white transition ${
                        selectedImage ===
                        image.image_url
                          ? "border-[#f97316] shadow-md"
                          : "border-gray-200 hover:border-orange-300"
                      }`}
                    >
                      <img
                        src={image.image_url}
                        alt={`${property.title} ${
                          index + 1
                        }`}
                        className="aspect-square w-full object-cover"
                      />
                    </button>
                  )
                )}
              </div>
            )}

            {/* PRICE */}
            <div className="relative mt-8 overflow-hidden rounded-3xl border border-orange-100 bg-[#fffaf5] p-6 shadow-sm">
              <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-yellow-100/70 blur-3xl" />

              <div className="relative">
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-gray-400">
                  Property Price
                </p>

                <p className="mt-2 text-3xl font-black text-[#0b1b35] md:text-4xl">
                  {formatMoney(property.price)}
                </p>

                {Number(
                  property.initial_deposit
                ) > 0 && (
                  <p className="mt-4 text-sm leading-6 text-gray-600">
                    Start with an initial deposit of{" "}
                    <span className="font-black text-[#f97316]">
                      {formatMoney(
                        property.initial_deposit
                      )}
                    </span>
                  </p>
                )}
              </div>
            </div>

            {/* FEATURES */}
            {(showBedrooms ||
              showBathrooms ||
              showToilets ||
              showLandSize) && (
              <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                {showBedrooms && (
                  <FeatureCard
                    icon={
                      <BedDouble size={23} />
                    }
                    label="Bedrooms"
                    value={String(
                      property.bedrooms
                    )}
                  />
                )}

                {showBathrooms && (
                  <FeatureCard
                    icon={<Bath size={23} />}
                    label="Bathrooms"
                    value={String(
                      property.bathrooms
                    )}
                  />
                )}

                {showToilets && (
                  <FeatureCard
                    icon={<Toilet size={23} />}
                    label="Toilets"
                    value={String(
                      property.toilets
                    )}
                  />
                )}

                {showLandSize && (
                  <FeatureCard
                    icon={
                      <LandPlot size={23} />
                    }
                    label="Land Size"
                    value={`${Number(
                      property.land_size
                    ).toLocaleString()} ${
                      property.land_size_unit ||
                      "sqm"
                    }`}
                  />
                )}
              </div>
            )}

            {/* DESCRIPTION */}
            <section className="mt-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f97316]">
                Property Overview
              </p>

              <h2 className="mt-3 text-2xl font-black text-[#0b1b35]">
                About This Property
              </h2>

              {property.description ? (
                <p className="mt-5 whitespace-pre-line leading-8 text-gray-600">
                  {property.description}
                </p>
              ) : (
                <p className="mt-5 text-gray-500">
                  Contact Zertop Limited for more
                  information about this property.
                </p>
              )}
            </section>

            {/* PAYMENT PLAN */}
            {(Number(
              property.initial_deposit
            ) > 0 ||
              Number(
                property.installment_months
              ) > 0) && (
              <section className="relative mt-6 overflow-hidden rounded-3xl border border-orange-200 bg-white p-6 shadow-sm md:p-8">
                <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-[#f5a400] via-[#f97316] to-[#ef233c]" />

                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f97316]">
                  Payment Options
                </p>

                <h2 className="mt-3 text-2xl font-black text-[#0b1b35]">
                  Flexible Payment Plan
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Available payment information for this
                  property.
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {Number(
                    property.initial_deposit
                  ) > 0 && (
                    <div className="rounded-2xl border border-gray-200 bg-[#f8fafc] p-5">
                      <p className="text-sm text-gray-500">
                        Initial Deposit
                      </p>

                      <p className="mt-2 text-xl font-black text-[#0b1b35]">
                        {formatMoney(
                          property.initial_deposit
                        )}
                      </p>
                    </div>
                  )}

                  {Number(
                    property.installment_months
                  ) > 0 && (
                    <div className="rounded-2xl border border-gray-200 bg-[#f8fafc] p-5">
                      <p className="text-sm text-gray-500">
                        Installment Period
                      </p>

                      <p className="mt-2 text-xl font-black text-[#0b1b35]">
                        {
                          property.installment_months
                        }{" "}
                        months
                      </p>
                    </div>
                  )}

                  {estimatedMonthlyPayment >
                    0 && (
                    <div className="rounded-2xl border border-orange-100 bg-[#fffaf5] p-5 sm:col-span-2">
                      <p className="text-sm text-gray-500">
                        Estimated Monthly Balance
                      </p>

                      <p className="mt-2 text-xl font-black text-[#f97316]">
                        {formatMoney(
                          estimatedMonthlyPayment
                        )}
                      </p>

                      <p className="mt-2 text-xs leading-5 text-gray-400">
                        Estimate based on the listed
                        initial deposit and installment
                        period. Confirm final terms
                        directly with Zertop Limited.
                      </p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* TRUST */}
            <section className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="flex gap-4 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
                <ShieldCheck
                  className="shrink-0 text-[#f97316]"
                  size={25}
                />

                <div>
                  <h3 className="font-bold text-[#0b1b35]">
                    Guided Property Process
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    Get support from enquiry through
                    inspection and the next steps.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
                <CheckCircle2
                  className="shrink-0 text-[#ef233c]"
                  size={25}
                />

                <div>
                  <h3 className="font-bold text-[#0b1b35]">
                    Inspection Available
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    Request a convenient date to inspect
                    this property.
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* ================================
              RIGHT COLUMN
          ================================= */}
          <aside>
            <div
              id="enquiry"
              className="scroll-mt-28 space-y-5 lg:sticky lg:top-24"
            >
              {/* ENQUIRY CARD */}
              <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.10)]">
                <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-[#f5a400] via-[#f97316] to-[#ef233c]" />

                <h2 className="text-xl font-black text-[#0b1b35]">
                  Interested in this property?
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Speak directly with Zertop Limited or
                  submit an enquiry.
                </p>

                {/* WHATSAPP */}
                <button
                  type="button"
                  onClick={openWhatsApp}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#16a34a] px-5 py-3.5 font-bold text-white transition hover:bg-[#15803d]"
                >
                  <MessageCircle size={19} />
                  Chat on WhatsApp
                </button>

                <div className="my-6 flex items-center gap-3">
                  <div className="h-px flex-1 bg-gray-200" />

                  <span className="text-xs uppercase tracking-wider text-gray-400">
                    or send enquiry
                  </span>

                  <div className="h-px flex-1 bg-gray-200" />
                </div>

                <form
                  onSubmit={submitEnquiry}
                  className="space-y-4"
                >
                  <FormField label="Full Name *">
                    <input
                      value={fullName}
                      onChange={(e) =>
                        setFullName(
                          e.target.value
                        )
                      }
                      required
                      placeholder="Enter your name"
                      className={inputClass}
                    />
                  </FormField>

                  <FormField label="Phone Number *">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) =>
                        setPhone(
                          e.target.value
                        )
                      }
                      required
                      placeholder="Enter phone number"
                      className={inputClass}
                    />
                  </FormField>

                  <FormField label="Email Address">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) =>
                        setEmail(
                          e.target.value
                        )
                      }
                      placeholder="Enter email address"
                      className={inputClass}
                    />
                  </FormField>

                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-600">
                      <CalendarDays
                        size={16}
                        className="text-[#f97316]"
                      />

                      Preferred Inspection
                    </label>

                    <input
                      type="datetime-local"
                      value={inspectionDate}
                      onChange={(e) =>
                        setInspectionDate(
                          e.target.value
                        )
                      }
                      className={inputClass}
                    />
                  </div>

                  <FormField label="Message">
                    <textarea
                      value={notes}
                      onChange={(e) =>
                        setNotes(
                          e.target.value
                        )
                      }
                      rows={4}
                      placeholder="I'm interested in this property..."
                      className={`${inputClass} resize-none`}
                    />
                  </FormField>

                  {message && (
                    <div
                      className={`rounded-xl border p-4 text-sm leading-6 ${
                        messageType ===
                        "success"
                          ? "border-green-200 bg-green-50 text-green-700"
                          : "border-red-200 bg-red-50 text-red-700"
                      }`}
                    >
                      {message}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full rounded-xl bg-gradient-to-r from-[#f5a400] via-[#f97316] to-[#ef233c] py-3.5 font-bold text-white shadow-lg shadow-orange-100 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {sending
                      ? "Sending..."
                      : inspectionDate
                      ? "Request Property Inspection"
                      : "Send Property Enquiry"}
                  </button>
                </form>
              </div>

              {/* BRAND CARD */}
              <div className="rounded-3xl border border-gray-200 bg-white p-6 text-center shadow-sm">
                <img
                  src="/zertop-logo.png"
                  alt="Zertop Limited"
                  className="mx-auto h-14 w-auto object-contain"
                />

                <p className="mt-4 text-xs leading-5 text-gray-500">
                  Real Estate & Property Development
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* MOBILE CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white/95 p-3 shadow-[0_-10px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl lg:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-2 gap-3">
          <button
            type="button"
            onClick={openWhatsApp}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#16a34a] px-4 py-3 text-sm font-bold text-white"
          >
            <MessageCircle size={18} />
            WhatsApp
          </button>

          <button
            type="button"
            onClick={() => {
              document
                .getElementById(
                  "enquiry"
                )
                ?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
            }}
            className="rounded-xl bg-gradient-to-r from-[#f5a400] via-[#f97316] to-[#ef233c] px-4 py-3 text-sm font-bold text-white"
          >
            Book Inspection
          </button>
        </div>
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-[#0b1b35] outline-none transition placeholder:text-gray-400 focus:border-[#f97316] focus:bg-white focus:ring-2 focus:ring-orange-100";

type FormFieldProps = {
  label: string;
  children: ReactNode;
};

function FormField({
  label,
  children,
}: FormFieldProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-600">
        {label}
      </label>

      {children}
    </div>
  );
}

type FeatureCardProps = {
  icon: ReactNode;
  label: string;
  value: string;
};

function FeatureCard({
  icon,
  label,
  value,
}: FeatureCardProps) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="text-[#f97316]">
        {icon}
      </div>

      <p className="mt-4 text-sm text-gray-500">
        {label}
      </p>

      <p className="mt-1 text-lg font-black text-[#0b1b35]">
        {value}
      </p>
    </div>
  );
}