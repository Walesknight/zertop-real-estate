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

type StaffRole =
  | "admin"
  | "manager"
  | "realtor"
  | "staff";

type StaffMember = {
  id: string;
  user_id: string;
  full_name: string | null;
  role: StaffRole;
  active: boolean;
  created_at: string;
};

export default function Staff({
  onBack,
}: StaffProps) {
  const [staff, setStaff] = useState<StaffMember[]>([]);

  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");

  const [messageType, setMessageType] = useState<
    "success" | "error" | null
  >(null);

  const [showAddStaff, setShowAddStaff] =
    useState(false);

  const [fullName, setFullName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [role, setRole] =
    useState<StaffRole>("staff");

  const [creatingStaff, setCreatingStaff] =
    useState(false);

  /* =====================================
     LOAD STAFF
  ===================================== */

  const loadStaff = async () => {
    setLoading(true);
    setMessage("");
    setMessageType(null);

    const { data, error } =
      await supabase
        .from("staff_members")
        .select(
          "id,user_id,full_name,role,active,created_at"
        )
        .order("created_at", {
          ascending: false,
        });

    if (error) {
      console.error(
        "Staff loading error:",
        error
      );

      setMessage(error.message);
      setMessageType("error");
      setLoading(false);
      return;
    }

    setStaff(
      (data ?? []) as StaffMember[]
    );

    setLoading(false);
  };

  useEffect(() => {
    loadStaff();
  }, []);

  /* =====================================
     CREATE STAFF
  ===================================== */

  const createStaff = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setMessage("");
    setMessageType(null);
    setCreatingStaff(true);

    try {
      const { data, error } =
        await supabase.functions.invoke(
          "create-staff",
          {
            body: {
              fullName:
                fullName.trim(),

              email:
                email.trim(),

              password,

              role,
            },
          }
        );

      if (error) {
        throw error;
      }

      if (data?.error) {
        throw new Error(
          data.error
        );
      }

      setFullName("");
      setEmail("");
      setPassword("");
      setRole("staff");

      setShowAddStaff(false);

      setMessage(
        "Staff account created successfully."
      );

      setMessageType("success");

      await loadStaff();
    } catch (error) {
      console.error(
        "Create staff error:",
        error
      );

      setMessageType("error");

      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage(
          "Unable to create staff account."
        );
      }
    } finally {
      setCreatingStaff(false);
    }
  };

  /* =====================================
     CHANGE ROLE
  ===================================== */

  const changeRole = async (
    staffId: string,
    newRole: StaffRole
  ) => {
    setMessage("");
    setMessageType(null);

    const { error } =
      await supabase
        .from("staff_members")
        .update({
          role: newRole,
        })
        .eq("id", staffId);

    if (error) {
      setMessage(error.message);
      setMessageType("error");
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

    setMessage(
      "Staff role updated successfully."
    );

    setMessageType("success");
  };

  /* =====================================
     ACTIVATE / DEACTIVATE
  ===================================== */

  const toggleStaff = async (
    staffId: string,
    currentStatus: boolean
  ) => {
    setMessage("");
    setMessageType(null);

    const newStatus =
      !currentStatus;

    const { error } =
      await supabase
        .from("staff_members")
        .update({
          active: newStatus,
        })
        .eq("id", staffId);

    if (error) {
      setMessage(error.message);
      setMessageType("error");
      return;
    }

    setStaff((current) =>
      current.map((member) =>
        member.id === staffId
          ? {
              ...member,
              active:
                newStatus,
            }
          : member
      )
    );

    setMessage(
      newStatus
        ? "Staff account activated."
        : "Staff account deactivated."
    );

    setMessageType("success");
  };

  /* =====================================
     STATS
  ===================================== */

  const activeStaff =
    staff.filter(
      (member) =>
        member.active
    ).length;

  const admins =
    staff.filter(
      (member) =>
        member.role ===
          "admin" &&
        member.active
    ).length;

  const managers =
    staff.filter(
      (member) =>
        member.role ===
          "manager" &&
        member.active
    ).length;

  const realtors =
    staff.filter(
      (member) =>
        member.role ===
          "realtor" &&
        member.active
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
                Staff Management
              </p>

              <p className="text-xs text-gray-400">
                Administrator Access
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:border-orange-200 hover:bg-orange-50 hover:text-[#f97316]"
          >
            <ArrowLeft size={17} />

            <span className="hidden sm:inline">
              Dashboard
            </span>
          </button>
        </div>

        <div className="h-1 bg-gradient-to-r from-[#f5a400] via-[#f97316] to-[#ef233c]" />
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8 md:px-6 md:py-10">
        {/* PAGE TITLE */}
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f97316]">
              Administration
            </p>

            <h1 className="mt-2 text-3xl font-black md:text-4xl">
              Staff Management
            </h1>

            <p className="mt-2 max-w-xl text-gray-500">
              Create staff accounts,
              manage roles and control
              access to the Zertop
              management system.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setMessage("");
              setMessageType(null);
              setShowAddStaff(true);
            }}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f5a400] via-[#f97316] to-[#ef233c] px-5 py-3 font-bold text-white shadow-lg shadow-orange-100 transition hover:-translate-y-0.5"
          >
            <UserPlus size={18} />
            Add Staff
          </button>
        </div>

        {/* ROLE INFO */}
        <div className="mb-8 rounded-3xl border border-orange-100 bg-[#fffaf5] p-5">
          <p className="font-bold text-[#0b1b35]">
            Staff Access Levels
          </p>

          <div className="mt-4 grid gap-3 text-sm text-gray-600 sm:grid-cols-2 lg:grid-cols-4">
            <RoleInfo
              title="Admin"
              text="Full system access, including staff management."
            />

            <RoleInfo
              title="Manager"
              text="Manages estates, properties, sales and payments."
            />

            <RoleInfo
              title="Realtor"
              text="Handles leads, customers and property inspections."
            />

            <RoleInfo
              title="Staff"
              text="Basic customer and lead management access."
            />
          </div>
        </div>

        {/* ADD STAFF FORM */}
        {showAddStaff && (
          <div className="mb-8 rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm md:p-8">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#f97316]">
                  New Account
                </p>

                <h2 className="mt-2 text-2xl font-black">
                  Add Staff Member
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Create a new authorized
                  Zertop staff account.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowAddStaff(
                    false
                  )
                }
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-500 transition hover:bg-red-50 hover:text-red-500"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={createStaff}
              className="grid gap-5 md:grid-cols-2"
            >
              <FormField label="Full Name">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) =>
                    setFullName(
                      e.target.value
                    )
                  }
                  required
                  placeholder="Staff full name"
                  className={inputClass}
                />
              </FormField>

              <FormField label="Email Address">
                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  required
                  autoComplete="off"
                  placeholder="staff@zertop.com.ng"
                  className={inputClass}
                />
              </FormField>

              <FormField label="Temporary Password">
                <input
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  required
                  minLength={6}
                  autoComplete="new-password"
                  placeholder="Minimum 6 characters"
                  className={inputClass}
                />
              </FormField>

              <FormField label="Staff Role">
                <select
                  value={role}
                  onChange={(e) =>
                    setRole(
                      e.target
                        .value as StaffRole
                    )
                  }
                  className={inputClass}
                >
                  <option value="staff">
                    Staff
                  </option>

                  <option value="realtor">
                    Realtor
                  </option>

                  <option value="manager">
                    Manager
                  </option>

                  <option value="admin">
                    Admin
                  </option>
                </select>
              </FormField>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={
                    creatingStaff
                  }
                  className="rounded-xl bg-gradient-to-r from-[#f5a400] via-[#f97316] to-[#ef233c] px-6 py-3.5 font-bold text-white shadow-md transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
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
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={
              <Users size={22} />
            }
            title="Total Staff"
            value={staff.length}
          />

          <StatCard
            icon={
              <UserCheck
                size={22}
              />
            }
            title="Active Staff"
            value={activeStaff}
          />

          <StatCard
            icon={
              <ShieldCheck
                size={22}
              />
            }
            title="Managers"
            value={managers}
          />

          <StatCard
            icon={
              <Users size={22} />
            }
            title="Realtors"
            value={realtors}
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

        {/* STAFF LIST */}
        <div className="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
            <div>
              <h2 className="text-lg font-black">
                Staff Accounts
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                {admins} active administrator
                {admins === 1
                  ? ""
                  : "s"}
              </p>
            </div>

            <ShieldCheck
              size={23}
              className="text-[#f97316]"
            />
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <img
                src="/zertop-logo.png"
                alt="Zertop Limited"
                className="mx-auto h-12 w-auto object-contain"
              />

              <p className="mt-5 text-sm text-gray-500">
                Loading staff...
              </p>
            </div>
          ) : staff.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No staff members found.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {staff.map(
                (member) => (
                  <div
                    key={
                      member.id
                    }
                    className="grid gap-5 p-6 lg:grid-cols-[1fr_210px_160px] lg:items-center"
                  >
                    {/* PERSON */}
                    <div>
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-lg font-black text-[#f97316]">
                          {member.full_name
                            ?.charAt(
                              0
                            )
                            .toUpperCase() ||
                            "S"}
                        </div>

                        <div className="min-w-0">
                          <p className="font-bold text-[#0b1b35]">
                            {member.full_name ||
                              "Staff Member"}
                          </p>

                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            {member.active ? (
                              <span className="rounded-full bg-green-50 px-3 py-1 text-[11px] font-bold uppercase text-green-700">
                                Active
                              </span>
                            ) : (
                              <span className="rounded-full bg-red-50 px-3 py-1 text-[11px] font-bold uppercase text-red-600">
                                Inactive
                              </span>
                            )}

                            <span className="rounded-full bg-gray-100 px-3 py-1 text-[11px] font-semibold capitalize text-gray-500">
                              {
                                member.role
                              }
                            </span>
                          </div>

                          <p className="mt-2 truncate text-xs text-gray-400">
                            Account ID:{" "}
                            {
                              member.user_id
                            }
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* ROLE */}
                    <div>
                      <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-400">
                        Role
                      </label>

                      <select
                        value={
                          member.role
                        }
                        onChange={(
                          e
                        ) =>
                          changeRole(
                            member.id,
                            e.target
                              .value as StaffRole
                          )
                        }
                        className={inputClass}
                      >
                        <option value="admin">
                          Admin
                        </option>

                        <option value="manager">
                          Manager
                        </option>

                        <option value="realtor">
                          Realtor
                        </option>

                        <option value="staff">
                          Staff
                        </option>
                      </select>
                    </div>

                    {/* STATUS */}
                    <div className="lg:text-right">
                      <button
                        type="button"
                        onClick={() =>
                          toggleStaff(
                            member.id,
                            member.active
                          )
                        }
                        className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition lg:w-auto ${
                          member.active
                            ? "border border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                            : "border border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                        }`}
                      >
                        {member.active ? (
                          <>
                            <UserX
                              size={16}
                            />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <UserCheck
                              size={16}
                            />
                            Activate
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
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

type StatCardProps = {
  icon: React.ReactNode;
  title: string;
  value: number;
};

function StatCard({
  icon,
  title,
  value,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-[#f97316]">
          {icon}
        </div>

        <div>
          <p className="text-sm text-gray-500">
            {title}
          </p>

          <p className="mt-1 text-2xl font-black">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

type RoleInfoProps = {
  title: string;
  text: string;
};

function RoleInfo({
  title,
  text,
}: RoleInfoProps) {
  return (
    <div className="rounded-2xl border border-orange-100 bg-white p-4">
      <p className="font-bold text-[#0b1b35]">
        {title}
      </p>

      <p className="mt-2 text-xs leading-5 text-gray-500">
        {text}
      </p>
    </div>
  );
}