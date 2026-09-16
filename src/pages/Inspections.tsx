import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Pencil,
  Search,
  Trash2,
  UserRound,
  XCircle,
} from "lucide-react";

import { supabase } from "../lib/supabase";

type Inspection = {
  id: string;
  customer_id: string | null;
  property_id: string;
  inspection_date: string;
  status: string;
  notes: string | null;
};

type Customer = {
  id: string;
  full_name: string;
};

type Property = {
  id: string;
  title: string;
};

type InspectionsProps = {
  onBack: () => void;
};

type MessageType = "success" | "error" | null;

export default function Inspections({
  onBack,
}: InspectionsProps) {
  const [companyId, setCompanyId] = useState<string | null>(
    null
  );

  const [inspections, setInspections] = useState<Inspection[]>(
    []
  );

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);

  const [editingId, setEditingId] = useState<string | null>(
    null
  );

  const [customerId, setCustomerId] = useState("");
  const [propertyId, setPropertyId] = useState("");
  const [inspectionDate, setInspectionDate] = useState("");
  const [status, setStatus] = useState("scheduled");
  const [notes, setNotes] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const [message, setMessage] = useState("");
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
      loadInspections(),
      loadCustomers(),
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
      setMessage("Unable to find the logged-in user.");
      setPageLoading(false);
      return;
    }

    // Main lookup for Admin, Manager, Realtor and Staff accounts.
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
      setCompanyId(staffMember.company_id);
      return;
    }

    // Fallback for legacy owner account.
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
     LOAD INSPECTIONS
  ===================================== */

  const loadInspections = async () => {
    if (!companyId) return;

    const { data, error } = await supabase
      .from("inspections")
      .select(
        `
          id,
          customer_id,
          property_id,
          inspection_date,
          status,
          notes
        `
      )
      .eq("company_id", companyId)
      .order("inspection_date", {
        ascending: true,
      });

    if (error) {
      console.error(
        "Inspections loading error:",
        error
      );

      setMessageType("error");
      setMessage(error.message);
      return;
    }

    setInspections(data || []);
  };

  /* =====================================
     LOAD CUSTOMERS
  ===================================== */

  const loadCustomers = async () => {
    if (!companyId) return;

    const { data, error } = await supabase
      .from("customers")
      .select("id,full_name")
      .eq("company_id", companyId)
      .order("full_name");

    if (error) {
      console.error(
        "Customers loading error:",
        error
      );
      return;
    }

    setCustomers(data || []);
  };

  /* =====================================
     LOAD PROPERTIES
  ===================================== */

  const loadProperties = async () => {
    if (!companyId) return;

    const { data, error } = await supabase
      .from("properties")
      .select("id,title")
      .eq("company_id", companyId)
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
     FORM
  ===================================== */

  const resetForm = () => {
    setEditingId(null);
    setCustomerId("");
    setPropertyId("");
    setInspectionDate("");
    setStatus("scheduled");
    setNotes("");
  };

  const saveInspection = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!companyId) {
      setMessageType("error");
      setMessage("Company not found.");
      return;
    }

    if (!propertyId) {
      setMessageType("error");
      setMessage("Please select a property.");
      return;
    }

    if (!inspectionDate) {
      setMessageType("error");
      setMessage("Please select an inspection date.");
      return;
    }

    setLoading(true);
    setMessage("");
    setMessageType(null);

    try {
      const date = new Date(inspectionDate);

      if (Number.isNaN(date.getTime())) {
        throw new Error(
          "Please enter a valid inspection date."
        );
      }

      const inspectionData = {
        company_id: companyId,
        customer_id: customerId || null,
        property_id: propertyId,
        inspection_date: date.toISOString(),
        status,
        notes: notes.trim() || null,
      };

      if (editingId) {
        const { error } = await supabase
          .from("inspections")
          .update(inspectionData)
          .eq("id", editingId)
          .eq("company_id", companyId);

        if (error) {
          throw error;
        }

        setMessageType("success");
        setMessage(
          "Inspection updated successfully."
        );
      } else {
        const { error } = await supabase
          .from("inspections")
          .insert(inspectionData);

        if (error) {
          throw error;
        }

        setMessageType("success");
        setMessage(
          "Inspection scheduled successfully."
        );
      }

      resetForm();
      await loadInspections();
    } catch (error) {
      console.error(
        "Inspection save error:",
        error
      );

      setMessageType("error");

      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  /* =====================================
     EDIT
  ===================================== */

  const startEditing = (
    inspection: Inspection
  ) => {
    setEditingId(inspection.id);

    setCustomerId(
      inspection.customer_id || ""
    );

    setPropertyId(
      inspection.property_id
    );

    const date =
      new Date(
        inspection.inspection_date
      );

    const localDate = new Date(
      date.getTime() -
        date.getTimezoneOffset() *
          60000
    )
      .toISOString()
      .slice(0, 16);

    setInspectionDate(localDate);

    setStatus(
      inspection.status
    );

    setNotes(
      inspection.notes || ""
    );

    setMessage("");
    setMessageType(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =====================================
     DELETE
  ===================================== */

  const deleteInspection = async (
    id: string
  ) => {
    if (!companyId) return;

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this inspection?"
      );

    if (!confirmed) return;

    const { error } = await supabase
      .from("inspections")
      .delete()
      .eq("id", id)
      .eq("company_id", companyId);

    if (error) {
      setMessageType("error");
      setMessage(error.message);
      return;
    }

    if (editingId === id) {
      resetForm();
    }

    setMessageType("success");
    setMessage(
      "Inspection deleted successfully."
    );

    await loadInspections();
  };

  /* =====================================
     HELPERS
  ===================================== */

  const getCustomerName = (
    id: string | null
  ) => {
    if (!id) {
      return "No customer assigned";
    }

    return (
      customers.find(
        (customer) =>
          customer.id === id
      )?.full_name || "Customer"
    );
  };

  const getPropertyName = (
    id: string
  ) => {
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
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };

  const getStatusClass = (
    value: string
  ) => {
    switch (value) {
      case "scheduled":
        return "bg-blue-50 text-blue-700";

      case "completed":
        return "bg-green-50 text-green-700";

      case "cancelled":
        return "bg-red-50 text-red-600";

      case "rescheduled":
        return "bg-orange-50 text-[#f97316]";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const formatInspectionDate = (
    value: string
  ) => {
    return new Date(
      value
    ).toLocaleString(
      "en-NG",
      {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }
    );
  };

  /* =====================================
     FILTER
  ===================================== */

  const filteredInspections =
    useMemo(() => {
      const term =
        search
          .trim()
          .toLowerCase();

      return inspections.filter(
        (inspection) => {
          const matchesStatus =
            statusFilter === "all" ||
            inspection.status ===
              statusFilter;

          const propertyName =
            getPropertyName(
              inspection.property_id
            ).toLowerCase();

          const customerName =
            getCustomerName(
              inspection.customer_id
            ).toLowerCase();

          const matchesSearch =
            !term ||
            propertyName.includes(
              term
            ) ||
            customerName.includes(
              term
            ) ||
            inspection.notes
              ?.toLowerCase()
              .includes(term);

          return (
            matchesStatus &&
            Boolean(matchesSearch)
          );
        }
      );
    }, [
      inspections,
      search,
      statusFilter,
      customers,
      properties,
    ]);

  /* =====================================
     STATS
  ===================================== */

  const scheduledCount =
    inspections.filter(
      (inspection) =>
        inspection.status ===
        "scheduled"
    ).length;

  const completedCount =
    inspections.filter(
      (inspection) =>
        inspection.status ===
        "completed"
    ).length;

  const cancelledCount =
    inspections.filter(
      (inspection) =>
        inspection.status ===
        "cancelled"
    ).length;

  const upcomingCount =
    inspections.filter(
      (inspection) =>
        inspection.status ===
          "scheduled" &&
        new Date(
          inspection.inspection_date
        ).getTime() >= Date.now()
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
                Inspections
              </p>

              <p className="text-xs text-gray-400">
                Property Operations
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:border-orange-200 hover:bg-orange-50 hover:text-[#f97316]"
          >
            <ArrowLeft size={17} />

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
            Property Operations
          </p>

          <h1 className="mt-2 text-3xl font-black md:text-4xl">
            Inspections
          </h1>

          <p className="mt-2 text-gray-500">
            Schedule, update and monitor property inspection
            appointments.
          </p>
        </div>

        {/* STATS */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            icon={<CalendarDays size={21} />}
            title="Scheduled"
            value={scheduledCount}
          />

          <SummaryCard
            icon={<Clock3 size={21} />}
            title="Upcoming"
            value={upcomingCount}
          />

          <SummaryCard
            icon={<CheckCircle2 size={21} />}
            title="Completed"
            value={completedCount}
          />

          <SummaryCard
            icon={<XCircle size={21} />}
            title="Cancelled"
            value={cancelledCount}
          />
        </div>

        {/* MESSAGE */}
        {message && (
          <div
            className={`mb-6 rounded-2xl border p-4 text-sm ${
              messageType === "success"
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        <div className="grid items-start gap-8 lg:grid-cols-[390px_1fr]">
          {/* FORM */}
          <div className="rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-[#f97316]">
                {editingId ? (
                  <Pencil size={21} />
                ) : (
                  <CalendarDays size={22} />
                )}
              </div>

              <div>
                <h2 className="text-xl font-black">
                  {editingId
                    ? "Edit Inspection"
                    : "Schedule Inspection"}
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  {editingId
                    ? "Update appointment details"
                    : "Create a property inspection appointment"}
                </p>
              </div>
            </div>

            <form
              onSubmit={saveInspection}
              className="space-y-5"
            >
              <FormField label="Customer">
                <select
                  value={customerId}
                  onChange={(e) =>
                    setCustomerId(
                      e.target.value
                    )
                  }
                  className={inputClass}
                >
                  <option value="">
                    Select Customer
                  </option>

                  {customers.map(
                    (customer) => (
                      <option
                        key={customer.id}
                        value={customer.id}
                      >
                        {customer.full_name}
                      </option>
                    )
                  )}
                </select>
              </FormField>

              <FormField label="Property *">
                <select
                  value={propertyId}
                  onChange={(e) =>
                    setPropertyId(
                      e.target.value
                    )
                  }
                  required
                  className={inputClass}
                >
                  <option value="">
                    Select Property
                  </option>

                  {properties.map(
                    (property) => (
                      <option
                        key={property.id}
                        value={property.id}
                      >
                        {property.title}
                      </option>
                    )
                  )}
                </select>
              </FormField>

              <FormField label="Inspection Date & Time *">
                <input
                  type="datetime-local"
                  value={inspectionDate}
                  onChange={(e) =>
                    setInspectionDate(
                      e.target.value
                    )
                  }
                  required
                  className={inputClass}
                />
              </FormField>

              <FormField label="Status">
                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(
                      e.target.value
                    )
                  }
                  className={inputClass}
                >
                  <option value="scheduled">
                    Scheduled
                  </option>

                  <option value="completed">
                    Completed
                  </option>

                  <option value="cancelled">
                    Cancelled
                  </option>

                  <option value="rescheduled">
                    Rescheduled
                  </option>
                </select>
              </FormField>

              <FormField label="Notes">
                <textarea
                  value={notes}
                  onChange={(e) =>
                    setNotes(
                      e.target.value
                    )
                  }
                  placeholder="Inspection notes..."
                  rows={4}
                  className={`${inputClass} resize-none`}
                />
              </FormField>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-[#f5a400] via-[#f97316] to-[#ef233c] py-3.5 font-bold text-white shadow-lg shadow-orange-100 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Saving..."
                  : editingId
                  ? "Update Inspection"
                  : "Schedule Inspection"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 font-semibold text-gray-600 transition hover:bg-gray-100"
                >
                  Cancel Edit
                </button>
              )}
            </form>
          </div>

          {/* LIST */}
          <div>
            {/* SEARCH / FILTER */}
            <div className="mb-6 grid gap-3 sm:grid-cols-[1fr_200px]">
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
                  placeholder="Search customer or property..."
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

                <option value="scheduled">
                  Scheduled
                </option>

                <option value="completed">
                  Completed
                </option>

                <option value="rescheduled">
                  Rescheduled
                </option>

                <option value="cancelled">
                  Cancelled
                </option>
              </select>
            </div>

            {pageLoading ? (
              <div className="rounded-3xl border border-gray-200 bg-white p-12 text-center shadow-sm">
                <img
                  src="/zertop-logo.png"
                  alt="Zertop Limited"
                  className="mx-auto h-14 w-auto object-contain"
                />

                <p className="mt-5 text-gray-500">
                  Loading inspections...
                </p>
              </div>
            ) : filteredInspections.length === 0 ? (
              <div className="rounded-3xl border border-gray-200 bg-white p-12 text-center shadow-sm">
                <CalendarDays
                  size={40}
                  className="mx-auto text-gray-300"
                />

                <h3 className="mt-4 text-lg font-bold">
                  {search ||
                  statusFilter !== "all"
                    ? "No matching inspections"
                    : "No inspections scheduled yet"}
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Inspection appointments will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {filteredInspections.map(
                  (inspection) => (
                    <article
                      key={inspection.id}
                      className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-orange-200 hover:shadow-md md:p-6"
                    >
                      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <span
                            className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase ${getStatusClass(
                              inspection.status
                            )}`}
                          >
                            {formatStatus(
                              inspection.status
                            )}
                          </span>

                          <h3 className="mt-4 text-xl font-black">
                            {getPropertyName(
                              inspection.property_id
                            )}
                          </h3>

                          <div className="mt-4 space-y-3">
                            <div className="flex items-start gap-3 text-sm text-gray-600">
                              <UserRound
                                size={17}
                                className="mt-0.5 shrink-0 text-[#f97316]"
                              />

                              <span>
                                {getCustomerName(
                                  inspection.customer_id
                                )}
                              </span>
                            </div>

                            <div className="flex items-start gap-3 text-sm text-gray-600">
                              <CalendarDays
                                size={17}
                                className="mt-0.5 shrink-0 text-[#f97316]"
                              />

                              <span>
                                {formatInspectionDate(
                                  inspection.inspection_date
                                )}
                              </span>
                            </div>

                            <div className="flex items-start gap-3 text-sm text-gray-600">
                              <MapPin
                                size={17}
                                className="mt-0.5 shrink-0 text-[#f97316]"
                              />

                              <span>
                                Property inspection appointment
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex shrink-0 gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              startEditing(
                                inspection
                              )
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-orange-200 hover:bg-orange-50 hover:text-[#f97316]"
                            aria-label="Edit inspection"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              deleteInspection(
                                inspection.id
                              )
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 text-red-500 transition hover:bg-red-50"
                            aria-label="Delete inspection"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      {inspection.notes && (
                        <div className="mt-5 border-t border-gray-100 pt-4">
                          <p className="text-xs font-bold uppercase tracking-[0.15em] text-gray-400">
                            Inspection Notes
                          </p>

                          <p className="mt-2 text-sm leading-7 text-gray-600">
                            {inspection.notes}
                          </p>
                        </div>
                      )}
                    </article>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </main>
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
      <label className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
      </label>

      {children}
    </div>
  );
}

type SummaryCardProps = {
  icon: ReactNode;
  title: string;
  value: number;
};

function SummaryCard({
  icon,
  title,
  value,
}: SummaryCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-[#f97316]">
          {icon}
        </div>

        <div>
          <p className="text-sm text-gray-500">
            {title}
          </p>

          <p className="mt-1 text-2xl font-black text-[#0b1b35]">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}