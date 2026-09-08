import { useEffect, useState } from "react";
import {
  Building2,
  MapPinned,
  Users,
  UserRoundSearch,
  CalendarDays,
  BadgeDollarSign,
  CreditCard,
  LogOut,
  ShieldCheck,
} from "lucide-react";

import { supabase } from "../lib/supabase";

type StaffRole =
  | "admin"
  | "manager"
  | "agent"
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
  const [stats, setStats] =
    useState<Stats>({
      properties: 0,
      customers: 0,
      leads: 0,
      inspections: 0,
      totalSales: 0,
      totalPayments: 0,
    });

  const [loading, setLoading] =
    useState(true);

  // =====================================
  // ROLE PERMISSIONS
  // =====================================

  const isAdmin =
    staffRole === "admin";

  const isManager =
    staffRole === "manager";

  const isAgent =
    staffRole === "agent";

  const isStaff =
    staffRole === "staff";

  const canViewEstates =
    isAdmin || isManager;

  const canViewProperties =
    isAdmin || isManager || isAgent;

  const canViewCustomers =
    isAdmin ||
    isManager ||
    isAgent ||
    isStaff;

  const canViewLeads =
    isAdmin ||
    isManager ||
    isAgent ||
    isStaff;

  const canViewInspections =
    isAdmin ||
    isManager ||
    isAgent;

  const canViewSales =
    isAdmin || isManager;

  const canViewPayments =
    isAdmin || isManager;

  const canViewStaff =
    isAdmin;

  // =====================================
  // LOAD DASHBOARD
  // =====================================

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);

      try {
        const {
          data: { user },
        } =
          await supabase.auth.getUser();

        if (!user) {
          return;
        }

        // Get the company directly from
        // the logged-in staff record.
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

  // =====================================
  // LOGOUT
  // =====================================

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // =====================================
  // DASHBOARD CARDS
  // =====================================

  const cards = [
    ...(canViewEstates
      ? [
          {
            title: "Estates",
            value: "Manage",
            icon: MapPinned,
            action: onEstates,
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
          },
        ]
      : []),

    ...(canViewInspections
      ? [
          {
            title:
              "Inspections",
            value:
              stats.inspections.toString(),
            icon: CalendarDays,
            action:
              onInspections,
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
          },
        ]
      : []),
  ];

  const roleName =
    staffRole === "admin"
      ? "Administrator"
      : staffRole === "manager"
        ? "Manager"
        : staffRole === "agent"
          ? "Agent"
          : "Staff";

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* HEADER */}

      <header className="border-b border-slate-800 bg-slate-900">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold">
              Zertop Limited
            </h1>

            <p className="text-sm text-slate-400">
              Real Estate Management
              System
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-xs text-slate-500">
                Signed in as
              </p>

              <p className="text-sm font-medium text-orange-500">
                {roleName}
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* MAIN */}

      <main className="mx-auto max-w-7xl p-6">
        <div className="mb-8">
          <p className="text-sm font-semibold text-orange-500">
            Dashboard
          </p>

          <h2 className="mt-1 text-3xl font-bold">
            Welcome to Zertop
          </h2>

          <p className="mt-2 text-slate-400">
            Manage the areas available
            to your staff role.
          </p>
        </div>

        {/* CARDS */}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <button
                key={card.title}
                type="button"
                onClick={card.action}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-left transition hover:border-orange-500"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-slate-400">
                      {card.title}
                    </p>

                    <h3 className="mt-2 text-2xl font-bold">
                      {loading
                        ? "..."
                        : card.value}
                    </h3>
                  </div>

                  <div className="rounded-xl bg-orange-500/10 p-3 text-orange-500">
                    <Icon size={24} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* QUICK ACTIONS */}

        <div className="mt-10">
          <h3 className="text-xl font-semibold">
            Quick Actions
          </h3>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {canViewProperties && (
              <button
                type="button"
                onClick={onProperties}
                className="rounded-xl bg-orange-500 px-5 py-4 font-semibold transition hover:bg-orange-600"
              >
                Add Property
              </button>
            )}

            {canViewCustomers && (
              <button
                type="button"
                onClick={onCustomers}
                className="rounded-xl border border-slate-700 bg-slate-900 px-5 py-4 font-semibold transition hover:bg-slate-800"
              >
                Add Customer
              </button>
            )}

            {canViewLeads && (
              <button
                type="button"
                onClick={onLeads}
                className="rounded-xl border border-slate-700 bg-slate-900 px-5 py-4 font-semibold transition hover:bg-slate-800"
              >
                Add Lead
              </button>
            )}

            {canViewInspections && (
              <button
                type="button"
                onClick={
                  onInspections
                }
                className="rounded-xl border border-slate-700 bg-slate-900 px-5 py-4 font-semibold transition hover:bg-slate-800"
              >
                Schedule Inspection
              </button>
            )}
          </div>
        </div>

        {/* FINANCIAL ACTIONS */}

        {(canViewSales ||
          canViewPayments) && (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {canViewSales && (
              <button
                type="button"
                onClick={onSales}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-5 text-left transition hover:border-orange-500"
              >
                <p className="font-semibold">
                  Record Property Sale
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  Create a new customer
                  property purchase.
                </p>
              </button>
            )}

            {canViewPayments && (
              <button
                type="button"
                onClick={onPayments}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-5 text-left transition hover:border-orange-500"
              >
                <p className="font-semibold">
                  Record Customer
                  Payment
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  Record installments
                  and monitor balances.
                </p>
              </button>
            )}
          </div>
        )}

        {/* ADMIN ACTION */}

        {canViewStaff && (
          <div className="mt-8">
            <button
              type="button"
              onClick={onStaff}
              className="w-full rounded-2xl border border-slate-800 bg-slate-900 p-5 text-left transition hover:border-orange-500 sm:max-w-md"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-orange-500/10 p-3 text-orange-500">
                  <ShieldCheck
                    size={22}
                  />
                </div>

                <div>
                  <p className="font-semibold">
                    Staff Management
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    Manage staff
                    accounts, roles and
                    permissions.
                  </p>
                </div>
              </div>
            </button>
          </div>
        )}
      </main>
    </div>
  );
}