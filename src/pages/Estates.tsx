import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
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

export default function Estates({ onBack }: EstatesProps) {
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [estates, setEstates] = useState<Estate[]>([]);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("active");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadCompany();
  }, []);

  useEffect(() => {
    if (companyId) {
      loadEstates();
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

    if (error || !data) {
      setMessage("Company not found.");
      return;
    }

    setCompanyId(data.id);
  };

  const loadEstates = async () => {
    if (!companyId) return;

    const { data, error } = await supabase
      .from("estates")
      .select("*")
      .eq("company_id", companyId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setEstates(data || []);
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setLocation("");
    setCity("");
    setState("");
    setDescription("");
    setStatus("active");
  };

  const saveEstate = async (e: React.FormEvent) => {
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
          .from("estates")
          .update({
            name,
            location,
            city,
            state,
            description,
            status,
          })
          .eq("id", editingId)
          .eq("company_id", companyId);

        if (error) throw error;

        setMessage("Estate updated successfully.");
      } else {
        const slug =
          name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "") +
          "-" +
          Math.random().toString(36).substring(2, 7);

        const { error } = await supabase.from("estates").insert({
          company_id: companyId,
          name,
          slug,
          location,
          city,
          state,
          description,
          status,
        });

        if (error) throw error;

        setMessage("Estate added successfully.");
      }

      resetForm();
      await loadEstates();
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

  const startEditing = (estate: Estate) => {
    setEditingId(estate.id);
    setName(estate.name);
    setLocation(estate.location || "");
    setCity(estate.city || "");
    setState(estate.state || "");
    setDescription(estate.description || "");
    setStatus(estate.status);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deleteEstate = async (id: string) => {
    if (!window.confirm("Delete this estate?")) return;

    const { error } = await supabase
      .from("estates")
      .delete()
      .eq("id", id);

    if (error) {
      setMessage(error.message);
      return;
    }

    await loadEstates();
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
            Property Development
          </p>

          <h1 className="mt-1 text-3xl font-bold">Estates</h1>

          <p className="mt-2 text-slate-400">
            Manage Zertop Limited estates and development phases.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="mb-5 text-xl font-semibold">
              {editingId ? "Edit Estate" : "Add Estate"}
            </h2>

            <form onSubmit={saveEstate} className="space-y-4">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Estate name e.g. Hilltop Estate Phase 2"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-orange-500"
              />

              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-orange-500"
              />

              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-orange-500"
              />

              <input
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="State"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-orange-500"
              />

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="completed">Completed</option>
              </select>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Estate description"
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
                  ? "Update Estate"
                  : "Add Estate"}
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
            {estates.length === 0 ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center text-slate-400">
                No estates added yet.
              </div>
            ) : (
              estates.map((estate) => (
                <div
                  key={estate.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
                >
                  <div className="flex justify-between gap-4">
                    <div>
                      <span className="rounded-full bg-orange-500/10 px-3 py-1 text-xs font-semibold uppercase text-orange-400">
                        {estate.status}
                      </span>

                      <h3 className="mt-3 text-xl font-bold">
                        {estate.name}
                      </h3>

                      <div className="mt-3 space-y-1 text-sm text-slate-400">
                        <p>
                          {estate.location || "Location not specified"}
                        </p>

                        <p>
                          {[estate.city, estate.state]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      </div>

                      {estate.description && (
                        <p className="mt-4 text-sm text-slate-400">
                          {estate.description}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditing(estate)}
                        className="h-fit rounded-lg border border-slate-700 p-2 text-slate-400 hover:text-white"
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        onClick={() => deleteEstate(estate.id)}
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