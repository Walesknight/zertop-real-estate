import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowLeft,
  Building2,
  MapPin,
  Pencil,
  Search,
  Trash2,
} from "lucide-react";

import { supabase } from "../lib/supabase";

type Estate = {
  id: string;
  name: string;
  slug: string;
  location: string | null;
  city: string | null;
  state: string | null;
  description: string | null;
  status: string;
};

type EstatesProps = {
  onBack: () => void;
};

type MessageType =
  | "success"
  | "error"
  | null;

export default function Estates({
  onBack,
}: EstatesProps) {
  const [companyId, setCompanyId] =
    useState<string | null>(null);

  const [estates, setEstates] =
    useState<Estate[]>([]);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [name, setName] =
    useState("");

  const [location, setLocation] =
    useState("");

  const [city, setCity] =
    useState("");

  const [state, setState] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [status, setStatus] =
    useState("active");

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [pageLoading, setPageLoading] =
    useState(true);

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

    loadEstates().finally(() => {
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

    /*
      Main lookup for staff accounts.
      Estates page is already restricted
      to Admin and Manager in App.tsx.
    */
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

    /*
      Fallback for legacy owner account.
    */
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
     LOAD ESTATES
  ===================================== */

  const loadEstates = async () => {
    if (!companyId) return;

    const { data, error } =
      await supabase
        .from("estates")
        .select(`
          id,
          name,
          slug,
          location,
          city,
          state,
          description,
          status
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
        "Estates loading error:",
        error
      );

      setMessageType("error");
      setMessage(error.message);
      return;
    }

    setEstates(data || []);
  };

  /* =====================================
     FORM
  ===================================== */

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setLocation("");
    setCity("");
    setState("");
    setDescription("");
    setStatus("active");
  };

  const startEditing = (
    estate: Estate
  ) => {
    setEditingId(estate.id);

    setName(
      estate.name
    );

    setLocation(
      estate.location || ""
    );

    setCity(
      estate.city || ""
    );

    setState(
      estate.state || ""
    );

    setDescription(
      estate.description || ""
    );

    setStatus(
      estate.status
    );

    setMessage("");
    setMessageType(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const saveEstate = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!companyId) {
      setMessageType("error");

      setMessage(
        "Company not found."
      );

      return;
    }

    if (!name.trim()) {
      setMessageType("error");

      setMessage(
        "Please enter the estate name."
      );

      return;
    }

    setLoading(true);
    setMessage("");
    setMessageType(null);

    const estateData = {
      company_id: companyId,
      name: name.trim(),
      location:
        location.trim() || null,
      city:
        city.trim() || null,
      state:
        state.trim() || null,
      description:
        description.trim() || null,
      status,
    };

    try {
      if (editingId) {
        const { error } =
          await supabase
            .from("estates")
            .update(
              estateData
            )
            .eq(
              "id",
              editingId
            )
            .eq(
              "company_id",
              companyId
            );

        if (error) {
          throw error;
        }

        setMessageType(
          "success"
        );

        setMessage(
          "Estate updated successfully."
        );
      } else {
        const slug =
          name
            .trim()
            .toLowerCase()
            .replace(
              /[^a-z0-9]+/g,
              "-"
            )
            .replace(
              /^-+|-+$/g,
              ""
            ) +
          "-" +
          Math.random()
            .toString(36)
            .substring(2, 7);

        const { error } =
          await supabase
            .from("estates")
            .insert({
              ...estateData,
              slug,
            });

        if (error) {
          throw error;
        }

        setMessageType(
          "success"
        );

        setMessage(
          "Estate added successfully."
        );
      }

      resetForm();

      await loadEstates();
    } catch (error) {
      console.error(
        "Estate save error:",
        error
      );

      setMessageType("error");

      if (
        error instanceof Error
      ) {
        setMessage(
          error.message
        );
      } else {
        setMessage(
          "Something went wrong."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  /* =====================================
     DELETE
  ===================================== */

  const deleteEstate = async (
    id: string
  ) => {
    if (!companyId) return;

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this estate?"
      );

    if (!confirmed) return;

    setMessage("");
    setMessageType(null);

    const { error } =
      await supabase
        .from("estates")
        .delete()
        .eq("id", id)
        .eq(
          "company_id",
          companyId
        );

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
      "Estate deleted successfully."
    );

    await loadEstates();
  };

  /* =====================================
     HELPERS
  ===================================== */

  const getStatusClass = (
    value: string
  ) => {
    switch (value) {
      case "active":
        return "bg-green-50 text-green-700";

      case "completed":
        return "bg-blue-50 text-blue-700";

      case "inactive":
        return "bg-gray-100 text-gray-600";

      default:
        return "bg-orange-50 text-[#f97316]";
    }
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

  /* =====================================
     FILTER
  ===================================== */

  const filteredEstates =
    useMemo(() => {
      const term =
        search
          .trim()
          .toLowerCase();

      if (!term) {
        return estates;
      }

      return estates.filter(
        (estate) =>
          estate.name
            .toLowerCase()
            .includes(term) ||
          estate.location
            ?.toLowerCase()
            .includes(term) ||
          estate.city
            ?.toLowerCase()
            .includes(term) ||
          estate.state
            ?.toLowerCase()
            .includes(term) ||
          estate.status
            ?.toLowerCase()
            .includes(term)
      );
    }, [
      estates,
      search,
    ]);

  /* =====================================
     STATS
  ===================================== */

  const activeCount =
    estates.filter(
      (estate) =>
        estate.status ===
        "active"
    ).length;

  const completedCount =
    estates.filter(
      (estate) =>
        estate.status ===
        "completed"
    ).length;

  const inactiveCount =
    estates.filter(
      (estate) =>
        estate.status ===
        "inactive"
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
                Estate Management
              </p>

              <p className="text-xs text-gray-400">
                Property Development
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
            Property Development
          </p>

          <h1 className="mt-2 text-3xl font-black md:text-4xl">
            Estates
          </h1>

          <p className="mt-2 max-w-2xl text-gray-500">
            Manage Zertop Limited
            estates, developments and
            project locations.
          </p>
        </div>

        {/* STATS */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            title="Total Estates"
            value={
              estates.length
            }
          />

          <SummaryCard
            title="Active"
            value={activeCount}
          />

          <SummaryCard
            title="Completed"
            value={
              completedCount
            }
          />

          <SummaryCard
            title="Inactive"
            value={
              inactiveCount
            }
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

        <div className="grid items-start gap-8 lg:grid-cols-[390px_1fr]">
          {/* FORM */}
          <div className="rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-[#f97316]">
                {editingId ? (
                  <Pencil
                    size={21}
                  />
                ) : (
                  <Building2
                    size={22}
                  />
                )}
              </div>

              <div>
                <h2 className="text-xl font-black">
                  {editingId
                    ? "Edit Estate"
                    : "Add Estate"}
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  {editingId
                    ? "Update development information"
                    : "Create a new Zertop development"}
                </p>
              </div>
            </div>

            <form
              onSubmit={
                saveEstate
              }
              className="space-y-5"
            >
              <FormField label="Estate Name *">
                <input
                  value={name}
                  onChange={(e) =>
                    setName(
                      e.target.value
                    )
                  }
                  required
                  placeholder="e.g. Hilltop Gardens"
                  className={
                    inputClass
                  }
                />
              </FormField>

              <FormField label="Location">
                <input
                  value={
                    location
                  }
                  onChange={(e) =>
                    setLocation(
                      e.target.value
                    )
                  }
                  placeholder="Development location"
                  className={
                    inputClass
                  }
                />
              </FormField>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <FormField label="City">
                  <input
                    value={city}
                    onChange={(e) =>
                      setCity(
                        e.target.value
                      )
                    }
                    placeholder="City"
                    className={
                      inputClass
                    }
                  />
                </FormField>

                <FormField label="State">
                  <input
                    value={state}
                    onChange={(e) =>
                      setState(
                        e.target.value
                      )
                    }
                    placeholder="State"
                    className={
                      inputClass
                    }
                  />
                </FormField>
              </div>

              <FormField label="Status">
                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(
                      e.target.value
                    )
                  }
                  className={
                    inputClass
                  }
                >
                  <option value="active">
                    Active
                  </option>

                  <option value="inactive">
                    Inactive
                  </option>

                  <option value="completed">
                    Completed
                  </option>
                </select>
              </FormField>

              <FormField label="Description">
                <textarea
                  value={
                    description
                  }
                  onChange={(e) =>
                    setDescription(
                      e.target.value
                    )
                  }
                  rows={5}
                  placeholder="Estate description..."
                  className={`${inputClass} resize-none`}
                />
              </FormField>

              <button
                type="submit"
                disabled={
                  loading
                }
                className="w-full rounded-xl bg-gradient-to-r from-[#f5a400] via-[#f97316] to-[#ef233c] py-3.5 font-bold text-white shadow-lg shadow-orange-100 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Saving..."
                  : editingId
                  ? "Update Estate"
                  : "Add Estate"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={
                    resetForm
                  }
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 font-semibold text-gray-600 transition hover:bg-gray-100"
                >
                  Cancel Edit
                </button>
              )}
            </form>
          </div>

          {/* ESTATE LIST */}
          <div>
            {/* SEARCH */}
            <div className="mb-6 flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 shadow-sm focus-within:border-orange-300">
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
                placeholder="Search estate, city or state..."
                className="w-full bg-transparent py-3.5 text-sm outline-none placeholder:text-gray-400"
              />
            </div>

            {pageLoading ? (
              <div className="rounded-3xl border border-gray-200 bg-white p-12 text-center shadow-sm">
                <img
                  src="/zertop-logo.png"
                  alt="Zertop Limited"
                  className="mx-auto h-14 w-auto object-contain"
                />

                <p className="mt-5 text-gray-500">
                  Loading estates...
                </p>
              </div>
            ) : filteredEstates.length ===
              0 ? (
              <div className="rounded-3xl border border-gray-200 bg-white p-12 text-center shadow-sm">
                <Building2
                  size={40}
                  className="mx-auto text-gray-300"
                />

                <h3 className="mt-4 text-lg font-bold">
                  {search
                    ? "No matching estates"
                    : "No estates yet"}
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Zertop developments
                  will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {filteredEstates.map(
                  (estate) => (
                    <article
                      key={
                        estate.id
                      }
                      className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-orange-200 hover:shadow-md md:p-6"
                    >
                      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <span
                            className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase ${getStatusClass(
                              estate.status
                            )}`}
                          >
                            {formatStatus(
                              estate.status
                            )}
                          </span>

                          <h3 className="mt-4 text-xl font-black text-[#0b1b35]">
                            {
                              estate.name
                            }
                          </h3>

                          <div className="mt-4 space-y-3">
                            <div className="flex items-start gap-3 text-sm text-gray-600">
                              <MapPin
                                size={17}
                                className="mt-0.5 shrink-0 text-[#f97316]"
                              />

                              <span>
                                {estate.location ||
                                  "Location not specified"}
                              </span>
                            </div>

                            {(estate.city ||
                              estate.state) && (
                              <div className="flex items-start gap-3 text-sm text-gray-600">
                                <Building2
                                  size={17}
                                  className="mt-0.5 shrink-0 text-[#f97316]"
                                />

                                <span>
                                  {[
                                    estate.city,
                                    estate.state,
                                  ]
                                    .filter(
                                      Boolean
                                    )
                                    .join(
                                      ", "
                                    )}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex shrink-0 gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              startEditing(
                                estate
                              )
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-orange-200 hover:bg-orange-50 hover:text-[#f97316]"
                            aria-label="Edit estate"
                          >
                            <Pencil
                              size={16}
                            />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              deleteEstate(
                                estate.id
                              )
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 text-red-500 transition hover:bg-red-50"
                            aria-label="Delete estate"
                          >
                            <Trash2
                              size={16}
                            />
                          </button>
                        </div>
                      </div>

                      {estate.description && (
                        <div className="mt-5 border-t border-gray-100 pt-4">
                          <p className="text-xs font-bold uppercase tracking-[0.15em] text-gray-400">
                            Description
                          </p>

                          <p className="mt-2 whitespace-pre-line text-sm leading-7 text-gray-600">
                            {
                              estate.description
                            }
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
  children: React.ReactNode;
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