import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
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
};

type Property = {
  id: string;
  title: string;
};

type LeadsProps = {
  onBack: () => void;
};

export default function Leads({ onBack }: LeadsProps) {
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [propertyId, setPropertyId] = useState("");
  const [source, setSource] = useState("");
  const [status, setStatus] = useState("new");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadCompany();
  }, []);

  useEffect(() => {
    if (companyId) {
      loadLeads();
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

  const loadLeads = async () => {
    if (!companyId) return;

    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .eq("company_id", companyId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setLeads(data || []);
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
    setFullName("");
    setEmail("");
    setPhone("");
    setPropertyId("");
    setSource("");
    setStatus("new");
    setNotes("");
  };

  const saveLead = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!companyId) {
      setMessage("Company not found.");
      return;
    }

    setLoading(true);
    setMessage("");

    const leadData = {
      company_id: companyId,
      full_name: fullName,
      email,
      phone,
      property_id: propertyId || null,
      source,
      status,
      notes,
    };

    try {
      if (editingId) {
        const { error } = await supabase
          .from("leads")
          .update(leadData)
          .eq("id", editingId)
          .eq("company_id", companyId);

        if (error) throw error;

        setMessage("Lead updated successfully.");
      } else {
        const { error } = await supabase
          .from("leads")
          .insert(leadData);

        if (error) throw error;

        setMessage("Lead added successfully.");
      }

      resetForm();
      await loadLeads();
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

  const startEditing = (lead: Lead) => {
    setEditingId(lead.id);
    setFullName(lead.full_name || "");
    setEmail(lead.email || "");
    setPhone(lead.phone || "");
    setPropertyId(lead.property_id || "");
    setSource(lead.source || "");
    setStatus(lead.status);
    setNotes(lead.notes || "");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deleteLead = async (id: string) => {
    if (!window.confirm("Delete this lead?")) return;

    const { error } = await supabase
      .from("leads")
      .delete()
      .eq("id", id);

    if (error) {
      setMessage(error.message);
      return;
    }

    await loadLeads();
  };

  const getPropertyName = (id: string | null) => {
    if (!id) return "No property selected";

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
            CRM
          </p>

          <h1 className="mt-1 text-3xl font-bold">Leads</h1>

          <p className="mt-2 text-slate-400">
            Track potential buyers and property enquiries.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="mb-5 text-xl font-semibold">
              {editingId ? "Edit Lead" : "Add Lead"}
            </h2>

            <form onSubmit={saveLead} className="space-y-4">
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

              <select
                value={propertyId}
                onChange={(e) => setPropertyId(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-orange-500"
              >
                <option value="">Select Property</option>

                {properties.map((property) => (
                  <option key={property.id} value={property.id}>
                    {property.title}
                  </option>
                ))}
              </select>

              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-orange-500"
              >
                <option value="">Lead Source</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Facebook">Facebook</option>
                <option value="Instagram">Instagram</option>
                <option value="Website">Website</option>
                <option value="Referral">Referral</option>
                <option value="Walk-in">Walk-in</option>
                <option value="Other">Other</option>
              </select>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-orange-500"
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="inspection_scheduled">
                  Inspection Scheduled
                </option>
                <option value="negotiating">Negotiating</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
              </select>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notes"
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
                  ? "Update Lead"
                  : "Add Lead"}
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

          <div className="space-y-4">
            {leads.length === 0 ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center text-slate-400">
                No leads added yet.
              </div>
            ) : (
              leads.map((lead) => (
                <div
                  key={lead.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
                >
                  <div className="flex justify-between gap-4">
                    <div>
                      <span className="rounded-full bg-orange-500/10 px-3 py-1 text-xs font-semibold uppercase text-orange-400">
                        {lead.status.replaceAll("_", " ")}
                      </span>

                      <h3 className="mt-3 text-xl font-bold">
                        {lead.full_name}
                      </h3>

                      <p className="mt-2 text-sm text-slate-400">
                        Interested in:{" "}
                        <span className="text-white">
                          {getPropertyName(lead.property_id)}
                        </span>
                      </p>

                      <div className="mt-3 space-y-1 text-sm text-slate-400">
                        <p>{lead.phone || "No phone"}</p>
                        <p>{lead.email || "No email"}</p>
                        <p>
                          Source: {lead.source || "Not specified"}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditing(lead)}
                        className="h-fit rounded-lg border border-slate-700 p-2 text-slate-400 hover:text-white"
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        onClick={() => deleteLead(lead.id)}
                        className="h-fit rounded-lg border border-red-900 p-2 text-red-400 hover:bg-red-950"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </div>

                  {lead.notes && (
                    <p className="mt-4 border-t border-slate-800 pt-4 text-sm text-slate-400">
                      {lead.notes}
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