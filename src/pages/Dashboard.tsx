import { useEffect, useState } from "react";

import {
  BadgeDollarSign,
  Building2,
  CalendarDays,
  CreditCard,
  LogOut,
  MapPinned,
  ShieldCheck,
  UserRoundSearch,
  Users,
} from "lucide-react";

import { supabase } from "../lib/supabase";

type StaffRole =
  | "admin"
  | "manager"
  | "realtor"
  | "staff";

type DashboardProps = {
  onEstates: () => void;
  onProperties: () => void;
  onCustomers: () => void;
  onLeads: () => void;
  onInspections: () => void;
  onSales: () => void;
  onPayments: () => void;
  onStaff: () => void;
  staffRole: StaffRole | null;
};

type Stats = {
  properties: number;
  customers: number;
  leads: number;
  inspections: number;
  totalSales: number;
  totalPayments: number;
};

export default function Dashboard({
  onEstates,
  onProperties,
  onCustomers,
  onLeads,
  onInspections,
  onSales,
  onPayments,
  onStaff,
  staffRole,
}: DashboardProps) {
  const [stats, setStats] = useState<Stats>({
    properties: 0,
    customers: 0,
    leads: 0,
    inspections: 0,
    totalSales: 0,
    totalPayments: 0,
  });

  const [loading, setLoading] = useState(true);

  /* =====================================
     ROLE PERMISSIONS
  ===================================== */

  const isAdmin =
    staffRole === "admin";

  const isManager =
    staffRole === "manager";

  const isRealtor =
    staffRole === "realtor";

  const isStaff =
    staffRole === "staff";

  const canViewEstates =
    isAdmin || isManager;

  const canViewProperties =
    isAdmin || isManager || isRealtor;

  const canViewCustomers =
    isAdmin ||
    isManager ||
    isRealtor ||
    isStaff;

  const canViewLeads =
    isAdmin ||
    isManager ||
    isRealtor ||
    isStaff;

  const canViewInspections =
    isAdmin ||
    isManager ||
    isRealtor;

  const canViewSales =
    isAdmin || isManager;

  const canViewPayments =
    isAdmin || isManager;

  const canViewStaff =
    isAdmin;

  /* =====================================
     LOAD DASHBOARD
  ===================================== */

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
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
            "Staff company error:",
            staffError
          );

          return;
        }

        if (!staffMember?.company_id) {
          console.error(
            "Staff account is not linked to a company."
          );

          return;
        }

        const companyId =
          staffMember.company_id;

        const [
          propertiesResult,
          customersResult,
          leadsResult,
          inspectionsResult,
          salesResult,
          paymentsResult,
        ] = await Promise.all([
          supabase
            .from("properties")
            .select("id", {
              count: "exact",
              head: true,
            })
            .eq(
              "company_id",
              companyId
            ),

          supabase
            .from("customers")
            .select("id", {
              count: "exact",
              head: true,
            })
            .eq(
              "company_id",
              companyId
            ),

          supabase
            .from("leads")
            .select("id", {
              count: "exact",
              head: true,
            })
            .eq(
              "company_id",
              companyId
            ),

          supabase
            .from("inspections")
            .select("id", {
              count: "exact",
              head: true,
            })
            .eq(
              "company_id",
              companyId
            ),

          supabase
            .from("sales")
            .select(
              "sale_price,initial_deposit,status"
            )
            .eq(
              "company_id",
              companyId
            ),

          supabase
            .from("payments")
            .select(
              "amount,status"
            )
            .eq(
              "company_id",
              companyId
            ),
        ]);

        const validSales =
          salesResult.data?.filter(
            (sale) =>
              sale.status !==
              "cancelled"
          ) ?? [];

        const totalSales =
          validSales.reduce(
            (total, sale) =>
              total +
              Number(
                sale.sale_price || 0
              ),
            0
          );

        const totalInitialDeposits =
          validSales.reduce(
            (total, sale) =>
              total +
              Number(
                sale.initial_deposit ||
                  0
              ),
            0
          );

        const additionalPayments =
          paymentsResult.data
            ?.filter(
              (payment) =>
                payment.status ===
                "paid"
            )
            .reduce(
              (total, payment) =>
                total +
                Number(
                  payment.amount || 0
                ),
              0
            ) ?? 0;

        const totalPayments =
          totalInitialDeposits +
          additionalPayments;

        setStats({
          properties:
            propertiesResult.count ||
            0,

          customers:
            customersResult.count ||
            0,

          leads:
            leadsResult.count || 0,

          inspections:
            inspectionsResult.count ||
            0,

          totalSales,

          totalPayments,
        });
      } catch (error) {
        console.error(
          "Dashboard error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  /* =====================================
     LOGOUT
  ===================================== */

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  /* =====================================
     DASHBOARD CARDS
  ===================================== */

  const cards = [
    ...(canViewEstates
      ? [
          {
            title: "Estates",
            value: "Manage",
            icon: MapPinned,
            action: onEstates,
            loadingValue: false,
            description:
              "Manage Zertop developments and estates.",
          },
        ]
      : []),

    ...(canViewProperties
      ? [
          {
            title: "Properties",
            value:
              stats.properties.toString(),
            icon: Building2,
            action: onProperties,
            loadingValue: true,
            description:
              "View and manage property listings.",
          },
        ]
      : []),

    ...(canViewCustomers
      ? [
          {
            title: "Customers",
            value:
              stats.customers.toString(),
            icon: Users,
            action: onCustomers,
            loadingValue: true,
            description:
              "Manage registered property customers.",
          },
        ]
      : []),

    ...(canViewLeads
      ? [
          {
            title: "Leads",
            value:
              stats.leads.toString(),
            icon: UserRoundSearch,
            action: onLeads,
            loadingValue: true,
            description:
              "Follow up property enquiries and prospects.",
          },
        ]
      : []),

    ...(canViewInspections
      ? [
          {
            title: "Inspections",
            value:
              stats.inspections.toString(),
            icon: CalendarDays,
            action:
              onInspections,
            loadingValue: true,
            description:
              "Manage scheduled property inspections.",
          },
        ]
      : []),

    ...(canViewSales
      ? [
          {
            title: "Total Sales",
            value: `₦${stats.totalSales.toLocaleString()}`,
            icon:
              BadgeDollarSign,
            action: onSales,
            loadingValue: true,
            description:
              "Total value of active property sales.",
          },
        ]
      : []),

    ...(canViewPayments
      ? [
          {
            title:
              "Total Payments",
            value: `₦${stats.totalPayments.toLocaleString()}`,
            icon: CreditCard,
            action: onPayments,
            loadingValue: true,
            description:
              "Initial deposits and recorded payments.",
          },
        ]
      : []),

    ...(canViewStaff
      ? [
          {
            title:
              "Staff Management",
            value: "Manage",
            icon: ShieldCheck,
            action: onStaff,
            loadingValue: false,
            description:
              "Manage staff accounts, roles and access.",
          },
        ]
      : []),
  ];

  const roleName =
    staffRole === "admin"
      ? "Administrator"
      : staffRole === "manager"
        ? "Manager"
        : staffRole === "realtor"
          ? "Realtor"
          : "Staff";

  const outstandingBalance =
    Math.max(
      stats.totalSales -
        stats.totalPayments,
      0
    );

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0b1b35]">
      {/* =====================================
          HEADER
      ====================================== */}

      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 md:px-6">
          {/* LOGO */}
          <div className="flex items-center gap-4">
            <img
              src="/zertop-logo.png"
              alt="Zertop Limited"
              className="h-11 w-auto object-contain md:h-13"
            />

            <div className="hidden border-l border-gray-200 pl-4 md:block">
              <p className="text-sm font-bold text-[#0b1b35]">
                Management System
              </p>

              <p className="mt-0.5 text-xs text-gray-400">
                Staff Dashboard
              </p>
            </div>
          </div>

          {/* USER */}
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-xs text-gray-400">
                Signed in as
              </p>

              <div className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-[#f97316]">
                <ShieldCheck size={13} />
                {roleName}
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            >
              <LogOut size={17} />

              <span className="hidden sm:inline">
                Logout
              </span>
            </button>
          </div>
        </div>

        <div className="h-1 w-full bg-gradient-to-r from-[#f5a400] via-[#f97316] to-[#ef233c]" />
      </header>

      {/* =====================================
          MAIN
      ====================================== */}

      <main className="mx-auto max-w-7xl px-5 py-8 md:px-6 md:py-10">
        {/* WELCOME */}
        <section className="relative overflow-hidden rounded-[30px] border border-orange-100 bg-[#fffaf5] p-7 md:p-10">
          <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-yellow-100/80 blur-[90px]" />

          <div className="pointer-events-none absolute -bottom-32 right-40 h-64 w-64 rounded-full bg-red-100/60 blur-[100px]" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-3 py-1.5 text-xs font-bold text-[#f97316] shadow-sm">
              <ShieldCheck size={14} />
              {roleName} Access
            </div>

            <h1 className="mt-5 text-3xl font-black tracking-tight text-[#0b1b35] md:text-4xl">
              Welcome to Zertop
            </h1>

            <p className="mt-3 max-w-2xl leading-7 text-gray-600">
              Manage the properties, customers,
              enquiries and operations available to your
              staff account.
            </p>
          </div>
        </section>

        {/* =====================================
            OVERVIEW
        ====================================== */}

        <section className="mt-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f97316]">
              Overview
            </p>

            <h2 className="mt-2 text-2xl font-black text-[#0b1b35]">
              Management Dashboard
            </h2>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => {
              const Icon = card.icon;

              return (
                <button
                  key={card.title}
                  type="button"
                  onClick={card.action}
                  className="group rounded-3xl border border-gray-200 bg-white p-6 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-500">
                        {card.title}
                      </p>

                      <h3 className="mt-2 break-words text-2xl font-black text-[#0b1b35]">
                        {loading &&
                        card.loadingValue
                          ? "..."
                          : card.value}
                      </h3>
                    </div>

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-[#f97316] transition group-hover:bg-[#f97316] group-hover:text-white">
                      <Icon size={23} />
                    </div>
                  </div>

                  <p className="mt-5 border-t border-gray-100 pt-4 text-sm leading-6 text-gray-500">
                    {card.description}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        {/* =====================================
            FINANCIAL SUMMARY
        ====================================== */}

        {(canViewSales ||
          canViewPayments) && (
          <section className="mt-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f97316]">
                Financial Overview
              </p>

              <h2 className="mt-2 text-2xl font-black text-[#0b1b35]">
                Sales & Payments
              </h2>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {canViewSales && (
                <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-gray-500">
                        Property Sales
                      </p>

                      <p className="mt-2 text-2xl font-black text-[#0b1b35]">
                        {loading
                          ? "..."
                          : `₦${stats.totalSales.toLocaleString()}`}
                      </p>
                    </div>

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-[#f97316]">
                      <BadgeDollarSign
                        size={24}
                      />
                    </div>
                  </div>
                </div>
              )}

              {canViewPayments && (
                <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-gray-500">
                        Payments Received
                      </p>

                      <p className="mt-2 text-2xl font-black text-[#0b1b35]">
                        {loading
                          ? "..."
                          : `₦${stats.totalPayments.toLocaleString()}`}
                      </p>
                    </div>

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-600">
                      <CreditCard
                        size={24}
                      />
                    </div>
                  </div>
                </div>
              )}

              {canViewSales &&
                canViewPayments && (
                  <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm text-gray-500">
                          Outstanding Balance
                        </p>

                        <p className="mt-2 text-2xl font-black text-[#0b1b35]">
                          {loading
                            ? "..."
                            : `₦${outstandingBalance.toLocaleString()}`}
                        </p>
                      </div>

                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-[#ef233c]">
                        <BadgeDollarSign
                          size={24}
                        />
                      </div>
                    </div>
                  </div>
                )}
            </div>
          </section>
        )}

        {/* =====================================
            QUICK ACTIONS
        ====================================== */}

        <section className="mt-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f97316]">
              Quick Actions
            </p>

            <h2 className="mt-2 text-2xl font-black text-[#0b1b35]">
              Manage Zertop
            </h2>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {canViewProperties && (
              <QuickAction
                title="Manage Properties"
                text="Add or update listings."
                icon={
                  <Building2 size={21} />
                }
                onClick={onProperties}
                primary
              />
            )}

            {canViewCustomers && (
              <QuickAction
                title="Customers"
                text="Manage customer records."
                icon={<Users size={21} />}
                onClick={onCustomers}
              />
            )}

            {canViewLeads && (
              <QuickAction
                title="Leads"
                text="Follow up enquiries."
                icon={
                  <UserRoundSearch
                    size={21}
                  />
                }
                onClick={onLeads}
              />
            )}

            {canViewInspections && (
              <QuickAction
                title="Inspections"
                text="Manage appointments."
                icon={
                  <CalendarDays
                    size={21}
                  />
                }
                onClick={onInspections}
              />
            )}
          </div>
        </section>

        {/* =====================================
            SALES / PAYMENTS
        ====================================== */}

        {(canViewSales ||
          canViewPayments) && (
          <section className="mt-10 grid gap-5 md:grid-cols-2">
            {canViewSales && (
              <button
                type="button"
                onClick={onSales}
                className="group rounded-3xl border border-gray-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-[#f97316]">
                  <BadgeDollarSign
                    size={24}
                  />
                </div>

                <p className="mt-5 text-lg font-bold text-[#0b1b35]">
                  Record Property Sale
                </p>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Create and manage customer property
                  purchases.
                </p>
              </button>
            )}

            {canViewPayments && (
              <button
                type="button"
                onClick={onPayments}
                className="group rounded-3xl border border-gray-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-600">
                  <CreditCard
                    size={24}
                  />
                </div>

                <p className="mt-5 text-lg font-bold text-[#0b1b35]">
                  Record Customer Payment
                </p>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Record installments and monitor
                  customer payments.
                </p>
              </button>
            )}
          </section>
        )}

        {/* =====================================
            STAFF ADMIN
        ====================================== */}

        {canViewStaff && (
          <section className="mt-10">
            <button
              type="button"
              onClick={onStaff}
              className="w-full rounded-3xl border border-orange-100 bg-[#fffaf5] p-6 text-left transition hover:border-orange-300 sm:max-w-xl"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#f97316] shadow-sm">
                  <ShieldCheck
                    size={23}
                  />
                </div>

                <div>
                  <p className="font-bold text-[#0b1b35]">
                    Staff Management
                  </p>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    Create and manage staff accounts,
                    roles and access permissions.
                  </p>
                </div>
              </div>
            </button>
          </section>
        )}
      </main>

      {/* FOOTER */}
      <footer className="mt-14 border-t border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-sm text-gray-400 md:flex-row md:items-center md:justify-between md:px-6">
          <div className="flex items-center gap-3">
            <img
              src="/zertop-logo.png"
              alt="Zertop Limited"
              className="h-9 w-auto object-contain"
            />

            <span>
              Zertop Management System
            </span>
          </div>

          <p>
            © 2026 Zertop Limited. Internal staff
            access.
          </p>
        </div>
      </footer>
    </div>
  );
}

type QuickActionProps = {
  title: string;
  text: string;
  icon: React.ReactNode;
  onClick: () => void;
  primary?: boolean;
};

function QuickAction({
  title,
  text,
  icon,
  onClick,
  primary = false,
}: QuickActionProps) {
  if (primary) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="rounded-2xl bg-gradient-to-r from-[#f5a400] via-[#f97316] to-[#ef233c] p-5 text-left text-white shadow-lg shadow-orange-100 transition hover:-translate-y-1"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
          {icon}
        </div>

        <p className="mt-4 font-bold">
          {title}
        </p>

        <p className="mt-1 text-sm text-white/80">
          {text}
        </p>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-md"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-[#f97316]">
        {icon}
      </div>

      <p className="mt-4 font-bold text-[#0b1b35]">
        {title}
      </p>

      <p className="mt-1 text-sm text-gray-500">
        {text}
      </p>
    </button>
  );
}