import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowLeft,
  CalendarDays,
  CircleDollarSign,
  Pencil,
  Search,
  Trash2,
  UserRound,
} from "lucide-react";

import { supabase } from "../lib/supabase";

type Sale = {
  id: string;
  customer_id: string;
  property_id: string;
  sale_price: number;
  initial_deposit: number;
  payment_plan_months: number;
  status: string;
  sale_date: string;
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

type SalesProps = {
  onBack: () => void;
};

type MessageType =
  | "success"
  | "error"
  | null;

export default function Sales({
  onBack,
}: SalesProps) {
  const [companyId, setCompanyId] =
    useState<string | null>(null);

  const [sales, setSales] =
    useState<Sale[]>([]);

  const [customers, setCustomers] =
    useState<Customer[]>([]);

  const [properties, setProperties] =
    useState<Property[]>([]);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [customerId, setCustomerId] =
    useState("");

  const [propertyId, setPropertyId] =
    useState("");

  const [salePrice, setSalePrice] =
    useState("");

  const [
    initialDeposit,
    setInitialDeposit,
  ] = useState("");

  const [
    paymentPlanMonths,
    setPaymentPlanMonths,
  ] = useState("");

  const [saleDate, setSaleDate] =
    useState("");

  const [status, setStatus] =
    useState("pending");

  const [notes, setNotes] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

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

    Promise.all([
      loadSales(),
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
     LOAD SALES
  ===================================== */

  const loadSales = async () => {
    if (!companyId) return;

    const { data, error } =
      await supabase
        .from("sales")
        .select(`
          id,
          customer_id,
          property_id,
          sale_price,
          initial_deposit,
          payment_plan_months,
          status,
          sale_date,
          notes
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
        "Sales loading error:",
        error
      );

      setMessageType("error");
      setMessage(error.message);
      return;
    }

    setSales(data || []);
  };

  /* =====================================
     LOAD CUSTOMERS
  ===================================== */

  const loadCustomers = async () => {
    if (!companyId) return;

    const { data, error } =
      await supabase
        .from("customers")
        .select("id,full_name")
        .eq(
          "company_id",
          companyId
        )
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
     FORM
  ===================================== */

  const resetForm = () => {
    setEditingId(null);
    setCustomerId("");
    setPropertyId("");
    setSalePrice("");
    setInitialDeposit("");
    setPaymentPlanMonths("");
    setSaleDate("");
    setStatus("pending");
    setNotes("");
  };

  const startEditing = (
    sale: Sale
  ) => {
    setEditingId(sale.id);

    setCustomerId(
      sale.customer_id
    );

    setPropertyId(
      sale.property_id
    );

    setSalePrice(
      String(sale.sale_price)
    );

    setInitialDeposit(
      String(
        sale.initial_deposit
      )
    );

    setPaymentPlanMonths(
      String(
        sale.payment_plan_months
      )
    );

    setSaleDate(
      sale.sale_date
        ? sale.sale_date.slice(
            0,
            10
          )
        : ""
    );

    setStatus(
      sale.status
    );

    setNotes(
      sale.notes || ""
    );

    setMessage("");
    setMessageType(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const saveSale = async (
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

    if (!customerId) {
      setMessageType("error");

      setMessage(
        "Please select a customer."
      );

      return;
    }

    if (!propertyId) {
      setMessageType("error");

      setMessage(
        "Please select a property."
      );

      return;
    }

    if (
      !salePrice ||
      Number(salePrice) <= 0
    ) {
      setMessageType("error");

      setMessage(
        "Please enter a valid sale price."
      );

      return;
    }

    if (!saleDate) {
      setMessageType("error");

      setMessage(
        "Please select the sale date."
      );

      return;
    }

    setLoading(true);
    setMessage("");
    setMessageType(null);

    const saleData = {
      company_id: companyId,
      customer_id: customerId,
      property_id: propertyId,
      sale_price:
        Number(salePrice),
      initial_deposit:
        Number(
          initialDeposit || 0
        ),
      payment_plan_months:
        Number(
          paymentPlanMonths || 0
        ),
      sale_date: saleDate,
      status,
      notes:
        notes.trim() || null,
    };

    try {
      if (editingId) {
        const { error } =
          await supabase
            .from("sales")
            .update(saleData)
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
          "Sale updated successfully."
        );
      } else {
        const { error } =
          await supabase
            .from("sales")
            .insert(
              saleData
            );

        if (error) {
          throw error;
        }

        setMessageType(
          "success"
        );

        setMessage(
          "Sale recorded successfully."
        );
      }

      resetForm();

      await loadSales();
    } catch (error) {
      console.error(
        "Sale save error:",
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

  const deleteSale = async (
    id: string
  ) => {
    if (!companyId) return;

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this sale record?"
      );

    if (!confirmed) return;

    setMessage("");
    setMessageType(null);

    const { error } =
      await supabase
        .from("sales")
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
      "Sale deleted successfully."
    );

    await loadSales();
  };

  /* =====================================
     HELPERS
  ===================================== */

  const getCustomerName = (
    id: string
  ) => {
    return (
      customers.find(
        (customer) =>
          customer.id === id
      )?.full_name ||
      "Customer"
    );
  };

  const getPropertyName = (
    id: string
  ) => {
    return (
      properties.find(
        (property) =>
          property.id === id
      )?.title ||
      "Property"
    );
  };

  const formatCurrency = (
    value: number
  ) => {
    return `₦${Number(
      value || 0
    ).toLocaleString(
      "en-NG"
    )}`;
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
      case "pending":
        return "bg-yellow-50 text-yellow-700";

      case "active":
        return "bg-blue-50 text-blue-700";

      case "completed":
        return "bg-green-50 text-green-700";

      case "cancelled":
        return "bg-red-50 text-red-600";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const formatDate = (
    value: string
  ) => {
    if (!value) return "";

    return new Date(
      `${value.slice(0, 10)}T00:00:00`
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
     FILTER
  ===================================== */

  const filteredSales =
    useMemo(() => {
      const term =
        search
          .trim()
          .toLowerCase();

      return sales.filter(
        (sale) => {
          const matchesStatus =
            statusFilter ===
              "all" ||
            sale.status ===
              statusFilter;

          const customerName =
            getCustomerName(
              sale.customer_id
            ).toLowerCase();

          const propertyName =
            getPropertyName(
              sale.property_id
            ).toLowerCase();

          const matchesSearch =
            !term ||
            customerName.includes(
              term
            ) ||
            propertyName.includes(
              term
            ) ||
            sale.status
              .toLowerCase()
              .includes(term) ||
            sale.notes
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
      sales,
      search,
      statusFilter,
      customers,
      properties,
    ]);

  /* =====================================
     STATS
  ===================================== */

  const totalSalesValue =
    sales.reduce(
      (total, sale) =>
        total +
        Number(
          sale.sale_price || 0
        ),
      0
    );

  const totalDeposits =
    sales.reduce(
      (total, sale) =>
        total +
        Number(
          sale.initial_deposit ||
            0
        ),
      0
    );

  const outstandingBalance =
    Math.max(
      totalSalesValue -
        totalDeposits,
      0
    );

  const completedSales =
    sales.filter(
      (sale) =>
        sale.status ===
        "completed"
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
                Sales Management
              </p>

              <p className="text-xs text-gray-400">
                Property Transactions
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
            Sales Management
          </p>

          <h1 className="mt-2 text-3xl font-black md:text-4xl">
            Property Sales
          </h1>

          <p className="mt-2 max-w-2xl text-gray-500">
            Record property
            transactions, deposits and
            customer payment plans.
          </p>
        </div>

        {/* STATS */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            title="Total Sales"
            value={
              formatCurrency(
                totalSalesValue
              )
            }
          />

          <SummaryCard
            title="Deposits"
            value={
              formatCurrency(
                totalDeposits
              )
            }
          />

          <SummaryCard
            title="Outstanding"
            value={
              formatCurrency(
                outstandingBalance
              )
            }
          />

          <SummaryCard
            title="Completed Sales"
            value={String(
              completedSales
            )}
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
                  <CircleDollarSign
                    size={22}
                  />
                )}
              </div>

              <div>
                <h2 className="text-xl font-black">
                  {editingId
                    ? "Edit Sale"
                    : "Record Sale"}
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  {editingId
                    ? "Update transaction details"
                    : "Create a new property transaction"}
                </p>
              </div>
            </div>

            <form
              onSubmit={saveSale}
              className="space-y-5"
            >
              <FormField label="Customer *">
                <select
                  value={
                    customerId
                  }
                  onChange={(e) =>
                    setCustomerId(
                      e.target.value
                    )
                  }
                  required
                  className={
                    inputClass
                  }
                >
                  <option value="">
                    Select Customer
                  </option>

                  {customers.map(
                    (customer) => (
                      <option
                        key={
                          customer.id
                        }
                        value={
                          customer.id
                        }
                      >
                        {
                          customer.full_name
                        }
                      </option>
                    )
                  )}
                </select>
              </FormField>

              <FormField label="Property *">
                <select
                  value={
                    propertyId
                  }
                  onChange={(e) =>
                    setPropertyId(
                      e.target.value
                    )
                  }
                  required
                  className={
                    inputClass
                  }
                >
                  <option value="">
                    Select Property
                  </option>

                  {properties.map(
                    (property) => (
                      <option
                        key={
                          property.id
                        }
                        value={
                          property.id
                        }
                      >
                        {
                          property.title
                        }
                      </option>
                    )
                  )}
                </select>
              </FormField>

              <FormField label="Sale Price *">
                <input
                  type="number"
                  min="0"
                  value={
                    salePrice
                  }
                  onChange={(e) =>
                    setSalePrice(
                      e.target.value
                    )
                  }
                  required
                  placeholder="e.g. 4500000"
                  className={
                    inputClass
                  }
                />
              </FormField>

              <FormField label="Initial Deposit">
                <input
                  type="number"
                  min="0"
                  value={
                    initialDeposit
                  }
                  onChange={(e) =>
                    setInitialDeposit(
                      e.target.value
                    )
                  }
                  placeholder="e.g. 1000000"
                  className={
                    inputClass
                  }
                />
              </FormField>

              <FormField label="Payment Plan (Months)">
                <input
                  type="number"
                  min="0"
                  value={
                    paymentPlanMonths
                  }
                  onChange={(e) =>
                    setPaymentPlanMonths(
                      e.target.value
                    )
                  }
                  placeholder="e.g. 6"
                  className={
                    inputClass
                  }
                />
              </FormField>

              <FormField label="Sale Date *">
                <input
                  type="date"
                  value={
                    saleDate
                  }
                  onChange={(e) =>
                    setSaleDate(
                      e.target.value
                    )
                  }
                  required
                  className={
                    inputClass
                  }
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
                  className={
                    inputClass
                  }
                >
                  <option value="pending">
                    Pending
                  </option>

                  <option value="active">
                    Active
                  </option>

                  <option value="completed">
                    Completed
                  </option>

                  <option value="cancelled">
                    Cancelled
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
                  placeholder="Sale notes..."
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
                  ? "Update Sale"
                  : "Record Sale"}
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

          {/* SALES LIST */}
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
                value={
                  statusFilter
                }
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value
                  )
                }
                className={
                  inputClass
                }
              >
                <option value="all">
                  All Statuses
                </option>

                <option value="pending">
                  Pending
                </option>

                <option value="active">
                  Active
                </option>

                <option value="completed">
                  Completed
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
                  Loading sales...
                </p>
              </div>
            ) : filteredSales.length ===
              0 ? (
              <div className="rounded-3xl border border-gray-200 bg-white p-12 text-center shadow-sm">
                <CircleDollarSign
                  size={40}
                  className="mx-auto text-gray-300"
                />

                <h3 className="mt-4 text-lg font-bold">
                  {search ||
                  statusFilter !==
                    "all"
                    ? "No matching sales"
                    : "No sales recorded yet"}
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Property transactions
                  will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {filteredSales.map(
                  (sale) => (
                    <article
                      key={
                        sale.id
                      }
                      className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-orange-200 hover:shadow-md md:p-6"
                    >
                      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <span
                            className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase ${getStatusClass(
                              sale.status
                            )}`}
                          >
                            {formatStatus(
                              sale.status
                            )}
                          </span>

                          <h3 className="mt-4 text-xl font-black">
                            {getPropertyName(
                              sale.property_id
                            )}
                          </h3>

                          <div className="mt-4 flex items-start gap-3 text-sm text-gray-600">
                            <UserRound
                              size={17}
                              className="mt-0.5 shrink-0 text-[#f97316]"
                            />

                            <span>
                              Buyer:{" "}
                              <strong className="font-semibold text-[#0b1b35]">
                                {getCustomerName(
                                  sale.customer_id
                                )}
                              </strong>
                            </span>
                          </div>
                        </div>

                        <div className="flex shrink-0 gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              startEditing(
                                sale
                              )
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-orange-200 hover:bg-orange-50 hover:text-[#f97316]"
                            aria-label="Edit sale"
                          >
                            <Pencil
                              size={16}
                            />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              deleteSale(
                                sale.id
                              )
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 text-red-500 transition hover:bg-red-50"
                            aria-label="Delete sale"
                          >
                            <Trash2
                              size={16}
                            />
                          </button>
                        </div>
                      </div>

                      {/* FINANCIAL DETAILS */}
                      <div className="mt-5 grid gap-4 rounded-2xl bg-[#f8fafc] p-4 sm:grid-cols-2 lg:grid-cols-3">
                        <DetailItem
                          label="Sale Price"
                          value={formatCurrency(
                            sale.sale_price
                          )}
                        />

                        <DetailItem
                          label="Initial Deposit"
                          value={formatCurrency(
                            sale.initial_deposit
                          )}
                        />

                        <DetailItem
                          label="Balance"
                          value={formatCurrency(
                            Math.max(
                              Number(
                                sale.sale_price
                              ) -
                                Number(
                                  sale.initial_deposit
                                ),
                              0
                            )
                          )}
                        />

                        <DetailItem
                          label="Payment Plan"
                          value={`${Number(
                            sale.payment_plan_months ||
                              0
                          )} months`}
                        />

                        <div className="sm:col-span-2 lg:col-span-2">
                          <div className="flex items-start gap-3">
                            <CalendarDays
                              size={17}
                              className="mt-0.5 shrink-0 text-[#f97316]"
                            />

                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                Sale Date
                              </p>

                              <p className="mt-1 font-medium text-[#0b1b35]">
                                {formatDate(
                                  sale.sale_date
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {sale.notes && (
                        <div className="mt-5 border-t border-gray-100 pt-4">
                          <p className="text-xs font-bold uppercase tracking-[0.15em] text-gray-400">
                            Notes
                          </p>

                          <p className="mt-2 whitespace-pre-line text-sm leading-7 text-gray-600">
                            {
                              sale.notes
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
  value: string;
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

      <p className="mt-2 break-words text-2xl font-black text-[#0b1b35]">
        {value}
      </p>
    </div>
  );
}

type DetailItemProps = {
  label: string;
  value: string;
};

function DetailItem({
  label,
  value,
}: DetailItemProps) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
        {label}
      </p>

      <p className="mt-1 font-bold text-[#0b1b35]">
        {value}
      </p>
    </div>
  );
}