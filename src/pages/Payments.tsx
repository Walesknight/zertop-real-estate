import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

import {
  ArrowLeft,
  Banknote,
  CreditCard,
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
  status: string;
};

type Payment = {
  id: string;
  sale_id: string;
  amount: number;
  payment_method: string | null;
  payment_reference: string | null;
  payment_date: string;
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

type PaymentsProps = {
  onBack: () => void;
};

type MessageType =
  | "success"
  | "error"
  | null;

export default function Payments({
  onBack,
}: PaymentsProps) {
  const [companyId, setCompanyId] =
    useState<string | null>(null);

  const [sales, setSales] =
    useState<Sale[]>([]);

  const [payments, setPayments] =
    useState<Payment[]>([]);

  const [customers, setCustomers] =
    useState<Customer[]>([]);

  const [properties, setProperties] =
    useState<Property[]>([]);

  const [saleId, setSaleId] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [
    paymentMethod,
    setPaymentMethod,
  ] = useState("Bank Transfer");

  const [
    paymentReference,
    setPaymentReference,
  ] = useState("");

  const [
    paymentDate,
    setPaymentDate,
  ] = useState("");

  const [notes, setNotes] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [pageLoading, setPageLoading] =
    useState(true);

  const [message, setMessage] =
    useState("");

  const [
    messageType,
    setMessageType,
  ] =
    useState<MessageType>(
      null
    );

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
      loadPayments(),
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

    /*
      Main lookup for Admin and Manager.
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
     LOAD PAYMENTS
  ===================================== */

  const loadPayments = async () => {
    if (!companyId) return;

    const { data, error } =
      await supabase
        .from("payments")
        .select(`
          id,
          sale_id,
          amount,
          payment_method,
          payment_reference,
          payment_date,
          status,
          notes
        `)
        .eq(
          "company_id",
          companyId
        )
        .order("payment_date", {
          ascending: false,
        });

    if (error) {
      console.error(
        "Payments loading error:",
        error
      );

      setMessageType("error");
      setMessage(error.message);
      return;
    }

    setPayments(data || []);
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

  const formatDate = (
    value: string
  ) => {
    if (!value) return "";

    return new Date(
      `${value.slice(
        0,
        10
      )}T00:00:00`
    ).toLocaleDateString(
      "en-NG",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  const getAdditionalPayments = (
    currentSaleId: string
  ) => {
    return payments
      .filter(
        (payment) =>
          payment.sale_id ===
            currentSaleId &&
          payment.status ===
            "paid"
      )
      .reduce(
        (
          total,
          payment
        ) =>
          total +
          Number(
            payment.amount
          ),
        0
      );
  };

  const getTotalPaid = (
    sale: Sale
  ) => {
    return (
      Number(
        sale.initial_deposit ||
          0
      ) +
      getAdditionalPayments(
        sale.id
      )
    );
  };

  const getBalance = (
    sale: Sale
  ) => {
    return Math.max(
      Number(
        sale.sale_price
      ) -
        getTotalPaid(sale),
      0
    );
  };

  /* =====================================
     SELECTED SALE
  ===================================== */

  const selectedSale =
    useMemo(() => {
      return (
        sales.find(
          (sale) =>
            sale.id === saleId
        ) || null
      );
    }, [sales, saleId]);

  /* =====================================
     FORM
  ===================================== */

  const resetForm = () => {
    setSaleId("");
    setAmount("");
    setPaymentMethod(
      "Bank Transfer"
    );
    setPaymentReference("");
    setPaymentDate("");
    setNotes("");
  };

  const savePayment = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!companyId) {
      setMessageType("error");

      setMessage(
        "Company not found."
      );

      return;
    }

    if (!saleId) {
      setMessageType("error");

      setMessage(
        "Please select a sale."
      );

      return;
    }

    const paymentAmount =
      Number(amount);

    if (
      !paymentAmount ||
      paymentAmount <= 0
    ) {
      setMessageType("error");

      setMessage(
        "Enter a valid payment amount."
      );

      return;
    }

    if (!paymentDate) {
      setMessageType("error");

      setMessage(
        "Please select the payment date."
      );

      return;
    }

    if (selectedSale) {
      const balance =
        getBalance(
          selectedSale
        );

      if (
        paymentAmount >
        balance
      ) {
        setMessageType(
          "error"
        );

        setMessage(
          `Payment cannot exceed outstanding balance of ${formatCurrency(
            balance
          )}.`
        );

        return;
      }
    }

    setLoading(true);
    setMessage("");
    setMessageType(null);

    try {
      const { error } =
        await supabase
          .from("payments")
          .insert({
            company_id:
              companyId,

            sale_id:
              saleId,

            amount:
              paymentAmount,

            payment_method:
              paymentMethod,

            payment_reference:
              paymentReference.trim() ||
              null,

            payment_date:
              paymentDate,

            status:
              "paid",

            notes:
              notes.trim() ||
              null,
          });

      if (error) {
        throw error;
      }

      setMessageType(
        "success"
      );

      setMessage(
        "Payment recorded successfully."
      );

      resetForm();

      await loadPayments();
    } catch (error) {
      console.error(
        "Payment save error:",
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

  const deletePayment = async (
    id: string
  ) => {
    if (!companyId) return;

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this payment record?"
      );

    if (!confirmed) return;

    setMessage("");
    setMessageType(null);

    const { error } =
      await supabase
        .from("payments")
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

    setMessageType("success");

    setMessage(
      "Payment deleted successfully."
    );

    await loadPayments();
  };

  /* =====================================
     FILTER SALES
  ===================================== */

  const filteredSales =
    useMemo(() => {
      const term =
        search
          .trim()
          .toLowerCase();

      if (!term) {
        return sales;
      }

      return sales.filter(
        (sale) => {
          const customerName =
            getCustomerName(
              sale.customer_id
            ).toLowerCase();

          const propertyName =
            getPropertyName(
              sale.property_id
            ).toLowerCase();

          return (
            customerName.includes(
              term
            ) ||
            propertyName.includes(
              term
            )
          );
        }
      );
    }, [
      sales,
      search,
      customers,
      properties,
    ]);

  /* =====================================
     SUMMARY
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

  const totalCollected =
    sales.reduce(
      (total, sale) =>
        total +
        getTotalPaid(sale),
      0
    );

  const totalOutstanding =
    sales.reduce(
      (total, sale) =>
        total +
        getBalance(sale),
      0
    );

  const fullyPaidCount =
    sales.filter(
      (sale) =>
        getBalance(sale) === 0
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
                Payment Management
              </p>

              <p className="text-xs text-gray-400">
                Financial Operations
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
            Financial Management
          </p>

          <h1 className="mt-2 text-3xl font-black md:text-4xl">
            Payments
          </h1>

          <p className="mt-2 max-w-2xl text-gray-500">
            Track customer
            payments, instalments and
            outstanding property
            balances.
          </p>
        </div>

        {/* STATS */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            title="Sales Value"
            value={formatCurrency(
              totalSalesValue
            )}
          />

          <SummaryCard
            title="Total Collected"
            value={formatCurrency(
              totalCollected
            )}
          />

          <SummaryCard
            title="Outstanding"
            value={formatCurrency(
              totalOutstanding
            )}
          />

          <SummaryCard
            title="Fully Paid"
            value={String(
              fullyPaidCount
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
          <div>
            <div className="rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-[#f97316]">
                  <CreditCard
                    size={22}
                  />
                </div>

                <div>
                  <h2 className="text-xl font-black">
                    Record Payment
                  </h2>

                  <p className="mt-1 text-xs text-gray-400">
                    Add a customer
                    instalment or
                    payment.
                  </p>
                </div>
              </div>

              <form
                onSubmit={
                  savePayment
                }
                className="space-y-5"
              >
                <FormField label="Property Sale *">
                  <select
                    value={saleId}
                    onChange={(e) => {
                      setSaleId(
                        e.target.value
                      );

                      setMessage("");
                      setMessageType(
                        null
                      );
                    }}
                    required
                    className={
                      inputClass
                    }
                  >
                    <option value="">
                      Select Property
                      Sale
                    </option>

                    {sales.map(
                      (sale) => (
                        <option
                          key={
                            sale.id
                          }
                          value={
                            sale.id
                          }
                        >
                          {getCustomerName(
                            sale.customer_id
                          )}{" "}
                          -{" "}
                          {getPropertyName(
                            sale.property_id
                          )}{" "}
                          -{" "}
                          {formatCurrency(
                            sale.sale_price
                          )}
                        </option>
                      )
                    )}
                  </select>
                </FormField>

                {/* SELECTED SALE */}
                {selectedSale && (
                  <div className="rounded-2xl border border-orange-100 bg-[#fffaf5] p-4">
                    <div className="space-y-3 text-sm">
                      <FinanceRow
                        label="Sale Price"
                        value={formatCurrency(
                          selectedSale.sale_price
                        )}
                      />

                      <FinanceRow
                        label="Initial Deposit"
                        value={formatCurrency(
                          selectedSale.initial_deposit
                        )}
                      />

                      <FinanceRow
                        label="Total Paid"
                        value={formatCurrency(
                          getTotalPaid(
                            selectedSale
                          )
                        )}
                      />

                      <div className="border-t border-orange-100 pt-3">
                        <FinanceRow
                          label="Outstanding"
                          value={formatCurrency(
                            getBalance(
                              selectedSale
                            )
                          )}
                          strong
                        />
                      </div>
                    </div>
                  </div>
                )}

                <FormField label="Payment Amount *">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) =>
                      setAmount(
                        e.target.value
                      )
                    }
                    required
                    min="1"
                    placeholder="e.g. 500000"
                    className={
                      inputClass
                    }
                  />
                </FormField>

                <FormField label="Payment Method">
                  <select
                    value={
                      paymentMethod
                    }
                    onChange={(e) =>
                      setPaymentMethod(
                        e.target.value
                      )
                    }
                    className={
                      inputClass
                    }
                  >
                    <option value="Bank Transfer">
                      Bank Transfer
                    </option>

                    <option value="Cash">
                      Cash
                    </option>

                    <option value="POS">
                      POS
                    </option>

                    <option value="Cheque">
                      Cheque
                    </option>

                    <option value="Online Payment">
                      Online Payment
                    </option>

                    <option value="Other">
                      Other
                    </option>
                  </select>
                </FormField>

                <FormField label="Payment Reference">
                  <input
                    value={
                      paymentReference
                    }
                    onChange={(e) =>
                      setPaymentReference(
                        e.target.value
                      )
                    }
                    placeholder="Transfer or receipt reference"
                    className={
                      inputClass
                    }
                  />
                </FormField>

                <FormField label="Payment Date *">
                  <input
                    type="date"
                    value={
                      paymentDate
                    }
                    onChange={(e) =>
                      setPaymentDate(
                        e.target.value
                      )
                    }
                    required
                    className={
                      inputClass
                    }
                  />
                </FormField>

                <FormField label="Notes">
                  <textarea
                    value={notes}
                    onChange={(e) =>
                      setNotes(
                        e.target.value
                      )
                    }
                    rows={3}
                    placeholder="Payment notes..."
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
                    : "Record Payment"}
                </button>
              </form>
            </div>

            <p className="mt-3 px-2 text-xs leading-5 text-gray-400">
              The initial deposit
              entered when the sale
              was recorded is already
              included in Total Paid.
            </p>
          </div>

          {/* SALES SUMMARY */}
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
                placeholder="Search customer or property..."
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
                  Loading payments...
                </p>
              </div>
            ) : filteredSales.length ===
              0 ? (
              <div className="rounded-3xl border border-gray-200 bg-white p-12 text-center shadow-sm">
                <Banknote
                  size={40}
                  className="mx-auto text-gray-300"
                />

                <h3 className="mt-4 text-lg font-bold">
                  {search
                    ? "No matching property sales"
                    : "No property sales available"}
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Property sales must
                  be recorded before
                  payments can be
                  tracked.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {filteredSales.map(
                  (sale) => {
                    const totalPaid =
                      getTotalPaid(
                        sale
                      );

                    const balance =
                      getBalance(
                        sale
                      );

                    const percentage =
                      Number(
                        sale.sale_price
                      ) > 0
                        ? Math.min(
                            (totalPaid /
                              Number(
                                sale.sale_price
                              )) *
                              100,
                            100
                          )
                        : 0;

                    const salePayments =
                      payments.filter(
                        (payment) =>
                          payment.sale_id ===
                          sale.id
                      );

                    return (
                      <article
                        key={
                          sale.id
                        }
                        className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-orange-200 hover:shadow-md md:p-6"
                      >
                        {/* HEADER */}
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <div className="flex items-center gap-2 text-sm font-semibold text-[#f97316]">
                              <UserRound
                                size={
                                  16
                                }
                              />

                              {getCustomerName(
                                sale.customer_id
                              )}
                            </div>

                            <h3 className="mt-2 text-xl font-black text-[#0b1b35]">
                              {getPropertyName(
                                sale.property_id
                              )}
                            </h3>
                          </div>

                          <span
                            className={`w-fit rounded-full px-3 py-1 text-[11px] font-bold uppercase ${
                              balance ===
                              0
                                ? "bg-green-50 text-green-700"
                                : "bg-orange-50 text-[#f97316]"
                            }`}
                          >
                            {balance ===
                            0
                              ? "Fully Paid"
                              : "Payment Ongoing"}
                          </span>
                        </div>

                        {/* FINANCE */}
                        <div className="mt-6 grid gap-4 rounded-2xl bg-[#f8fafc] p-4 sm:grid-cols-3">
                          <PaymentStat
                            title="Property Price"
                            value={formatCurrency(
                              sale.sale_price
                            )}
                          />

                          <PaymentStat
                            title="Total Paid"
                            value={formatCurrency(
                              totalPaid
                            )}
                          />

                          <PaymentStat
                            title="Balance"
                            value={formatCurrency(
                              balance
                            )}
                          />
                        </div>

                        {/* PROGRESS */}
                        <div className="mt-6">
                          <div className="mb-2 flex justify-between text-xs font-semibold text-gray-400">
                            <span>
                              Payment
                              Progress
                            </span>

                            <span>
                              {percentage.toFixed(
                                0
                              )}
                              %
                            </span>
                          </div>

                          <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-[#f5a400] via-[#f97316] to-[#ef233c] transition-all"
                              style={{
                                width: `${percentage}%`,
                              }}
                            />
                          </div>
                        </div>

                        {/* HISTORY */}
                        <div className="mt-6 border-t border-gray-100 pt-5">
                          <h4 className="font-black text-[#0b1b35]">
                            Payment
                            History
                          </h4>

                          {/* INITIAL */}
                          <div className="mt-4 rounded-2xl border border-gray-100 bg-[#f8fafc] p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <p className="font-semibold text-[#0b1b35]">
                                  Initial
                                  Deposit
                                </p>

                                <p className="mt-1 text-xs text-gray-400">
                                  Recorded
                                  with sale
                                </p>
                              </div>

                              <p className="font-black text-[#0b1b35]">
                                {formatCurrency(
                                  sale.initial_deposit
                                )}
                              </p>
                            </div>
                          </div>

                          {salePayments.length ===
                          0 ? (
                            <p className="mt-4 text-sm text-gray-400">
                              No
                              additional
                              payments
                              yet.
                            </p>
                          ) : (
                            <div className="mt-3 space-y-3">
                              {salePayments.map(
                                (
                                  payment
                                ) => (
                                  <div
                                    key={
                                      payment.id
                                    }
                                    className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
                                  >
                                    <div>
                                      <p className="font-black text-[#0b1b35]">
                                        {formatCurrency(
                                          payment.amount
                                        )}
                                      </p>

                                      <p className="mt-1 text-xs text-gray-500">
                                        {formatDate(
                                          payment.payment_date
                                        )}{" "}
                                        •{" "}
                                        {payment.payment_method ||
                                          "Payment"}
                                      </p>

                                      {payment.payment_reference && (
                                        <p className="mt-1 text-xs text-gray-400">
                                          Ref:{" "}
                                          {
                                            payment.payment_reference
                                          }
                                        </p>
                                      )}

                                      {payment.notes && (
                                        <p className="mt-2 text-xs leading-5 text-gray-500">
                                          {
                                            payment.notes
                                          }
                                        </p>
                                      )}
                                    </div>

                                    <button
                                      type="button"
                                      onClick={() =>
                                        deletePayment(
                                          payment.id
                                        )
                                      }
                                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-red-100 text-red-500 transition hover:bg-red-50"
                                      aria-label="Delete payment"
                                    >
                                      <Trash2
                                        size={
                                          16
                                        }
                                      />
                                    </button>
                                  </div>
                                )
                              )}
                            </div>
                          )}
                        </div>
                      </article>
                    );
                  }
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

type FinanceRowProps = {
  label: string;
  value: string;
  strong?: boolean;
};

function FinanceRow({
  label,
  value,
  strong = false,
}: FinanceRowProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span
        className={
          strong
            ? "font-bold text-[#0b1b35]"
            : "text-gray-500"
        }
      >
        {label}
      </span>

      <span
        className={
          strong
            ? "font-black text-[#f97316]"
            : "font-semibold text-[#0b1b35]"
        }
      >
        {value}
      </span>
    </div>
  );
}

type PaymentStatProps = {
  title: string;
  value: string;
};

function PaymentStat({
  title,
  value,
}: PaymentStatProps) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
        {title}
      </p>

      <p className="mt-1 font-black text-[#0b1b35]">
        {value}
      </p>
    </div>
  );
}