import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
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

export default function Inspections({ onBack }: InspectionsProps) {
  const [companyId, setCompanyId] = useState<string | null>(null);

  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [customerId, setCustomerId] = useState("");
  const [propertyId, setPropertyId] = useState("");
  const [inspectionDate, setInspectionDate] = useState("");
  const [status, setStatus] = useState("scheduled");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadCompany();
  }, []);

  useEffect(() => {
    if (companyId) {
      loadInspections();
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

  const loadInspections = async () => {
    if (!companyId) return;

    const { data, error } = await supabase
      .from("inspections")
      .select("*")
      .eq("company_id", companyId)
      .order("inspection_date", { ascending: true });

    if (error) {
      console.error(error);
      return;
    }

    setInspections(data || []);
  };

  const loadCustomers = async () => {
    if (!companyId) return;

    const { data, error } = await supabase
      .from("customers")
      .select("id,full_name")
      .eq("company_id", companyId)
      .order("full_name");

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
      .eq("company_id", companyId)
      .order("title");

    if (error) {
      console.error(error);
      return;
    }

    setProperties(data || []);
  };

  const resetForm = () => {
    setEditingId(null);
    setCustomerId("");
    setPropertyId("");
    setInspectionDate("");
    setStatus("scheduled");
    setNotes("");
  };

  const saveInspection = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!companyId) {
      setMessage("Company not found.");
      return;
    }

    if (!propertyId) {
      setMessage("Please select a property.");
      return;
    }

    setLoading(true);
    setMessage("");

    const inspectionData = {
      company_id: companyId,
      customer_id: customerId || null,
      property_id: propertyId,
      inspection_date: inspectionDate,
      status,
      notes,
    };

    try {
      if (editingId) {
        const { error } = await supabase
          .from("inspections")
          .update(inspectionData)
          .eq("id", editingId)
          .eq("company_id", companyId);

        if (error) throw error;

        setMessage("Inspection updated successfully.");
      } else {
        const { error } = await supabase
          .from("inspections")
          .insert(inspectionData);

        if (error) throw error;

        setMessage("Inspection scheduled successfully.");
      }

      resetForm();
      await loadInspections();
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

  const startEditing = (inspection: Inspection) => {
    setEditingId(inspection.id);
    setCustomerId(inspection.customer_id || "");
    setPropertyId(inspection.property_id);

    const date = new Date(inspection.inspection_date);
    const formatted = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    )
      .toISOString()
      .slice(0, 16);

    setInspectionDate(formatted);
    setStatus(inspection.status);
    setNotes(inspection.notes || "");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deleteInspection = async (id: string) => {
    if (!window.confirm("Delete this inspection?")) return;

    const { error } = await supabase
      .from("inspections")
      .delete()
      .eq("id", id);

    if (error) {
      setMessage(error.message);
      return;
    }

    await loadInspections();
  };

  const getCustomerName = (id: string | null) => {
    if (!id) return "No customer";

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
            Property Operations
          </p>

          <h1 className="mt-1 text-3xl font-bold">
            Inspections
          </h1>

          <p className="mt-2 text-slate-400">
            Schedule and manage property inspections.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          {/* FORM */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="mb-5 text-xl font-semibold">
              {editingId
                ? "Edit Inspection"
                : "Schedule Inspection"}
            </h2>

            <form onSubmit={saveInspection} className="space-y-4">
              <select
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-orange-500"
              >
                <option value="">Select Customer</option>

                {customers.map((customer) => (
                  <option
                    key={customer.id}
                    value={customer.id}
                  >
                    {customer.full_name}
                  </option>
                ))}
              </select>

              <select
                value={propertyId}
                onChange={(e) => setPropertyId(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-orange-500"
              >
                <option value="">Select Property</option>

                {properties.map((property) => (
                  <option
                    key={property.id}
                    value={property.id}
                  >
                    {property.title}
                  </option>
                ))}
              </select>

              <input
                type="datetime-local"
                value={inspectionDate}
                onChange={(e) =>
                  setInspectionDate(e.target.value)
                }
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-orange-500"
              />

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-orange-500"
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

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Inspection notes"
                rows={4}
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
                  : editingId
                  ? "Update Inspection"
                  : "Schedule Inspection"}
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

          {/* LIST */}
          <div className="space-y-4">
            {inspections.length === 0 ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center text-slate-400">
                No inspections scheduled yet.
              </div>
            ) : (
              inspections.map((inspection) => (
                <div
                  key={inspection.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
                >
                  <div className="flex justify-between gap-4">
                    <div>
                      <span className="rounded-full bg-orange-500/10 px-3 py-1 text-xs font-semibold uppercase text-orange-400">
                        {inspection.status}
                      </span>

                      <h3 className="mt-3 text-xl font-bold">
                        {getPropertyName(
                          inspection.property_id
                        )}
                      </h3>

                      <div className="mt-3 space-y-1 text-sm text-slate-400">
                        <p>
                          Customer:{" "}
                          <span className="text-white">
                            {getCustomerName(
                              inspection.customer_id
                            )}
                          </span>
                        </p>

                        <p>
                          {new Date(
                            inspection.inspection_date
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          startEditing(inspection)
                        }
                        className="h-fit rounded-lg border border-slate-700 p-2 text-slate-400 hover:text-white"
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        onClick={() =>
                          deleteInspection(inspection.id)
                        }
                        className="h-fit rounded-lg border border-red-900 p-2 text-red-400 hover:bg-red-950"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </div>

                  {inspection.notes && (
                    <p className="mt-4 border-t border-slate-800 pt-4 text-sm text-slate-400">
                      {inspection.notes}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}