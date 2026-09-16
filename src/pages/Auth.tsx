import { useState } from "react";

import {
  ArrowRight,
  Building2,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import { supabase } from "../lib/supabase";

type AuthProps = {
  onBrowseProperties: () => void;
};

export default function Auth({
  onBrowseProperties,
}: AuthProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const { error } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (error) {
        throw error;
      }

      // App.tsx detects the authenticated session
      // and opens the dashboard automatically.
    } catch (error) {
      console.error("Staff login error:", error);

      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage("Unable to sign in.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] lg:grid lg:grid-cols-[1.05fr_0.95fr]">
      {/* =================================
          BRAND SIDE
      ================================== */}
      <section className="relative hidden min-h-screen overflow-hidden bg-[#fffaf5] lg:flex lg:flex-col lg:justify-between">
        {/* BACKGROUND DECORATION */}
        <div className="pointer-events-none absolute -left-28 -top-28 h-96 w-96 rounded-full bg-yellow-100/80 blur-[90px]" />

        <div className="pointer-events-none absolute -bottom-32 -right-24 h-[420px] w-[420px] rounded-full bg-red-100/70 blur-[110px]" />

        <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-[#f5a400] via-[#f97316] to-[#ef233c]" />

        {/* TOP */}
        <div className="relative z-10 p-10 xl:p-14">
          <img
            src="/zertop-logo.png"
            alt="Zertop Limited"
            className="h-16 w-auto object-contain"
          />
        </div>

        {/* MAIN CONTENT */}
        <div className="relative z-10 px-10 pb-14 xl:px-14 xl:pb-16">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-[#f97316] shadow-sm">
              <ShieldCheck size={17} />
              Authorized staff access
            </div>

            <h1 className="mt-7 text-4xl font-black leading-tight text-[#0b1b35] xl:text-5xl">
              Manage Zertop operations from one secure workspace.
            </h1>

            <p className="mt-5 max-w-lg text-base leading-8 text-gray-600">
              Access properties, customers, leads,
              inspections, sales, payments and staff
              operations from the Zertop management
              dashboard.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <FeatureCard
                icon={<Building2 size={23} />}
                title="Property Management"
                text="Manage estates, properties and available listings."
              />

              <FeatureCard
                icon={<LockKeyhole size={23} />}
                title="Secure Access"
                text="Authorized accounts with role-based access."
              />
            </div>
          </div>
        </div>
      </section>

      {/* =================================
          LOGIN SIDE
      ================================== */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-5 py-12 sm:px-8">
        {/* MOBILE DECORATION */}
        <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-orange-50 blur-[90px]" />

        <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-red-50 blur-[90px]" />

        <div className="relative z-10 w-full max-w-md">
          {/* MOBILE LOGO */}
          <div className="mb-10 lg:hidden">
            <img
              src="/zertop-logo.png"
              alt="Zertop Limited"
              className="h-14 w-auto object-contain"
            />
          </div>

          {/* TITLE */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#f97316]">
              Zertop Management
            </p>

            <h2 className="mt-3 text-3xl font-black text-[#0b1b35] sm:text-4xl">
              Staff Login
            </h2>

            <p className="mt-3 leading-7 text-gray-500">
              Sign in with your authorized Zertop staff
              account to continue.
            </p>
          </div>

          {/* LOGIN CARD */}
          <div className="mt-8 rounded-[28px] border border-gray-200 bg-white p-6 shadow-[0_25px_70px_rgba(15,23,42,0.08)] sm:p-8">
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* EMAIL */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Email Address
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                  autoComplete="email"
                  placeholder="staff@zertoplimited.com"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-[#0b1b35] outline-none transition placeholder:text-gray-400 focus:border-[#f97316] focus:bg-white focus:ring-2 focus:ring-orange-100"
                />
              </div>

              {/* PASSWORD */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    required
                    minLength={6}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 pr-12 text-sm text-[#0b1b35] outline-none transition placeholder:text-gray-400 focus:border-[#f97316] focus:bg-white focus:ring-2 focus:ring-orange-100"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (current) => !current
                      )
                    }
                    className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-[#0b1b35]"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
              </div>

              {/* ERROR */}
              {message && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700">
                  {message}
                </div>
              )}

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f5a400] via-[#f97316] to-[#ef233c] px-4 py-3.5 font-bold text-white shadow-lg shadow-orange-100 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Signing in..."
                  : "Sign In"}

                {!loading && (
                  <ArrowRight size={18} />
                )}
              </button>
            </form>

            {/* PUBLIC SITE */}
            <div className="mt-7 border-t border-gray-100 pt-6">
              <p className="mb-3 text-center text-sm text-gray-400">
                Looking for a property?
              </p>

              <button
                type="button"
                onClick={onBrowseProperties}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 font-semibold text-[#0b1b35] transition hover:border-orange-200 hover:bg-orange-50"
              >
                Browse Available Properties
              </button>
            </div>
          </div>

          {/* SECURITY NOTE */}
          <div className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-gray-400">
            <ShieldCheck size={15} />

            <span>
              Staff accounts are managed internally by
              Zertop Limited.
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}

type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  text: string;
};

function FeatureCard({
  icon,
  title,
  text,
}: FeatureCardProps) {
  return (
    <div className="rounded-2xl border border-orange-100 bg-white/80 p-5 shadow-sm backdrop-blur">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-[#f97316]">
        {icon}
      </div>

      <h3 className="mt-4 font-bold text-[#0b1b35]">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-gray-500">
        {text}
      </p>
    </div>
  );
}