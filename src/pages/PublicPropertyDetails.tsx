import { useEffect, useState } from "react";

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
  initial_deposit: number;
  installment_months: number;

  estates:
    | {
        name: string;
      }
    | {
        name: string;
      }[]
    | null;

  property_images: PropertyImage[];
};

const WHATSAPP_NUMBER = "2349058910187";

export default function PublicPropertyDetails({
  propertyId,
  onBack,
}: PublicPropertyDetailsProps) {
  const [property, setProperty] = useState<Property | null>(null);

  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [inspectionDate, setInspectionDate] = useState("");
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
      return property.estates[0]?.name || "Zertop Limited";
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
      [property.location, property.city, property.state]
        .filter(Boolean)
        .join(", ") || "Location available on request"
    );
  };

  const formatMoney = (
    value: number | null | undefined
  ) => {
    return `₦${Number(value || 0).toLocaleString()}`;
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
    e: React.FormEvent<HTMLFormElement>
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
        notes,
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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080808] text-white">
        <div className="text-center">
          <img
            src="/zertop-logo.png"
            alt="Zertop Limited"
            className="mx-auto h-14 w-auto object-contain"
          />

          <p className="mt-6 text-white/45">
            Loading property...
          </p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#080808] px-6 text-center text-white">
        <Building2
          size={44}
          className="text-white/20"
        />

        <h1 className="mt-5 text-2xl font-bold">
          Property not available
        </h1>

        <p className="mt-3 max-w-md leading-7 text-white/45">
          This property may have been removed or is no
          longer available.
        </p>

        <button
          onClick={onBack}
          className="mt-7 rounded-xl bg-gradient-to-r from-[#f59e0b] via-[#f97316] to-[#dc2626] px-6 py-3 font-bold transition hover:brightness-110"
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

  return (
    <div className="min-h-screen bg-[#080808] pb-24 text-white lg:pb-0">
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

            <span className="hidden sm:inline">
              Back to Properties
            </span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8 md:px-6 md:py-10">
        {/* TITLE */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-gradient-to-r from-[#f59e0b] via-[#f97316] to-[#dc2626] px-3 py-1.5 text-xs font-bold uppercase tracking-wide">
              {getListingLabel()}
            </span>

            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/60">
              {property.property_type}
            </span>
          </div>

          <h1 className="mt-5 max-w-4xl text-3xl font-black leading-tight md:text-4xl lg:text-5xl">
            {property.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
            <div className="flex items-center gap-2 text-white/45">
              <MapPin
                size={18}
                className="text-[#f59e0b]"
              />

              <span>{getLocation()}</span>
            </div>

            <p className="font-semibold text-[#f59e0b]">
              {getEstateName()}
            </p>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.45fr_0.75fr]">
          {/* LEFT */}
          <div>
            {/* MAIN IMAGE */}
            <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#111111] shadow-[0_25px_80px_rgba(0,0,0,0.35)]">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={property.title}
                  className="aspect-[16/10] w-full object-cover"
                />
              ) : (
                <div className="flex aspect-[16/10] items-center justify-center bg-[#111111] text-white/30">
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

              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/40 to-transparent" />
            </div>

            {/* THUMBNAILS */}
            {property.property_images?.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5 md:grid-cols-6">
                {property.property_images.map(
                  (image, index) => (
                    <button
                      key={`${image.image_url}-${index}`}
                      type="button"
                      onClick={() =>
                        setSelectedImage(
                          image.image_url
                        )
                      }
                      className={`overflow-hidden rounded-xl border-2 transition ${
                        selectedImage === image.image_url
                          ? "border-[#f59e0b]"
                          : "border-white/10 hover:border-white/25"
                      }`}
                    >
                      <img
                        src={image.image_url}
                        alt={`${property.title} ${index + 1}`}
                        className="aspect-square w-full object-cover"
                      />
                    </button>
                  )
                )}
              </div>
            )}

            {/* PRICE */}
            <div className="relative mt-8 overflow-hidden rounded-2xl border border-white/10 bg-[#111111] p-6">
              <div className="absolute right-[-60px] top-[-60px] h-40 w-40 rounded-full bg-[#f59e0b]/10 blur-3xl" />

              <div className="relative">
                <p className="text-sm uppercase tracking-[0.16em] text-white/35">
                  Property Price
                </p>

                <p className="mt-2 text-3xl font-black md:text-4xl">
                  {formatMoney(property.price)}
                </p>

                {Number(property.initial_deposit) >
                  0 && (
                  <p className="mt-4 text-sm leading-6 text-white/45">
                    Start with an initial deposit of{" "}
                    <span className="font-bold text-[#f59e0b]">
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
                    icon={
                      <Toilet size={23} />
                    }
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
            <section className="mt-8 rounded-2xl border border-white/10 bg-[#111111] p-6 md:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f59e0b]">
                Property Overview
              </p>

              <h2 className="mt-3 text-2xl font-bold">
                About This Property
              </h2>

              {property.description ? (
                <p className="mt-5 whitespace-pre-line leading-8 text-white/50">
                  {property.description}
                </p>
              ) : (
                <p className="mt-5 text-white/40">
                  Contact Zertop Limited for more
                  information about this property.
                </p>
              )}
            </section>

            {/* PAYMENT PLAN */}
            {(Number(property.initial_deposit) > 0 ||
              Number(property.installment_months) >
                0) && (
              <section className="relative mt-6 overflow-hidden rounded-2xl border border-[#f59e0b]/25 bg-[#111111] p-6 md:p-8">
                <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-[#f59e0b] via-[#f97316] to-[#dc2626]" />

                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f59e0b]">
                  Payment Options
                </p>

                <h2 className="mt-3 text-2xl font-bold">
                  Flexible Payment Plan
                </h2>

                <p className="mt-2 text-sm text-white/45">
                  Available payment information for
                  this property.
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {Number(
                    property.initial_deposit
                  ) > 0 && (
                    <div className="rounded-xl border border-white/10 bg-[#080808] p-5">
                      <p className="text-sm text-white/35">
                        Initial Deposit
                      </p>

                      <p className="mt-2 text-xl font-bold">
                        {formatMoney(
                          property.initial_deposit
                        )}
                      </p>
                    </div>
                  )}

                  {Number(
                    property.installment_months
                  ) > 0 && (
                    <div className="rounded-xl border border-white/10 bg-[#080808] p-5">
                      <p className="text-sm text-white/35">
                        Installment Period
                      </p>

                      <p className="mt-2 text-xl font-bold">
                        {
                          property.installment_months
                        }{" "}
                        months
                      </p>
                    </div>
                  )}

                  {estimatedMonthlyPayment > 0 && (
                    <div className="rounded-xl border border-white/10 bg-[#080808] p-5 sm:col-span-2">
                      <p className="text-sm text-white/35">
                        Estimated Monthly Balance
                      </p>

                      <p className="mt-2 text-xl font-bold text-[#f59e0b]">
                        {formatMoney(
                          estimatedMonthlyPayment
                        )}
                      </p>

                      <p className="mt-2 text-xs leading-5 text-white/30">
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
              <div className="flex gap-4 rounded-2xl border border-white/10 bg-[#111111] p-5">
                <ShieldCheck
                  className="shrink-0 text-[#f59e0b]"
                  size={25}
                />

                <div>
                  <h3 className="font-semibold">
                    Guided Property Process
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-white/40">
                    Get support from enquiry through
                    inspection and the next steps.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 rounded-2xl border border-white/10 bg-[#111111] p-5">
                <CheckCircle2
                  className="shrink-0 text-[#dc2626]"
                  size={25}
                />

                <div>
                  <h3 className="font-semibold">
                    Inspection Available
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-white/40">
                    Request a convenient date to inspect
                    this property.
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT */}
          <aside>
            <div
              id="enquiry"
              className="sticky top-24 space-y-5"
            >
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#111111] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.3)]">
                <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-[#f59e0b] via-[#f97316] to-[#dc2626]" />

                <h2 className="text-xl font-bold">
                  Interested in this property?
                </h2>

                <p className="mt-2 text-sm leading-6 text-white/45">
                  Speak directly with Zertop Limited or
                  submit an enquiry.
                </p>

                {/* WHATSAPP */}
                <button
                  type="button"
                  onClick={openWhatsApp}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#16a34a] px-5 py-3.5 font-bold transition hover:bg-[#15803d]"
                >
                  <MessageCircle size={19} />
                  Chat on WhatsApp
                </button>

                <div className="my-6 flex items-center gap-3">
                  <div className="h-px flex-1 bg-white/10" />

                  <span className="text-xs uppercase tracking-wider text-white/25">
                    or send enquiry
                  </span>

                  <div className="h-px flex-1 bg-white/10" />
                </div>

                <form
                  onSubmit={submitEnquiry}
                  className="space-y-4"
                >
                  <FormField label="Full Name *">
                    <input
                      value={fullName}
                      onChange={(e) =>
                        setFullName(e.target.value)
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
                        setPhone(e.target.value)
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
                        setEmail(e.target.value)
                      }
                      placeholder="Enter email address"
                      className={inputClass}
                    />
                  </FormField>

                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm text-white/50">
                      <CalendarDays
                        size={16}
                        className="text-[#f59e0b]"
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
                      className={`${inputClass} [color-scheme:dark]`}
                    />
                  </div>

                  <FormField label="Message">
                    <textarea
                      value={notes}
                      onChange={(e) =>
                        setNotes(e.target.value)
                      }
                      rows={4}
                      placeholder="I'm interested in this property..."
                      className={`${inputClass} resize-none`}
                    />
                  </FormField>

                  {message && (
                    <div
                      className={`rounded-xl border p-4 text-sm leading-6 ${
                        messageType === "success"
                          ? "border-green-500/30 bg-green-500/10 text-green-300"
                          : "border-red-500/30 bg-red-500/10 text-red-300"
                      }`}
                    >
                      {message}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full rounded-xl bg-gradient-to-r from-[#f59e0b] via-[#f97316] to-[#dc2626] py-3.5 font-bold transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {sending
                      ? "Sending..."
                      : inspectionDate
                      ? "Request Property Inspection"
                      : "Send Property Enquiry"}
                  </button>
                </form>
              </div>

              {/* BRAND */}
              <div className="rounded-2xl border border-white/10 bg-[#111111] p-5 text-center">
                <img
                  src="/zertop-logo.png"
                  alt="Zertop Limited"
                  className="mx-auto h-11 w-auto object-contain"
                />

                <p className="mt-4 text-xs leading-5 text-white/35">
                  Real Estate & Property Development
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* MOBILE CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#080808]/95 p-3 backdrop-blur-xl lg:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-2 gap-3">
          <button
            type="button"
            onClick={openWhatsApp}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#16a34a] px-4 py-3 text-sm font-bold"
          >
            <MessageCircle size={18} />
            WhatsApp
          </button>

          <button
            type="button"
            onClick={() => {
              document
                .getElementById("enquiry")
                ?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
            }}
            className="rounded-xl bg-gradient-to-r from-[#f59e0b] via-[#f97316] to-[#dc2626] px-4 py-3 text-sm font-bold"
          >
            Book Inspection
          </button>
        </div>
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-white/10 bg-[#080808] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#f59e0b]/70";

type FormFieldProps = {
  label: string;
  children: React.ReactNode;
};

function FormField({
  label,
  children,
}: FormFieldProps) {
  return (
    <div>
      <label className="mb-2 block text-sm text-white/50">
        {label}
      </label>

      {children}
    </div>
  );
}

type FeatureCardProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

function FeatureCard({
  icon,
  label,
  value,
}: FeatureCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#111111] p-5">
      <div className="text-[#f59e0b]">
        {icon}
      </div>

      <p className="mt-4 text-sm text-white/35">
        {label}
      </p>

      <p className="mt-1 text-lg font-bold">
        {value}
      </p>
    </div>
  );
}