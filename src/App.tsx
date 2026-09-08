import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";

import { supabase } from "./lib/supabase";

import Home from "./pages/Home";
import About from "./pages/About";
import Developments from "./pages/Developments";
import Contact from "./pages/Contact";

import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Estates from "./pages/Estates";
import Properties from "./pages/Properties";
import Customers from "./pages/Customers";
import Leads from "./pages/Leads";
import Inspections from "./pages/Inspections";
import Sales from "./pages/Sales";
import Payments from "./pages/Payments";
import Staff from "./pages/Staff";

import PublicProperties from "./pages/PublicProperties";
import PublicPropertyDetails from "./pages/PublicPropertyDetails";

type Page =
  | "home"
  | "about"
  | "developments"
  | "contact"
  | "login"
  | "dashboard"
  | "estates"
  | "properties"
  | "customers"
  | "leads"
  | "inspections"
  | "sales"
  | "payments"
  | "staff"
  | "public-properties"
  | "property-details";

type StaffRole =
  | "admin"
  | "manager"
  | "agent"
  | "staff";

function App() {
  const [session, setSession] =
    useState<Session | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [page, setPage] =
    useState<Page>("home");

  const [
    selectedPropertyId,
    setSelectedPropertyId,
  ] = useState<string | null>(null);

  const [
    staffVerified,
    setStaffVerified,
  ] = useState<boolean | null>(null);

  const [staffRole, setStaffRole] =
    useState<StaffRole | null>(null);

  // =====================================
  // PERMISSIONS
  // =====================================

  const canAccess = (targetPage: Page) => {
    if (!staffRole) {
      return false;
    }

    if (staffRole === "admin") {
      return true;
    }

    if (staffRole === "manager") {
      return [
        "dashboard",
        "estates",
        "properties",
        "customers",
        "leads",
        "inspections",
        "sales",
        "payments",
      ].includes(targetPage);
    }

    if (staffRole === "agent") {
      return [
        "dashboard",
        "properties",
        "customers",
        "leads",
        "inspections",
      ].includes(targetPage);
    }

    if (staffRole === "staff") {
      return [
        "dashboard",
        "customers",
        "leads",
      ].includes(targetPage);
    }

    return false;
  };

  const renderPermissionDenied = () => {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080808] px-6 text-white">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111111] p-8 text-center">
          <h1 className="text-2xl font-bold">
            Permission Denied
          </h1>

          <p className="mt-3 text-white/45">
            Your staff role does not have permission
            to access this section.
          </p>

          <button
            type="button"
            onClick={() =>
              setPage("dashboard")
            }
            className="mt-6 w-full rounded-xl bg-gradient-to-r from-[#f59e0b] via-[#f97316] to-[#dc2626] px-6 py-3 font-semibold transition hover:brightness-110"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  };

  // =====================================
  // AUTH SESSION
  // =====================================

  useEffect(() => {
    const loadSession = async () => {
      const { data } =
        await supabase.auth.getSession();

      setSession(data.session);
      setLoading(false);
    };

    loadSession();

    const {
      data: { subscription },
    } =
      supabase.auth.onAuthStateChange(
        (_event, newSession) => {
          setSession(newSession);

          if (!newSession) {
            setStaffVerified(null);
            setStaffRole(null);
          }
        }
      );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // =====================================
  // VERIFY STAFF
  // =====================================

  useEffect(() => {
    const verifyStaff = async () => {
      if (!session?.user) {
        setStaffVerified(null);
        setStaffRole(null);
        return;
      }

      setStaffVerified(null);
      setStaffRole(null);

      const { data, error } =
        await supabase
          .from("staff_members")
          .select("id,active,role")
          .eq(
            "user_id",
            session.user.id
          )
          .eq("active", true)
          .maybeSingle();

      if (error) {
        console.error(
          "Staff verification error:",
          error
        );

        setStaffVerified(false);
        setStaffRole(null);

        return;
      }

      if (!data) {
        setStaffVerified(false);
        setStaffRole(null);

        return;
      }

      setStaffVerified(true);
      setStaffRole(
        data.role as StaffRole
      );
    };

    verifyStaff();
  }, [session]);

  // =====================================
  // INITIAL LOADING
  // =====================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080808] text-white">
        <div className="text-center">
          <img
            src="/zertop-logo.png"
            alt="Zertop Limited"
            className="mx-auto h-14 w-auto object-contain"
          />

          <p className="mt-5 text-white/40">
            Loading Zertop Limited...
          </p>
        </div>
      </div>
    );
  }

  // =====================================
  // PUBLIC HOME
  // =====================================

  if (page === "home") {
    return (
      <Home
        onBrowseProperties={() =>
          setPage(
            "public-properties"
          )
        }
        onStaffLogin={() => {
          if (session) {
            setPage("dashboard");
          } else {
            setPage("login");
          }
        }}
        onViewProperty={(
          propertyId
        ) => {
          setSelectedPropertyId(
            propertyId
          );

          setPage(
            "property-details"
          );
        }}
        onAbout={() =>
          setPage("about")
        }
        onDevelopments={() =>
          setPage("developments")
        }
        onContact={() =>
          setPage("contact")
        }
      />
    );
  }

  // =====================================
  // PUBLIC ABOUT
  // =====================================

  if (page === "about") {
    return (
      <About
        onBack={() =>
          setPage("home")
        }
        onProperties={() =>
          setPage(
            "public-properties"
          )
        }
        onDevelopments={() =>
          setPage("developments")
        }
        onContact={() =>
          setPage("contact")
        }
      />
    );
  }

  // =====================================
  // PUBLIC DEVELOPMENTS
  // =====================================

  if (page === "developments") {
    return (
      <Developments
        onBack={() =>
          setPage("home")
        }
        onProperties={() =>
          setPage(
            "public-properties"
          )
        }
        onAbout={() =>
          setPage("about")
        }
        onContact={() =>
          setPage("contact")
        }
      />
    );
  }

  // =====================================
  // PUBLIC CONTACT
  // =====================================

  if (page === "contact") {
    return (
      <Contact
        onBack={() =>
          setPage("home")
        }
        onProperties={() =>
          setPage(
            "public-properties"
          )
        }
        onAbout={() =>
          setPage("about")
        }
        onDevelopments={() =>
          setPage(
            "developments"
          )
        }
      />
    );
  }

  // =====================================
  // PUBLIC PROPERTY DETAILS
  // =====================================

  if (
    page ===
      "property-details" &&
    selectedPropertyId
  ) {
    return (
      <PublicPropertyDetails
        propertyId={
          selectedPropertyId
        }
        onBack={() =>
          setPage(
            "public-properties"
          )
        }
      />
    );
  }

  // =====================================
  // PUBLIC PROPERTY CATALOGUE
  // =====================================

  if (
    page ===
    "public-properties"
  ) {
    return (
      <PublicProperties
        onBack={() =>
          setPage("home")
        }
        onViewProperty={(
          propertyId
        ) => {
          setSelectedPropertyId(
            propertyId
          );

          setPage(
            "property-details"
          );
        }}
      />
    );
  }

  // =====================================
  // STAFF LOGIN
  // =====================================

  if (
    page === "login" &&
    !session
  ) {
    return (
      <Auth
        onBrowseProperties={() =>
          setPage(
            "public-properties"
          )
        }
      />
    );
  }

  // =====================================
  // NOT LOGGED IN
  // =====================================

  if (!session) {
    return (
      <Home
        onBrowseProperties={() =>
          setPage(
            "public-properties"
          )
        }
        onStaffLogin={() =>
          setPage("login")
        }
        onViewProperty={(
          propertyId
        ) => {
          setSelectedPropertyId(
            propertyId
          );

          setPage(
            "property-details"
          );
        }}
        onAbout={() =>
          setPage("about")
        }
        onDevelopments={() =>
          setPage("developments")
        }
        onContact={() =>
          setPage("contact")
        }
      />
    );
  }

  // =====================================
  // VERIFYING STAFF
  // =====================================

  if (
    staffVerified === null
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080808] text-white">
        Verifying staff access...
      </div>
    );
  }

  // =====================================
  // UNAUTHORIZED ACCOUNT
  // =====================================

  if (
    staffVerified === false
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080808] px-6 text-white">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111111] p-8 text-center">
          <h1 className="text-2xl font-bold">
            Access Denied
          </h1>

          <p className="mt-3 text-white/45">
            This account is not
            authorized to access the
            Zertop staff dashboard.
          </p>

          <button
            type="button"
            onClick={async () => {
              await supabase.auth.signOut();

              setStaffVerified(null);
              setStaffRole(null);
              setPage("home");
            }}
            className="mt-6 w-full rounded-xl bg-gradient-to-r from-[#f59e0b] via-[#f97316] to-[#dc2626] px-6 py-3 font-semibold transition hover:brightness-110"
          >
            Return to Website
          </button>
        </div>
      </div>
    );
  }

  // =====================================
  // ADMIN / STAFF PAGES
  // =====================================

  if (page === "estates") {
    if (
      !canAccess("estates")
    ) {
      return renderPermissionDenied();
    }

    return (
      <Estates
        onBack={() =>
          setPage("dashboard")
        }
      />
    );
  }

  if (
    page === "properties"
  ) {
    if (
      !canAccess("properties")
    ) {
      return renderPermissionDenied();
    }

    return (
      <Properties
        onBack={() =>
          setPage("dashboard")
        }
      />
    );
  }

  if (
    page === "customers"
  ) {
    if (
      !canAccess("customers")
    ) {
      return renderPermissionDenied();
    }

    return (
      <Customers
        onBack={() =>
          setPage("dashboard")
        }
      />
    );
  }

  if (page === "leads") {
    if (!canAccess("leads")) {
      return renderPermissionDenied();
    }

    return (
      <Leads
        onBack={() =>
          setPage("dashboard")
        }
      />
    );
  }

  if (
    page === "inspections"
  ) {
    if (
      !canAccess("inspections")
    ) {
      return renderPermissionDenied();
    }

    return (
      <Inspections
        onBack={() =>
          setPage("dashboard")
        }
      />
    );
  }

  if (page === "sales") {
    if (!canAccess("sales")) {
      return renderPermissionDenied();
    }

    return (
      <Sales
        onBack={() =>
          setPage("dashboard")
        }
      />
    );
  }

  if (
    page === "payments"
  ) {
    if (
      !canAccess("payments")
    ) {
      return renderPermissionDenied();
    }

    return (
      <Payments
        onBack={() =>
          setPage("dashboard")
        }
      />
    );
  }

  if (page === "staff") {
    if (!canAccess("staff")) {
      return renderPermissionDenied();
    }

    return (
      <Staff
        onBack={() =>
          setPage("dashboard")
        }
      />
    );
  }

  // =====================================
  // DASHBOARD
  // =====================================

  if (
    !canAccess("dashboard")
  ) {
    return renderPermissionDenied();
  }

  return (
    <Dashboard
      staffRole={staffRole}
      onEstates={() =>
        setPage("estates")
      }
      onProperties={() =>
        setPage("properties")
      }
      onCustomers={() =>
        setPage("customers")
      }
      onLeads={() =>
        setPage("leads")
      }
      onInspections={() =>
        setPage("inspections")
      }
      onSales={() =>
        setPage("sales")
      }
      onPayments={() =>
        setPage("payments")
      }
      onStaff={() =>
        setPage("staff")
      }
    />
  );
}

export default App;