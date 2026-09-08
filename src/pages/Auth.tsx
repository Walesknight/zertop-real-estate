import { useState } from "react";
import { supabase } from "../lib/supabase";

type AuthProps = {
  onBrowseProperties: () => void;
};

export default function Auth({
  onBrowseProperties,
}: AuthProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      // App.tsx will detect the authenticated session
      // and open the staff dashboard automatically.
    } catch (error) {
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
    <div className="min-h-screen bg-slate-950 lg:grid lg:grid-cols-2">
      {/* BRAND SIDE */}
      <div className="relative hidden min-h-screen overflow-hidden lg:block">
        <img
          src="/zertop-logo.jpeg"
          alt="Zertop Limited"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute bottom-10 left-10 right-10 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-300">
            Zertop Limited
          </p>

          <h1 className="mt-3 max-w-xl text-4xl font-bold leading-tight">
            Real Estate Management System
          </h1>

          <p className="mt-4 max-w-lg text-slate-200">
            Secure staff access for managing properties, customers,
            leads, inspections, sales and payments.
          </p>
        </div>
      </div>

      {/* LOGIN SIDE */}
      <div className="flex min-h-screen items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
              Zertop Limited
            </p>

            <h2 className="mt-3 text-3xl font-bold text-white">
              Staff Login
            </h2>

            <p className="mt-2 text-slate-400">
              Sign in with your authorized staff account to access the
              Zertop management dashboard.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="staff@zertop.com"
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-orange-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="current-password"
                placeholder="Enter your password"
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-orange-500"
              />
            </div>

            {message && (
              <div className="rounded-xl border border-red-900/70 bg-red-950/30 p-3 text-sm text-red-300">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-orange-500 px-4 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 border-t border-slate-800 pt-6">
            <p className="mb-3 text-center text-sm text-slate-500">
              Looking for a property?
            </p>

            <button
              type="button"
              onClick={onBrowseProperties}
              className="w-full rounded-xl border border-slate-700 px-4 py-3 font-semibold text-slate-300 transition hover:bg-slate-900 hover:text-white"
            >
              Browse Available Properties
            </button>
          </div>

          <p className="mt-6 text-center text-xs text-slate-600">
            Staff accounts are managed internally by Zertop Limited.
          </p>
        </div>
      </div>
    </div>
  );
}