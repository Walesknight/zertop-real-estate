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
  | "realtor"
  | "staff";

const isStaffRole = (
  role: unknown
): role is StaffRole => {
  return (
    role === "admin" ||
    role === "manager" ||
    role === "realtor" ||
    role === "staff"
  );
};

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
  // PUBLIC NAVIGATION
  // =====================================

  const clearPublicHash = () => {
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${window.location.search}`
    );
  };

  const goToPublicPage = (
    targetPage: Page
  ) => {
    clearPublicHash();
    setPage(targetPage);

    window.setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 0);
  };

  const goToWhyZertop = () => {
    setPage("home");

    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${window.location.search}#why-zertop`
    );

    window.setTimeout(() => {
      document
        .getElementById(
          "why-zertop"
        )
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 50);
  };

  const goToStaffLogin = () => {
    clearPublicHash();

    if (session) {
      setPage("dashboard");
    } else {
      setPage("login");
    }
  };

  const publicNavigation = {
    onHome: () =>
      goToPublicPage("home"),

    onProperties: () =>
      goToPublicPage(
        "public-properties"
      ),

    onDevelopments: () =>
      goToPublicPage(
        "developments"
      ),

    onWhyZertop:
      goToWhyZertop,

    onAbout: () =>
      goToPublicPage("about"),

    onContact: () =>
      goToPublicPage("contact"),

    onStaffLogin:
      goToStaffLogin,
  };

  // =====================================
  // PERMISSIONS
  // =====================================

  const canAccess = (
    targetPage: Page
  ) => {
    if (!staffRole) {
      return false;
    }

    // ADMIN
    if (staffRole === "admin") {
      return [
        "dashboard",
        "estates",
        "properties",
        "customers",
        "leads",
        "inspections",
        "sales",
        "payments",
        "staff",
      ].includes(targetPage);
    }

    // MANAGER
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

    // REALTOR
    if (staffRole === "realtor") {
      return [
        "dashboard",
        "customers",
        "leads",
        "inspections",
      ].includes(targetPage);
    }

    // STAFF
    if (staffRole === "staff") {
      return [
        "dashboard",
        "customers",
        "leads",
      ].includes(targetPage);
    }

    return false;
  };

  // =====================================
  // PERMISSION DENIED SCREEN
  // =====================================

  const renderPermissionDenied = () => {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] px-6">
        <div className="w-full max-w-md rounded-[28px] border border-gray-200 bg-white p-8 text-center shadow-xl">
          <img
            src="/zertop-logo.png"
            alt="Zertop Limited"
            className="mx-auto h-14 w-auto object-contain"
          />

          <div className="mx-auto mt-7 h-1 w-20 rounded-full bg-gradient-to-r from-[#f5a400] via-[#f97316] to-[#ef233c]" />

          <h1 className="mt-6 text-2xl font-black text-[#0b1b35]">
            Permission Denied
          </h1>

          <p className="mt-3 leading-7 text-gray-500">
            Your staff role does not have permission
            to access this section.
          </p>

          <button
            type="button"
            onClick={() =>
              setPage("dashboard")
            }
            className="mt-7 w-full rounded-xl bg-gradient-to-r from-[#f5a400] via-[#f97316] to-[#ef233c] px-6 py-3.5 font-bold text-white shadow-lg shadow-orange-100 transition hover:-translate-y-0.5"
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
            setPage("home");
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
          .select(
            "id,active,role,company_id"
          )
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

      if (!data.company_id) {
        console.error(
          "Staff account is not linked to a company."
        );

        setStaffVerified(false);
        setStaffRole(null);

        return;
      }

      if (!isStaffRole(data.role)) {
        console.error(
          "Invalid staff role:",
          data.role
        );

        setStaffVerified(false);
        setStaffRole(null);

        return;
      }

      setStaffRole(data.role);
      setStaffVerified(true);
    };

    verifyStaff();
  }, [session]);

  // =====================================
  // INITIAL LOADING
  // =====================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc]">
        <div className="text-center">
          <img
            src="/zertop-logo.png"
            alt="Zertop Limited"
            className="mx-auto h-16 w-auto object-contain"
          />

          <p className="mt-5 text-sm text-gray-500">
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
        {...publicNavigation}
        onViewProperty={(
          propertyId
        ) => {
          setSelectedPropertyId(
            propertyId
          );

          goToPublicPage(
            "property-details"
          );
        }}
      />
    );
  }

  // =====================================
  // PUBLIC ABOUT
  // =====================================

  if (page === "about") {
    return (
      <About
        {...publicNavigation}
      />
    );
  }

  // =====================================
  // PUBLIC DEVELOPMENTS
  // =====================================

  if (
    page === "developments"
  ) {
    return (
      <Developments
        {...publicNavigation}
      />
    );
  }

  // =====================================
  // PUBLIC CONTACT
  // =====================================

  if (page === "contact") {
    return (
      <Contact
        {...publicNavigation}
      />
    );
  }

  // =====================================
  // PUBLIC PROPERTY DETAILS
  // =====================================
  if (
    page === "property-details" &&
    selectedPropertyId
  ) {
    return (
      <PublicPropertyDetails
        {...publicNavigation}
        propertyId={selectedPropertyId}
        onBack={() =>
          goToPublicPage(
            "public-properties"
          )
        }
      />
    );
  }

  // =====================================
  // PUBLIC PROPERTIES
  // =====================================

  if (
    page ===
    "public-properties"
  ) {
    return (
      <PublicProperties
        {...publicNavigation}
        onViewProperty={(
          propertyId
        ) => {
          setSelectedPropertyId(
            propertyId
          );

          goToPublicPage(
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
          goToPublicPage(
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
        {...publicNavigation}
        onViewProperty={(
          propertyId
        ) => {
          setSelectedPropertyId(
            propertyId
          );

          goToPublicPage(
            "property-details"
          );
        }}
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
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] px-6">
        <div className="text-center">
          <img
            src="/zertop-logo.png"
            alt="Zertop Limited"
            className="mx-auto h-14 w-auto object-contain"
          />

          <p className="mt-5 text-sm font-medium text-gray-500">
            Verifying staff access...
          </p>
        </div>
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
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] px-6">
        <div className="w-full max-w-md rounded-[28px] border border-gray-200 bg-white p-8 text-center shadow-xl">
          <img
            src="/zertop-logo.png"
            alt="Zertop Limited"
            className="mx-auto h-14 w-auto object-contain"
          />

          <h1 className="mt-7 text-2xl font-black text-[#0b1b35]">
            Access Denied
          </h1>

          <p className="mt-3 leading-7 text-gray-500">
            This account is not authorized
            to access the Zertop management
            dashboard.
          </p>

          <button
            type="button"
            onClick={async () => {
              await supabase.auth.signOut();

              setStaffVerified(null);
              setStaffRole(null);
              clearPublicHash();
              setPage("home");
            }}
            className="mt-7 w-full rounded-xl bg-gradient-to-r from-[#f5a400] via-[#f97316] to-[#ef233c] px-6 py-3.5 font-bold text-white"
          >
            Return to Website
          </button>
        </div>
      </div>
    );
  }

  // =====================================
  // ESTATES
  // ADMIN + MANAGER ONLY
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

  // =====================================
  // PROPERTIES
  // ADMIN + MANAGER ONLY
  // =====================================

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

  // =====================================
  // CUSTOMERS
  // =====================================

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

  // =====================================
  // LEADS
  // =====================================

  if (page === "leads") {
    if (
      !canAccess("leads")
    ) {
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

  // =====================================
  // INSPECTIONS
  // =====================================

  if (
    page === "inspections"
  ) {
    if (
      !canAccess(
        "inspections"
      )
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

  // =====================================
  // SALES
  // ADMIN + MANAGER ONLY
  // =====================================

  if (page === "sales") {
    if (
      !canAccess("sales")
    ) {
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

  // =====================================
  // PAYMENTS
  // ADMIN + MANAGER ONLY
  // =====================================

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

  // =====================================
  // STAFF MANAGEMENT
  // ADMIN ONLY
  // =====================================

  if (page === "staff") {
    if (
      !canAccess("staff")
    ) {
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