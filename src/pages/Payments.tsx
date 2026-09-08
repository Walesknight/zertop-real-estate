import { useEffect, useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
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

export default function Payments({ onBack }: PaymentsProps) {
  const [companyId, setCompanyId] = useState<string | null>(null);

  const [sales, setSales] = useState<Sale[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);

  const [saleId, setSaleId] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer");
  const [paymentReference, setPaymentReference] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadCompany();
  }, []);

  useEffect(() => {
    if (companyId) {
      loadSales();
      loadPayments();
      loadCustomers();
      loadProperties();
    }
  }, [companyId]);

  const loadCompany = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("companies")
      .select("id")
      .eq("owner_id", user.id)
      .single();

    if (error) {
      console.error(error);
      setMessage("Company not found.");
      return;
    }

    setCompanyId(data.id);
  };

  const loadSales = async () => {
    if (!companyId) return;

    const { data, error } = await supabase
      .from("sales")
      .select(
        "id,customer_id,property_id,sale_price,initial_deposit,status"
      )
      .eq("company_id", companyId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setSales(data || []);
  };

  const loadPayments = async () => {
    if (!companyId) return;

    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .eq("company_id", companyId)
      .order("payment_date", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setPayments(data || []);
  };

  const loadCustomers = async () => {
    if (!companyId) return;

    const { data, error } = await supabase
      .from("customers")
      .select("id,full_name")
      .eq("company_id", companyId);

    if (error) {
      console.error(error);
      return;
    }

    setCustomers(data || []);
  };

  const loadProperties = async () => {
    if (!companyId) return;

    const { data, error } = await supabase
      .from("properties")
      .select("id,title")
      .eq("company_id", companyId);

    if (error) {
      console.error(error);
      return;
    }

    setProperties(data || []);
  };

  const getCustomerName = (id: string) => {
    return (
      customers.find((customer) => customer.id === id)?.full_name ||
      "Customer"
    );
  };

  const getPropertyName = (id: string) => {
    return (
      properties.find((property) => property.id === id)?.title ||
      "Property"
    );
  };

  const getAdditionalPayments = (saleId: string) => {
    return payments
      .filter(
        (payment) =>
          payment.sale_id === saleId &&
          payment.status === "paid"
      )
      .reduce(
        (total, payment) => total + Number(payment.amount),
        0
      );
  };

  const getTotalPaid = (sale: Sale) => {
    return (
      Number(sale.initial_deposit || 0) +
      getAdditionalPayments(sale.id)
    );
  };

  const getBalance = (sale: Sale) => {
    return Math.max(
      Number(sale.sale_price) - getTotalPaid(sale),
      0
    );
  };

  const selectedSale = useMemo(() => {
    return sales.find((sale) => sale.id === saleId) || null;
  }, [sales, saleId]);

  const resetForm = () => {
    setSaleId("");
    setAmount("");
    setPaymentMethod("Bank Transfer");
    setPaymentReference("");
    setPaymentDate("");
    setNotes("");
  };

  const savePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!companyId) {
      setMessage("Company not found.");
      return;
    }

    if (!saleId) {
      setMessage("Please select a sale.");
      return;
    }

    const paymentAmount = Number(amount);

    if (!paymentAmount || paymentAmount <= 0) {
      setMessage("Enter a valid payment amount.");
      return;
    }

    if (selectedSale) {
      const balance = getBalance(selectedSale);

      if (paymentAmount > balance) {
        setMessage(
          `Payment cannot exceed outstanding balance of ₦${balance.toLocaleString()}.`
        );
        return;
      }
    }

    setLoading(true);
    setMessage("");

    try {
      const { error } = await supabase.from("payments").insert({
        company_id: companyId,
        sale_id: saleId,
        amount: paymentAmount,
        payment_method: paymentMethod,
        payment_reference: paymentReference || null,
        payment_date: paymentDate,
        status: "paid",
        notes: notes || null,
      });

      if (error) throw error;

      setMessage("Payment recorded successfully.");

      resetForm();
      await loadPayments();
    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  const deletePayment = async (id: string) => {
    if (!window.confirm("Delete this payment record?")) {
      return;
    }

    const { error } = await supabase
      .from("payments")
      .delete()
      .eq("id", id);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Payment deleted.");

    await loadPayments();
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-7xl">
        <button
          onClick={onBack}
          className="mb-5 rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
        >
          ← Back to Dashboard
        </button>

        <div className="mb-8">
          <p className="text-sm font-semibold text-orange-500">
            Financial Management
          </p>

          <h1 className="mt-1 text-3xl font-bold">
            Payments
          </h1>

          <p className="mt-2 text-slate-400">
            Track customer payments and outstanding balances.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          {/* PAYMENT FORM */}
          <div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="mb-5 text-xl font-semibold">
                Record Payment
              </h2>

              <form onSubmit={savePayment} className="space-y-4">
                <select
                  value={saleId}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                      setSaleId(selectedId);
                      setMessage("");
                  }}
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-orange-500"
                >
                  <option value="">Select Property Sale</option>

                  {sales.map((sale) => (
                    <option
                      key={sale.id}
                      value={sale.id}
                    >
                      {getCustomerName(sale.customer_id)} -{" "}
                      {getPropertyName(sale.property_id)} - ₦
                      {Number(sale.sale_price).toLocaleString()}
                    </option>
                  ))}
                </select>

                {selectedSale && (
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm">
                    <div className="flex justify-between py-1">
                      <span className="text-slate-400">
                        Sale Price
                      </span>

                      <span>
                        ₦
                        {Number(
                          selectedSale.sale_price
                        ).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between py-1">
                      <span className="text-slate-400">
                        Initial Deposit
                      </span>

                      <span>
                        ₦
                        {Number(
                          selectedSale.initial_deposit
                        ).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between py-1">
                      <span className="text-slate-400">
                        Total Paid
                      </span>

                      <span>
                        ₦
                        {getTotalPaid(
                          selectedSale
                        ).toLocaleString()}
                      </span>
                    </div>

                    <div className="mt-2 flex justify-between border-t border-slate-800 pt-3 font-semibold">
                      <span>Outstanding</span>

                      <span className="text-orange-400">
                        ₦
                        {getBalance(
                          selectedSale
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}

                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  min="1"
                  placeholder="Payment Amount"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-orange-500"
                />

                <select
                  value={paymentMethod}
                  onChange={(e) =>
                    setPaymentMethod(e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-orange-500"
                >
                  <option value="Bank Transfer">
                    Bank Transfer
                  </option>

                  <option value="Cash">Cash</option>

                  <option value="POS">POS</option>

                  <option value="Cheque">Cheque</option>

                  <option value="Online Payment">
                    Online Payment
                  </option>

                  <option value="Other">Other</option>
                </select>

                <input
                  value={paymentReference}
                  onChange={(e) =>
                    setPaymentReference(e.target.value)
                  }
                  placeholder="Payment Reference"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-orange-500"
                />

                <input
                  type="date"
                  value={paymentDate}
                  onChange={(e) =>
                    setPaymentDate(e.target.value)
                  }
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-orange-500"
                />

                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Payment notes"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-orange-500"
                />

                {message && (
                  <p className="text-sm text-slate-300">
                    {message}
                  </p>
                )}

                <button
                  disabled={loading}
                  className="w-full rounded-xl bg-orange-500 py-3 font-semibold hover:bg-orange-600 disabled:opacity-50"
                >
                  {loading
                    ? "Saving..."
                    : "Record Payment"}
                </button>
              </form>
            </div>

            <p className="mt-3 text-xs text-slate-500">
              The initial deposit entered during the sale is already
              included in total paid.
            </p>
          </div>

          {/* SALES SUMMARY */}
          <div className="space-y-5">
            {sales.length === 0 ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center text-slate-400">
                No property sales available.
              </div>
            ) : (
              sales.map((sale) => {
                const totalPaid = getTotalPaid(sale);
                const balance = getBalance(sale);

                const percentage =
                  Number(sale.sale_price) > 0
                    ? Math.min(
                        (totalPaid /
                          Number(sale.sale_price)) *
                          100,
                        100
                      )
                    : 0;

                const salePayments = payments.filter(
                  (payment) => payment.sale_id === sale.id
                );

                return (
                  <div
                    key={sale.id}
                    className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="text-sm text-orange-400">
                          {getCustomerName(sale.customer_id)}
                        </p>

                        <h3 className="mt-1 text-xl font-bold">
                          {getPropertyName(sale.property_id)}
                        </h3>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          balance === 0
                            ? "bg-green-500/10 text-green-400"
                            : "bg-orange-500/10 text-orange-400"
                        }`}
                      >
                        {balance === 0
                          ? "FULLY PAID"
                          : "PAYMENT ONGOING"}
                      </span>
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-3">
                      <div>
                        <p className="text-xs text-slate-400">
                          Property Price
                        </p>

                        <p className="mt-1 font-semibold">
                          ₦
                          {Number(
                            sale.sale_price
                          ).toLocaleString()}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-400">
                          Total Paid
                        </p>

                        <p className="mt-1 font-semibold text-green-400">
                          ₦{totalPaid.toLocaleString()}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-400">
                          Balance
                        </p>

                        <p className="mt-1 font-semibold text-orange-400">
                          ₦{balance.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* PROGRESS */}
                    <div className="mt-5">
                      <div className="mb-2 flex justify-between text-xs text-slate-400">
                        <span>Payment Progress</span>

                        <span>
                          {percentage.toFixed(0)}%
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                        <div
                          className="h-full rounded-full bg-orange-500 transition-all"
                          style={{
                            width: `${percentage}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* HISTORY */}
                    <div className="mt-6 border-t border-slate-800 pt-5">
                      <h4 className="font-semibold">
                        Payment History
                      </h4>

                      <div className="mt-4 rounded-xl bg-slate-950 p-4">
                        <div className="flex justify-between gap-4 text-sm">
                          <div>
                            <p className="font-medium">
                              Initial Deposit
                            </p>

                            <p className="text-xs text-slate-500">
                              Recorded with sale
                            </p>
                          </div>

                          <p className="font-semibold">
                            ₦
                            {Number(
                              sale.initial_deposit
                            ).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {salePayments.length === 0 ? (
                        <p className="mt-4 text-sm text-slate-500">
                          No additional payments yet.
                        </p>
                      ) : (
                        <div className="mt-3 space-y-3">
                          {salePayments.map((payment) => (
                            <div
                              key={payment.id}
                              className="flex items-center justify-between gap-4 rounded-xl bg-slate-950 p-4"
                            >
                              <div>
                                <p className="font-medium">
                                  ₦
                                  {Number(
                                    payment.amount
                                  ).toLocaleString()}
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                  {payment.payment_date} •{" "}
                                  {payment.payment_method ||
                                    "Payment"}
                                </p>

                                {payment.payment_reference && (
                                  <p className="mt-1 text-xs text-slate-500">
                                    Ref:{" "}
                                    {
                                      payment.payment_reference
                                    }
                                  </p>
                                )}
                              </div>

                              <button
                                onClick={() =>
                                  deletePayment(payment.id)
                                }
                                className="rounded-lg border border-red-900 p-2 text-red-400 hover:bg-red-950"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}