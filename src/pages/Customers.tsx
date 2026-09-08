import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { supabase } from "../lib/supabase";

type Customer = {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  customer_type: string;
  notes: string | null;
};

type CustomersProps = {
  onBack: () => void;
};

export default function Customers({ onBack }: CustomersProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [companyId, setCompanyId] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [customerType, setCustomerType] = useState("prospect");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadCompany();
  }, []);

  useEffect(() => {
    if (companyId) {
      loadCustomers();
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
      return;
    }

    setCompanyId(data.id);
  };

  const loadCustomers = async () => {
    if (!companyId) return;

    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .eq("company_id", companyId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setCustomers(data || []);
  };

  const resetForm = () => {
    setEditingId(null);
    setFullName("");
    setEmail("");
    setPhone("");
    setAddress("");
    setCustomerType("prospect");
    setNotes("");
  };

  const startEditing = (customer: Customer) => {
    setEditingId(customer.id);
    setFullName(customer.full_name);
    setEmail(customer.email || "");
    setPhone(customer.phone || "");
    setAddress(customer.address || "");
    setCustomerType(customer.customer_type);
    setNotes(customer.notes || "");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const saveCustomer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!companyId) {
      setMessage("Company not found.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      if (editingId) {
        const { error } = await supabase
          .from("customers")
          .update({
            full_name: fullName,
            email,
            phone,
            address,
            customer_type: customerType,
            notes,
          })
          .eq("id", editingId)
          .eq("company_id", companyId);

        if (error) throw error;

        setMessage("Customer updated successfully.");
      } else {
        const { error } = await supabase.from("customers").insert({
          company_id: companyId,
          full_name: fullName,
          email,
          phone,
          address,
          customer_type: customerType,
          notes,
        });

        if (error) throw error;

        setMessage("Customer added successfully.");
      }

      resetForm();
      await loadCustomers();
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

  const deleteCustomer = async (id: string) => {
    if (!window.confirm("Delete this customer?")) return;

    const { error } = await supabase
      .from("customers")
      .delete()
      .eq("id", id);

    if (error) {
      setMessage(error.message);
      return;
    }

    await loadCustomers();
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
            Customer Management
          </p>

          <h1 className="mt-1 text-3xl font-bold">Customers</h1>

          <p className="mt-2 text-slate-400">
            Manage Zertop Limited buyers, prospects and investors.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="mb-5 text-xl font-semibold">
              {editingId ? "Edit Customer" : "Add Customer"}
            </h2>

            <form onSubmit={saveCustomer} className="space-y-4">
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="Full name"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-orange-500"
              />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-orange-500"
              />

              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-orange-500"
              />

              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Address"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-orange-500"
              />

              <select
                value={customerType}
                onChange={(e) => setCustomerType(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-orange-500"
              >
                <option value="prospect">Prospect</option>
                <option value="buyer">Buyer</option>
                <option value="tenant">Tenant</option>
                <option value="investor">Investor</option>
              </select>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notes"
                rows={4}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-orange-500"
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
                  ? "Update Customer"
                  : "Add Customer"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full rounded-xl border border-slate-700 py-3 text-slate-300 hover:bg-slate-800"
                >
                  Cancel Edit
                </button>
              )}
            </form>
          </div>

          <div>
            {customers.length === 0 ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center text-slate-400">
                No customers added yet.
              </div>
            ) : (
              <div className="space-y-4">
                {customers.map((customer) => (
                  <div
                    key={customer.id}
                    className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase text-orange-400">
                          {customer.customer_type}
                        </p>

                        <h3 className="mt-2 text-xl font-bold">
                          {customer.full_name}
                        </h3>

                        <div className="mt-3 space-y-1 text-sm text-slate-400">
                          <p>{customer.phone || "No phone"}</p>
                          <p>{customer.email || "No email"}</p>
                          <p>{customer.address || "No address"}</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditing(customer)}
                          className="rounded-lg border border-slate-700 p-2 text-slate-400 hover:text-white"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          onClick={() => deleteCustomer(customer.id)}
                          className="rounded-lg border border-red-900 p-2 text-red-400 hover:bg-red-950"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </div>

                    {customer.notes && (
                      <p className="mt-4 border-t border-slate-800 pt-4 text-sm text-slate-400">
                        {customer.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}