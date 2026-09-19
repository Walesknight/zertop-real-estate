import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowLeft,
  Mail,
  MessageCircle,
  Phone,
  Search,
  UserRoundSearch,
} from "lucide-react";

import { supabase } from "../lib/supabase";

type Lead = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  source: string | null;
  status: string;
  notes: string | null;
  property_id: string | null;
  created_at: string | null;
};

type Property = {
  id: string;
  title: string;
};

type LeadsProps = {
  onBack: () => void;
};

type MessageType =
  | "success"
  | "error"
  | null;

export default function Leads({
  onBack,
}: LeadsProps) {
  const [companyId, setCompanyId] =
    useState<string | null>(null);

  const [leads, setLeads] =
    useState<Lead[]>([]);

  const [properties, setProperties] =
    useState<Property[]>([]);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [pageLoading, setPageLoading] =
    useState(true);

  const [updatingLeadId, setUpdatingLeadId] =
    useState<string | null>(null);

  const [message, setMessage] =
    useState("");

  const [messageType, setMessageType] =
    useState<MessageType>(null);

  /* =====================================
     INITIAL LOAD
  ===================================== */

  useEffect(() => {
    loadCompany();
  }, []);

  useEffect(() => {
    if (!companyId) return;

    Promise.all([
      loadLeads(),
      loadProperties(),
    ]).finally(() => {
      setPageLoading(false);
    });
  }, [companyId]);

  /* =====================================
     COMPANY
  ===================================== */

  const loadCompany = async () => {
    setPageLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessageType("error");
      setMessage(
        "Unable to find the logged-in user."
      );

      setPageLoading(false);
      return;
    }

    const {
      data: staffMember,
      error: staffError,
    } = await supabase
      .from("staff_members")
      .select("company_id")
      .eq("user_id", user.id)
      .eq("active", true)
      .maybeSingle();

    if (staffError) {
      console.error(
        "Staff company lookup error:",
        staffError
      );
    }

    if (staffMember?.company_id) {
      setCompanyId(
        staffMember.company_id
      );
      return;
    }

    const {
      data: company,
      error: companyError,
    } = await supabase
      .from("companies")
      .select("id")
      .eq("owner_id", user.id)
      .maybeSingle();

    if (companyError) {
      console.error(
        "Company lookup error:",
        companyError
      );
    }

    if (!company?.id) {
      setMessageType("error");

      setMessage(
        "This staff account is not linked to a company."
      );

      setPageLoading(false);
      return;
    }

    setCompanyId(company.id);
  };

  /* =====================================
     LOAD LEADS
  ===================================== */

  const loadLeads = async () => {
    if (!companyId) return;

    const { data, error } =
      await supabase
        .from("leads")
        .select(`
          id,
          full_name,
          email,
          phone,
          source,
          status,
          notes,
          property_id,
          created_at
        `)
        .eq(
          "company_id",
          companyId
        )
        .order("created_at", {
          ascending: false,
        });

    if (error) {
      console.error(
        "Leads loading error:",
        error
      );

      setMessageType("error");
      setMessage(error.message);
      return;
    }

    setLeads(data || []);
  };

  /* =====================================
     LOAD PROPERTIES
  ===================================== */

  const loadProperties = async () => {
    if (!companyId) return;

    const { data, error } =
      await supabase
        .from("properties")
        .select("id,title")
        .eq(
          "company_id",
          companyId
        )
        .order("title");

    if (error) {
      console.error(
        "Properties loading error:",
        error
      );

      return;
    }

    setProperties(data || []);
  };

  /* =====================================
     STATUS ONLY
  ===================================== */

  const updateLeadStatus = async (
    leadId: string,
    newStatus: string
  ) => {
    if (!companyId) return;

    setUpdatingLeadId(leadId);
    setMessage("");
    setMessageType(null);

    const { error } =
      await supabase
        .from("leads")
        .update({
          status: newStatus,
        })
        .eq("id", leadId)
        .eq(
          "company_id",
          companyId
        );

    if (error) {
      setMessageType("error");
      setMessage(error.message);

      setUpdatingLeadId(null);
      return;
    }

    setLeads((current) =>
      current.map((lead) =>
        lead.id === leadId
          ? {
              ...lead,
              status: newStatus,
            }
          : lead
      )
    );

    setMessageType("success");
    setMessage(
      "Lead status updated successfully."
    );

    setUpdatingLeadId(null);
  };

  /* =====================================
     HELPERS
  ===================================== */

  const getPropertyName = (
    id: string | null
  ) => {
    if (!id) {
      return null;
    }

    return (
      properties.find(
        (property) =>
          property.id === id
      )?.title || "Property"
    );
  };

  const formatStatus = (
    value: string
  ) => {
    return value
      .replaceAll("_", " ")
      .replace(
        /\b\w/g,
        (letter) =>
          letter.toUpperCase()
      );
  };

  const getStatusClass = (
    value: string
  ) => {
    switch (value) {
      case "new":
        return "bg-blue-50 text-blue-700";

      case "contacted":
        return "bg-yellow-50 text-yellow-700";

      case "inspection_scheduled":
        return "bg-purple-50 text-purple-700";

      case "negotiating":
        return "bg-orange-50 text-[#f97316]";

      case "won":
        return "bg-green-50 text-green-700";

      case "lost":
        return "bg-red-50 text-red-600";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getFirstName = (
    fullName: string | null
  ) => {
    if (!fullName) {
      return "there";
    }

    return (
      fullName
        .trim()
        .split(/\s+/)[0] ||
      "there"
    );
  };

  /* =====================================
     WHATSAPP REPLY
  ===================================== */

  const openWhatsApp = (
    lead: Lead
  ) => {
    if (!lead.phone) return;

    const cleanedPhone =
      lead.phone.replace(
        /\D/g,
        ""
      );

    let whatsappPhone =
      cleanedPhone;

    if (
      cleanedPhone.startsWith(
        "0"
      )
    ) {
      whatsappPhone = `234${cleanedPhone.slice(
        1
      )}`;
    }

    const propertyName =
      getPropertyName(
        lead.property_id
      );

    const propertyText =
      propertyName
        ? ` regarding ${propertyName}`
        : "";

    const replyMessage = `
Hello ${getFirstName(
      lead.full_name
    )},

Thank you for contacting Zertop Limited${propertyText}.

We received your enquiry and would be happy to assist you.

How may we help you further?
    `.trim();

    const url =
      `https://wa.me/${whatsappPhone}` +
      `?text=${encodeURIComponent(
        replyMessage
      )}`;

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  };

  /* =====================================
     EMAIL REPLY
  ===================================== */

  const getEmailLink = (
    lead: Lead
  ) => {
    if (!lead.email) return "#";

    const propertyName =
      getPropertyName(
        lead.property_id
      );

    const subject =
      propertyName
        ? `Re: Your enquiry about ${propertyName}`
        : "Re: Your enquiry to Zertop Limited";

    const propertyText =
      propertyName
        ? ` regarding ${propertyName}`
        : "";

    const body = `
Hello ${getFirstName(
      lead.full_name
    )},

Thank you for contacting Zertop Limited${propertyText}.

We received your enquiry and would be happy to assist you.

Please let us know how we may help you further.

Regards,
Zertop Limited
    `.trim();

    return `mailto:${lead.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(
      body
    )}`;
  };

  const formatDate = (
    value: string | null
  ) => {
    if (!value) return "";

    return new Date(
      value
    ).toLocaleDateString(
      "en-NG",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  /* =====================================
     FILTERS
  ===================================== */

  const filteredLeads =
    useMemo(() => {
      const term =
        search
          .trim()
          .toLowerCase();

      return leads.filter(
        (lead) => {
          const matchesStatus =
            statusFilter ===
              "all" ||
            lead.status ===
              statusFilter;

          const propertyName =
            getPropertyName(
              lead.property_id
            );

          const matchesSearch =
            !term ||
            lead.full_name
              ?.toLowerCase()
              .includes(term) ||
            lead.email
              ?.toLowerCase()
              .includes(term) ||
            lead.phone
              ?.toLowerCase()
              .includes(term) ||
            lead.source
              ?.toLowerCase()
              .includes(term) ||
            propertyName
              ?.toLowerCase()
              .includes(term) ||
            lead.notes
              ?.toLowerCase()
              .includes(term);

          return (
            matchesStatus &&
            Boolean(
              matchesSearch
            )
          );
        }
      );
    }, [
      leads,
      search,
      statusFilter,
      properties,
    ]);

  const newLeadCount =
    leads.filter(
      (lead) =>
        lead.status === "new"
    ).length;

  const inspectionCount =
    leads.filter(
      (lead) =>
        lead.status ===
        "inspection_scheduled"
    ).length;

  const wonCount =
    leads.filter(
      (lead) =>
        lead.status === "won"
    ).length;

  /* =====================================
     UI
  ===================================== */

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0b1b35]">
      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 md:px-6">
          <div className="flex items-center gap-4">
            <img
              src="/zertop-logo.png"
              alt="Zertop Limited"
              className="h-11 w-auto object-contain md:h-14"
            />

            <div className="hidden border-l border-gray-200 pl-4 sm:block">
              <p className="text-sm font-bold">
                Lead Management
              </p>

              <p className="text-xs text-gray-400">
                Zertop CRM
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:border-orange-200 hover:bg-orange-50 hover:text-[#f97316]"
          >
            <ArrowLeft
              size={17}
            />

            <span className="hidden sm:inline">
              Dashboard
            </span>
          </button>
        </div>

        <div className="h-1 bg-gradient-to-r from-[#f5a400] via-[#f97316] to-[#ef233c]" />
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8 md:px-6 md:py-10">
        {/* TITLE */}
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f97316]">
            CRM
          </p>

          <h1 className="mt-2 text-3xl font-black md:text-4xl">
            Leads
          </h1>

          <p className="mt-2 max-w-2xl text-gray-500">
            View customer enquiries,
            reply to prospects and
            manage each lead through
            the sales process.
          </p>
        </div>

        {/* SUMMARY */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            title="Total Leads"
            value={leads.length}
          />

          <SummaryCard
            title="New Leads"
            value={newLeadCount}
          />

          <SummaryCard
            title="Inspections"
            value={
              inspectionCount
            }
          />

          <SummaryCard
            title="Won"
            value={wonCount}
          />
        </div>

        {/* MESSAGE */}
        {message && (
          <div
            className={`mb-6 rounded-2xl border p-4 text-sm ${
              messageType ===
              "success"
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        {/* SEARCH */}
        <div className="mb-6 grid gap-3 sm:grid-cols-[1fr_220px]">
          <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 shadow-sm focus-within:border-orange-300">
            <Search
              size={19}
              className="shrink-0 text-[#f97316]"
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search name, phone, email, property..."
              className="w-full bg-transparent py-3.5 text-sm outline-none placeholder:text-gray-400"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
            className={inputClass}
          >
            <option value="all">
              All Statuses
            </option>

            <option value="new">
              New
            </option>

            <option value="contacted">
              Contacted
            </option>

            <option value="inspection_scheduled">
              Inspection Scheduled
            </option>

            <option value="negotiating">
              Negotiating
            </option>

            <option value="won">
              Won
            </option>

            <option value="lost">
              Lost
            </option>
          </select>
        </div>

        {/* CONTENT */}
        {pageLoading ? (
          <div className="rounded-3xl border border-gray-200 bg-white p-12 text-center shadow-sm">
            <img
              src="/zertop-logo.png"
              alt="Zertop Limited"
              className="mx-auto h-14 w-auto object-contain"
            />

            <p className="mt-5 text-gray-500">
              Loading leads...
            </p>
          </div>
        ) : filteredLeads.length ===
          0 ? (
          <div className="rounded-3xl border border-gray-200 bg-white p-12 text-center shadow-sm">
            <UserRoundSearch
              size={40}
              className="mx-auto text-gray-300"
            />

            <h3 className="mt-4 text-lg font-bold">
              {search ||
              statusFilter !==
                "all"
                ? "No matching leads"
                : "No leads yet"}
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Website and contact
              enquiries will appear
              here.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredLeads.map(
              (lead) => {
                const propertyName =
                  getPropertyName(
                    lead.property_id
                  );

                return (
                  <article
                    key={lead.id}
                    className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-orange-200 hover:shadow-md md:p-6"
                  >
                    {/* TOP */}
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase ${getStatusClass(
                              lead.status
                            )}`}
                          >
                            {formatStatus(
                              lead.status
                            )}
                          </span>

                          {lead.source && (
                            <span className="rounded-full bg-gray-100 px-3 py-1 text-[11px] font-bold text-gray-600">
                              {
                                lead.source
                              }
                            </span>
                          )}

                          {lead.created_at && (
                            <span className="text-xs text-gray-400">
                              {formatDate(
                                lead.created_at
                              )}
                            </span>
                          )}
                        </div>

                        <h3 className="mt-4 text-xl font-black">
                          {lead.full_name ||
                            "Unnamed Lead"}
                        </h3>

                        <p className="mt-2 text-sm text-gray-500">
                          {propertyName ? (
                            <>
                              Interested in{" "}
                              <span className="font-semibold text-[#0b1b35]">
                                {
                                  propertyName
                                }
                              </span>
                            </>
                          ) : (
                            "General enquiry"
                          )}
                        </p>
                      </div>

                      {/* STATUS */}
                      <div className="w-full lg:w-56">
                        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-400">
                          Lead Status
                        </label>

                        <select
                          value={
                            lead.status
                          }
                          disabled={
                            updatingLeadId ===
                            lead.id
                          }
                          onChange={(e) =>
                            updateLeadStatus(
                              lead.id,
                              e.target
                                .value
                            )
                          }
                          className={inputClass}
                        >
                          <option value="new">
                            New
                          </option>

                          <option value="contacted">
                            Contacted
                          </option>

                          <option value="inspection_scheduled">
                            Inspection
                            Scheduled
                          </option>

                          <option value="negotiating">
                            Negotiating
                          </option>

                          <option value="won">
                            Won
                          </option>

                          <option value="lost">
                            Lost
                          </option>
                        </select>
                      </div>
                    </div>

                    {/* REPLY ACTIONS */}
                    <div className="mt-5 flex flex-wrap gap-2">
                      {lead.phone && (
                        <>
                          <a
                            href={`tel:${lead.phone}`}
                            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-100"
                          >
                            <Phone
                              size={15}
                            />
                            Call
                          </a>

                          <button
                            type="button"
                            onClick={() =>
                              openWhatsApp(
                                lead
                              )
                            }
                            className="flex items-center gap-2 rounded-xl bg-green-50 px-4 py-2.5 text-xs font-bold text-green-700 transition hover:bg-green-100"
                          >
                            <MessageCircle
                              size={15}
                            />
                            Reply on
                            WhatsApp
                          </button>
                        </>
                      )}

                      {lead.email && (
                        <a
                          href={getEmailLink(
                            lead
                          )}
                          className="flex items-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-4 py-2.5 text-xs font-bold text-[#f97316] transition hover:bg-orange-100"
                        >
                          <Mail
                            size={15}
                          />
                          Reply by Email
                        </a>
                      )}
                    </div>

                    {/* CONTACT DETAILS */}
                    <div className="mt-5 grid gap-4 rounded-2xl bg-[#f8fafc] p-4 text-sm sm:grid-cols-2">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                          Phone
                        </p>

                        <p className="mt-1 font-medium text-[#0b1b35]">
                          {lead.phone ||
                            "Not provided"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                          Email
                        </p>

                        <p className="mt-1 break-all font-medium text-[#0b1b35]">
                          {lead.email ||
                            "Not provided"}
                        </p>
                      </div>
                    </div>

                    {/* ORIGINAL ENQUIRY */}
                    {lead.notes && (
                      <div className="mt-5 rounded-2xl border border-gray-100 bg-white p-4">
                        <p className="text-xs font-bold uppercase tracking-[0.15em] text-gray-400">
                          Customer
                          Enquiry
                        </p>

                        <p className="mt-3 whitespace-pre-line text-sm leading-7 text-gray-600">
                          {
                            lead.notes
                          }
                        </p>
                      </div>
                    )}
                  </article>
                );
              }
            )}
          </div>
        )}
      </main>
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-[#0b1b35] outline-none transition focus:border-[#f97316] focus:bg-white focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:opacity-60";

type SummaryCardProps = {
  title: string;
  value: number;
};

function SummaryCard({
  title,
  value,
}: SummaryCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-gray-500">
        {title}
      </p>

      <p className="mt-2 text-2xl font-black text-[#0b1b35]">
        {value}
      </p>
    </div>
  );
}