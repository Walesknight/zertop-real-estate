import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
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

export default function Sales({ onBack }: SalesProps) {
  const [companyId, setCompanyId] = useState<string | null>(null);

  const [sales, setSales] = useState<Sale[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [customerId, setCustomerId] = useState("");
  const [propertyId, setPropertyId] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [initialDeposit, setInitialDeposit] = useState("");
  const [paymentPlanMonths, setPaymentPlanMonths] = useState("");
  const [saleDate, setSaleDate] = useState("");
  const [status, setStatus] = useState("pending");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadCompany();
  }, []);

  useEffect(() => {
    if (companyId) {
      loadSales();
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
      setMessage("Company not found.");
      return;
    }

    setCompanyId(data.id);
  };

  const loadSales = async () => {
    if (!companyId) return;

    const { data, error } = await supabase
      .from("sales")
      .select("*")
      .eq("company_id", companyId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setSales(data || []);
  };

  const loadCustomers = async () => {
    if (!companyId) return;

    const { data } = await supabase
      .from("customers")
      .select("id,full_name")
      .eq("company_id", companyId)
      .order("full_name");

    setCustomers(data || []);
  };

  const loadProperties = async () => {
    if (!companyId) return;

    const { data } = await supabase
      .from("properties")
      .select("id,title")
      .eq("company_id", companyId)
      .order("title");

    setProperties(data || []);
  };

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

  const saveSale = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!companyId) {
      setMessage("Company not found.");
      return;
    }

    setLoading(true);
    setMessage("");

    const saleData = {
      company_id: companyId,
      customer_id: customerId,
      property_id: propertyId,
      sale_price: Number(salePrice),
      initial_deposit: Number(initialDeposit || 0),
      payment_plan_months: Number(paymentPlanMonths || 0),
      sale_date: saleDate,
      status,
      notes,
    };

    try {
      if (editingId) {
        const { error } = await supabase
          .from("sales")
          .update(saleData)
          .eq("id", editingId)
          .eq("company_id", companyId);

        if (error) throw error;

        setMessage("Sale updated successfully.");
      } else {
        const { error } = await supabase
          .from("sales")
          .insert(saleData);

        if (error) throw error;

        setMessage("Sale recorded successfully.");
      }

      resetForm();
      await loadSales();
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

  const startEditing = (sale: Sale) => {
    setEditingId(sale.id);
    setCustomerId(sale.customer_id);
    setPropertyId(sale.property_id);
    setSalePrice(String(sale.sale_price));
    setInitialDeposit(String(sale.initial_deposit));
    setPaymentPlanMonths(String(sale.payment_plan_months));
    setSaleDate(sale.sale_date);
    setStatus(sale.status);
    setNotes(sale.notes || "");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deleteSale = async (id: string) => {
    if (!window.confirm("Delete this sale record?")) return;

    const { error } = await supabase
      .from("sales")
      .delete()
      .eq("id", id);

    if (error) {
      setMessage(error.message);
      return;
    }

    await loadSales();
  };

  const getCustomerName = (id: string) =>
    customers.find((customer) => customer.id === id)?.full_name ||
    "Customer";

  const getPropertyName = (id: string) =>
    properties.find((property) => property.id === id)?.title ||
    "Property";

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
            Sales Management
          </p>

          <h1 className="mt-1 text-3xl font-bold">
            Property Sales
          </h1>

          <p className="mt-2 text-slate-400">
            Record property purchases and customer payment plans.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="mb-5 text-xl font-semibold">
              {editingId ? "Edit Sale" : "Record Sale"}
            </h2>

            <form onSubmit={saveSale} className="space-y-4">
              <select
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
              >
                <option value="">Select Customer</option>

                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.full_name}
                  </option>
                ))}
              </select>

              <select
                value={propertyId}
                onChange={(e) => setPropertyId(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
              >
                <option value="">Select Property</option>

                {properties.map((property) => (
                  <option key={property.id} value={property.id}>
                    {property.title}
                  </option>
                ))}
              </select>

              <input
                type="number"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                required
                placeholder="Sale Price"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
              />

              <input
                type="number"
                value={initialDeposit}
                onChange={(e) => setInitialDeposit(e.target.value)}
                placeholder="Initial Deposit"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
              />

              <input
                type="number"
                value={paymentPlanMonths}
                onChange={(e) => setPaymentPlanMonths(e.target.value)}
                placeholder="Payment Plan (Months)"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
              />

              <input
                type="date"
                value={saleDate}
                onChange={(e) => setSaleDate(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
              />

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
              >
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notes"
                rows={4}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
              />

              {message && (
                <p className="text-sm text-slate-300">{message}</p>
              )}

              <button
                disabled={loading}
                className="w-full rounded-xl bg-orange-500 py-3 font-semibold hover:bg-orange-600 disabled:opacity-50"
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
                  onClick={resetForm}
                  className="w-full rounded-xl border border-slate-700 py-3"
                >
                  Cancel Edit
                </button>
              )}
            </form>
          </div>

          <div className="space-y-4">
            {sales.length === 0 ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center text-slate-400">
                No sales recorded yet.
              </div>
            ) : (
              sales.map((sale) => (
                <div
                  key={sale.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
                >
                  <div className="flex justify-between gap-4">
                    <div>
                      <span className="rounded-full bg-orange-500/10 px-3 py-1 text-xs font-semibold uppercase text-orange-400">
                        {sale.status}
                      </span>

                      <h3 className="mt-3 text-xl font-bold">
                        {getPropertyName(sale.property_id)}
                      </h3>

                      <p className="mt-2 text-slate-400">
                        Buyer:{" "}
                        <span className="text-white">
                          {getCustomerName(sale.customer_id)}
                        </span>
                      </p>

                      <div className="mt-4 space-y-2 text-sm">
                        <p>
                          Sale Price:{" "}
                          <strong>
                            ₦{Number(sale.sale_price).toLocaleString()}
                          </strong>
                        </p>

                        <p>
                          Initial Deposit:{" "}
                          ₦{Number(
                            sale.initial_deposit
                          ).toLocaleString()}
                        </p>

                        <p>
                          Payment Plan:{" "}
                          {sale.payment_plan_months} months
                        </p>

                        <p className="text-slate-400">
                          Sale Date: {sale.sale_date}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditing(sale)}
                        className="h-fit rounded-lg border border-slate-700 p-2 text-slate-400 hover:text-white"
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        onClick={() => deleteSale(sale.id)}
                        className="h-fit rounded-lg border border-red-900 p-2 text-red-400 hover:bg-red-950"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}