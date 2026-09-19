import {
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

import {
  Building2,
  CheckCircle2,
  Globe2,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";

import { supabase } from "../lib/supabase";

import PublicNavbar, {
  type PublicNavigationProps,
} from "../components/PublicNavbar";

import PublicFooter from "../components/PublicFooter";

type ContactProps = PublicNavigationProps;

const WHATSAPP_NUMBER = "2349042509860";

export default function Contact({
  onHome,
  onProperties,
  onDevelopments,
  onWhyZertop,
  onAbout,
  onContact,
  onStaffLogin,
}: ContactProps) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [messageBody, setMessageBody] = useState("");

  const [submitting, setSubmitting] =
    useState(false);

  const [formMessage, setFormMessage] =
    useState("");

  const [formMessageType, setFormMessageType] =
    useState<"success" | "error" | null>(null);

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

  const submitContactForm = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setFormMessage("");
    setFormMessageType(null);

    const cleanName = fullName.trim();
    const cleanPhone = phone.trim();
    const cleanEmail = email.trim();
    const cleanSubject = subject.trim();
    const cleanMessage = messageBody.trim();

    if (cleanName.length < 2) {
      setFormMessageType("error");
      setFormMessage(
        "Please enter your full name."
      );
      return;
    }

    if (cleanPhone.length < 7) {
      setFormMessageType("error");
      setFormMessage(
        "Please enter a valid phone number."
      );
      return;
    }

    if (
      cleanEmail &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        cleanEmail
      )
    ) {
      setFormMessageType("error");
      setFormMessage(
        "Please enter a valid email address."
      );
      return;
    }

    if (cleanSubject.length < 2) {
      setFormMessageType("error");
      setFormMessage(
        "Please enter an enquiry subject."
      );
      return;
    }

    if (cleanMessage.length < 5) {
      setFormMessageType("error");
      setFormMessage(
        "Please enter your message."
      );
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase.rpc(
        "submit_contact_enquiry",
        {
          p_full_name: cleanName,
          p_phone: cleanPhone,
          p_email: cleanEmail || null,
          p_subject: cleanSubject,
          p_message: cleanMessage,
        }
      );

      if (error) {
        throw error;
      }

      setFullName("");
      setPhone("");
      setEmail("");
      setSubject("");
      setMessageBody("");

      setFormMessageType("success");
      setFormMessage(
        "Thank you. Your enquiry has been sent successfully. The Zertop team will contact you shortly."
      );
    } catch (error) {
      console.error(
        "Contact form submission error:",
        error
      );

      setFormMessageType("error");

      if (error instanceof Error) {
        setFormMessage(error.message);
      } else {
        setFormMessage(
          "Unable to send your enquiry. Please try again or contact us on WhatsApp."
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#0b1b35]">
      {/* SHARED NAVBAR */}
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

          <div className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-yellow-100/70 blur-[100px]" />

          <div className="pointer-events-none absolute -right-20 top-0 h-80 w-80 rounded-full bg-red-100/60 blur-[110px]" />

          <div className="relative mx-auto max-w-7xl px-5 py-20 md:px-6 md:py-24">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#f97316]">
              Contact Zertop
            </p>

            <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight text-[#0b1b35] md:text-6xl">
              Start a conversation about your{" "}
              <span className="bg-gradient-to-r from-[#f5a400] via-[#f97316] to-[#ef233c] bg-clip-text text-transparent">
                property goals.
              </span>
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-8 text-gray-600 md:text-lg">
              Contact Zertop Limited for property enquiries,
              inspections, investment opportunities and
              information about our developments.
            </p>
          </div>
        </section>

        {/* CONTACT CARDS */}
        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-5 py-20 md:px-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <ContactCard
                icon={<Phone size={25} />}
                title="Call Us"
              >
                <a
                  href="tel:+2348135420099"
                  className="block transition hover:text-[#f97316]"
                >
                  0813 542 0099
                </a>

                <a
                  href="tel:+2349042509860"
                  className="mt-1 block transition hover:text-[#f97316]"
                >
                  0904 250 9860
                </a>
              </ContactCard>

              <ContactCard
                icon={<Mail size={25} />}
                title="Email"
              >
                <a
                  href="mailto:admin@zertoplimited.com"
                  className="block break-all transition hover:text-[#f97316]"
                >
                  admin@zertoplimited.com
                </a>

                <a
                  href="mailto:zertopreal@gmail.com"
                  className="mt-2 block break-all transition hover:text-[#f97316]"
                >
                  zertopreal@gmail.com
                </a>
              </ContactCard>

              <ContactCard
                icon={<Globe2 size={25} />}
                title="Website"
              >
                <a
                  href="https://www.zertoplimited.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-[#f97316]"
                >
                  www.zertoplimited.com
                </a>
              </ContactCard>

              <ContactCard
                icon={<MessageCircle size={25} />}
                title="WhatsApp"
              >
                <button
                  type="button"
                  onClick={openWhatsApp}
                  className="font-bold text-[#16a34a] transition hover:text-[#15803d]"
                >
                  Chat with Zertop
                </button>
              </ContactCard>
            </div>
          </div>
        </section>

        {/* CONTACT FORM */}
        <section className="border-y border-gray-200 bg-[#f8fafc]">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 md:px-6 lg:grid-cols-[0.85fr_1.15fr]">
            {/* TEXT */}
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#f97316]">
                Send an Enquiry
              </p>

              <h2 className="mt-4 text-3xl font-black leading-tight text-[#0b1b35] md:text-4xl">
                How can we help you?
              </h2>

              <p className="mt-5 max-w-lg leading-8 text-gray-600">
                Send us a message about a property,
                development, inspection or investment
                opportunity. A member of the Zertop team will
                follow up with you.
              </p>

              <div className="mt-8 rounded-3xl border border-orange-100 bg-[#fffaf5] p-6">
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#f97316] shadow-sm">
                    <MessageCircle size={22} />
                  </div>

                  <div>
                    <h3 className="font-bold text-[#0b1b35]">
                      Need a quicker response?
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      You can also speak directly with the
                      Zertop team through WhatsApp.
                    </p>

                    <button
                      type="button"
                      onClick={openWhatsApp}
                      className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#16a34a] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#15803d]"
                    >
                      <MessageCircle size={17} />
                      Chat on WhatsApp
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* FORM CARD */}
            <div className="rounded-[30px] border border-gray-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] md:p-8">
              <div className="mb-7">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#f97316]">
                  Contact Form
                </p>

                <h3 className="mt-2 text-2xl font-black">
                  Send us a message
                </h3>
              </div>

              {formMessage && (
                <div
                  className={`mb-6 rounded-2xl border p-4 text-sm ${
                    formMessageType === "success"
                      ? "border-green-200 bg-green-50 text-green-700"
                      : "border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {formMessageType === "success" && (
                      <CheckCircle2
                        size={19}
                        className="mt-0.5 shrink-0"
                      />
                    )}

                    <span>{formMessage}</span>
                  </div>
                </div>
              )}

              <form
                onSubmit={submitContactForm}
                className="space-y-5"
              >
                <div className="grid gap-5 md:grid-cols-2">
                  <FormField label="Full Name *">
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) =>
                        setFullName(e.target.value)
                      }
                      required
                      maxLength={100}
                      autoComplete="name"
                      placeholder="Your full name"
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
                      maxLength={30}
                      autoComplete="tel"
                      placeholder="e.g. 0801 234 5678"
                      className={inputClass}
                    />
                  </FormField>
                </div>

                <FormField label="Email Address">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    maxLength={160}
                    autoComplete="email"
                    placeholder="yourname@example.com"
                    className={inputClass}
                  />
                </FormField>

                <FormField label="Subject *">
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) =>
                      setSubject(e.target.value)
                    }
                    required
                    maxLength={150}
                    placeholder="What would you like to enquire about?"
                    className={inputClass}
                  />
                </FormField>

                <FormField label="Message *">
                  <textarea
                    value={messageBody}
                    onChange={(e) =>
                      setMessageBody(e.target.value)
                    }
                    required
                    maxLength={2000}
                    rows={6}
                    placeholder="Tell us how we can help you..."
                    className={`${inputClass} resize-none`}
                  />

                  <p className="mt-2 text-right text-xs text-gray-400">
                    {messageBody.length}/2000
                  </p>
                </FormField>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f5a400] via-[#f97316] to-[#ef233c] px-6 py-4 font-bold text-white shadow-lg shadow-orange-100 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <Loader2
                        size={19}
                        className="animate-spin"
                      />
                      Sending Enquiry...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Send Enquiry
                    </>
                  )}
                </button>

                <p className="text-center text-xs leading-5 text-gray-400">
                  Your information will only be used to respond
                  to your property enquiry.
                </p>
              </form>
            </div>
          </div>
        </section>

        {/* OFFICE */}
        <section className="bg-white">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 md:px-6 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#f97316]">
                Visit Our Office
              </p>

              <h2 className="mt-4 text-3xl font-black text-[#0b1b35] md:text-4xl">
                Zertop Limited, Lagos.
              </h2>

              <p className="mt-5 max-w-lg leading-8 text-gray-600">
                Visit the Zertop team for property discussions,
                development enquiries and investment
                consultations.
              </p>
            </div>

            <div className="relative overflow-hidden rounded-[30px] border border-orange-100 bg-white p-7 shadow-[0_20px_60px_rgba(15,23,42,0.08)] md:p-10">
              <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-yellow-100/70 blur-3xl" />

              <div className="relative flex gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50">
                  <MapPin
                    size={25}
                    className="text-[#f97316]"
                  />
                </div>

                <div>
                  <p className="text-sm font-bold text-gray-400">
                    Office Address
                  </p>

                  <p className="mt-3 max-w-xl text-lg font-bold leading-8 text-[#0b1b35]">
                    Suite 35 Awoyaya Shoping Plaza Opposite
                    Sunbet Filling Station Awoyaya Bus Stop
                    Lekki-Epe Expressway, Lagos, Nigeria.
                  </p>

                  <p className="mt-4 text-sm leading-6 text-gray-500">
                    Ibeju-Lekki / Lekki-Epe corridor.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* EXPLORE */}
        <section className="border-t border-gray-200 bg-[#f8fafc]">
          <div className="mx-auto max-w-7xl px-5 py-20 md:px-6">
            <div className="mb-9 max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#f97316]">
                Explore Zertop
              </p>

              <h2 className="mt-4 text-3xl font-black text-[#0b1b35] md:text-4xl">
                Continue exploring our property opportunities.
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <button
                type="button"
                onClick={onProperties}
                className="group rounded-3xl border border-gray-200 bg-white p-7 text-left shadow-sm transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50">
                  <Building2
                    size={27}
                    className="text-[#f97316]"
                  />
                </div>

                <h3 className="mt-5 text-xl font-bold text-[#0b1b35]">
                  Browse Properties
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  Explore currently available Zertop property
                  opportunities.
                </p>
              </button>

              <button
                type="button"
                onClick={onDevelopments}
                className="group rounded-3xl border border-gray-200 bg-white p-7 text-left shadow-sm transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50">
                  <MapPin
                    size={27}
                    className="text-[#f97316]"
                  />
                </div>

                <h3 className="mt-5 text-xl font-bold text-[#0b1b35]">
                  Our Developments
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  Discover Hilltop Gardens and Zertop&apos;s
                  growing development portfolio.
                </p>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* SHARED HOME FOOTER */}
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

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-[#0b1b35] outline-none transition placeholder:text-gray-400 focus:border-[#f97316] focus:bg-white focus:ring-2 focus:ring-orange-100";

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
      <label className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
      </label>

      {children}
    </div>
  );
}

type ContactCardProps = {
  icon: ReactNode;
  title: string;
  children: ReactNode;
};

function ContactCard({
  icon,
  title,
  children,
}: ContactCardProps) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-[#f8fafc] p-6 transition hover:-translate-y-1 hover:border-orange-200 hover:bg-white hover:shadow-lg">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-[#f97316]">
        {icon}
      </div>

      <h3 className="mt-5 text-lg font-bold text-[#0b1b35]">
        {title}
      </h3>

      <div className="mt-3 text-sm leading-6 text-gray-600">
        {children}
      </div>
    </div>
  );
}
