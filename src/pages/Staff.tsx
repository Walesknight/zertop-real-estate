import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ShieldCheck,
  UserCheck,
  UserPlus,
  UserX,
  Users,
  X,
} from "lucide-react";

import { supabase } from "../lib/supabase";

type StaffProps = {
  onBack: () => void;
};

type StaffRole = "admin" | "manager" | "agent" | "staff";

type StaffMember = {
  id: string;
  user_id: string;
  full_name: string | null;
  role: StaffRole;
  active: boolean;
  created_at: string;
};

export default function Staff({ onBack }: StaffProps) {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [showAddStaff, setShowAddStaff] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<StaffRole>("staff");

  const [creatingStaff, setCreatingStaff] = useState(false);

  const loadStaff = async () => {
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase
      .from("staff_members")
      .select(
        "id,user_id,full_name,role,active,created_at"
      )
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(error);
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setStaff((data ?? []) as StaffMember[]);
    setLoading(false);
  };

  useEffect(() => {
    loadStaff();
  }, []);

  const createStaff = async (e: React.FormEvent) => {
    e.preventDefault();

    setMessage("");
    setCreatingStaff(true);

    try {
      const { data, error } =
        await supabase.functions.invoke("create-staff", {
          body: {
            fullName,
            email,
            password,
            role,
          },
        });

      if (error) {
        throw error;
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      setFullName("");
      setEmail("");
      setPassword("");
      setRole("staff");
      setShowAddStaff(false);

      setMessage("Staff account created successfully.");

      await loadStaff();
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage("Unable to create staff account.");
      }
    } finally {
      setCreatingStaff(false);
    }
  };

  const changeRole = async (
    staffId: string,
    newRole: StaffRole
  ) => {
    setMessage("");

    const { error } = await supabase
      .from("staff_members")
      .update({
        role: newRole,
      })
      .eq("id", staffId);

    if (error) {
      setMessage(error.message);
      return;
    }

    setStaff((current) =>
      current.map((member) =>
        member.id === staffId
          ? {
              ...member,
              role: newRole,
            }
          : member
      )
    );
  };

  const toggleStaff = async (
    staffId: string,
    currentStatus: boolean
  ) => {
    setMessage("");

    const newStatus = !currentStatus;

    const { error } = await supabase
      .from("staff_members")
      .update({
        active: newStatus,
      })
      .eq("id", staffId);

    if (error) {
      setMessage(error.message);
      return;
    }

    setStaff((current) =>
      current.map((member) =>
        member.id === staffId
          ? {
              ...member,
              active: newStatus,
            }
          : member
      )
    );
  };

  const activeStaff = staff.filter(
    (member) => member.active
  ).length;

  const admins = staff.filter(
    (member) =>
      member.role === "admin" && member.active
  ).length;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <button
              type="button"
              onClick={onBack}
              className="mb-4 flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
            >
              <ArrowLeft size={18} />
              Back to Dashboard
            </button>

            <h1 className="text-3xl font-bold">
              Staff Management
            </h1>

            <p className="mt-2 text-slate-400">
              Manage Zertop staff accounts, roles and access.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setMessage("");
              setShowAddStaff(true);
            }}
            className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600"
          >
            <UserPlus size={18} />
            Add Staff
          </button>
        </div>

        {/* ADD STAFF FORM */}
        {showAddStaff && (
          <div className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">
                  Add Staff Member
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Create a new authorized Zertop staff account.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddStaff(false)}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={createStaff}
              className="grid gap-5 md:grid-cols-2"
            >
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Full Name
                </label>

                <input
                  type="text"
                  value={fullName}
                  onChange={(e) =>
                    setFullName(e.target.value)
                  }
                  required
                  placeholder="Staff full name"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                  autoComplete="off"
                  placeholder="staff@example.com"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Temporary Password
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                  minLength={6}
                  autoComplete="new-password"
                  placeholder="Minimum 6 characters"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Role
                </label>

                <select
                  value={role}
                  onChange={(e) =>
                    setRole(e.target.value as StaffRole)
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-orange-500"
                >
                  <option value="staff">
                    Staff
                  </option>

                  <option value="agent">
                    Agent
                  </option>

                  <option value="manager">
                    Manager
                  </option>

                  <option value="admin">
                    Admin
                  </option>
                </select>
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={creatingStaff}
                  className="rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {creatingStaff
                    ? "Creating Staff..."
                    : "Create Staff Account"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STATS */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="flex items-center gap-3">
              <Users className="text-orange-500" />

              <div>
                <p className="text-sm text-slate-400">
                  Total Staff
                </p>

                <p className="text-2xl font-bold">
                  {staff.length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="flex items-center gap-3">
              <UserCheck className="text-orange-500" />

              <div>
                <p className="text-sm text-slate-400">
                  Active Staff
                </p>

                <p className="text-2xl font-bold">
                  {activeStaff}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-orange-500" />

              <div>
                <p className="text-sm text-slate-400">
                  Administrators
                </p>

                <p className="text-2xl font-bold">
                  {admins}
                </p>
              </div>
            </div>
          </div>
        </div>

        {message && (
          <div className="mb-6 rounded-xl border border-slate-700 bg-slate-900 p-4 text-sm text-slate-200">
            {message}
          </div>
        )}

        {/* STAFF LIST */}
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
          <div className="border-b border-slate-800 px-6 py-5">
            <h2 className="text-lg font-semibold">
              Staff Accounts
            </h2>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-400">
              Loading staff...
            </div>
          ) : staff.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              No staff members found.
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
              {staff.map((member) => (
                <div
                  key={member.id}
                  className="grid gap-5 p-6 md:grid-cols-[1fr_180px_140px]"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-800 font-bold text-orange-500">
                        {member.full_name
                          ?.charAt(0)
                          .toUpperCase() || "S"}
                      </div>

                      <div>
                        <p className="font-semibold">
                          {member.full_name ||
                            "Staff Member"}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {member.user_id}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3">
                      {member.active ? (
                        <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
                          Active
                        </span>
                      ) : (
                        <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400">
                          Inactive
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500">
                      Role
                    </label>

                    <select
                      value={member.role}
                      onChange={(e) =>
                        changeRole(
                          member.id,
                          e.target.value as StaffRole
                        )
                      }
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-orange-500"
                    >
                      <option value="admin">
                        Admin
                      </option>

                      <option value="manager">
                        Manager
                      </option>

                      <option value="agent">
                        Agent
                      </option>

                      <option value="staff">
                        Staff
                      </option>
                    </select>
                  </div>

                  <div className="flex items-center md:justify-end">
                    <button
                      type="button"
                      onClick={() =>
                        toggleStaff(
                          member.id,
                          member.active
                        )
                      }
                      className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition md:w-auto ${
                        member.active
                          ? "border border-red-900 text-red-400 hover:bg-red-950/40"
                          : "border border-green-900 text-green-400 hover:bg-green-950/40"
                      }`}
                    >
                      {member.active ? (
                        <>
                          <UserX size={16} />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <UserCheck size={16} />
                          Activate
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}