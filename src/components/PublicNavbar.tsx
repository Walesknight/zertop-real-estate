import { useState } from "react";
import { Menu, X } from "lucide-react";

export type PublicNavigationProps = {
  onHome: () => void;
  onProperties: () => void;
  onDevelopments: () => void;
  onWhyZertop: () => void;
  onAbout: () => void;
  onContact: () => void;
  onStaffLogin: () => void;
};

export default function PublicNavbar({
  onHome,
  onProperties,
  onDevelopments,
  onWhyZertop,
  onAbout,
  onContact,
  onStaffLogin,
}: PublicNavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const runMobileAction = (
    action: () => void
  ) => {
    setMobileMenuOpen(false);
    action();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 md:px-6">
        {/* LOGO */}
        <button
          type="button"
          onClick={onHome}
          className="flex items-center"
        >
          <img
            src="/zertop-logo.png"
            alt="Zertop Limited"
            className="h-12 w-auto object-contain md:h-14"
          />
        </button>

        {/* DESKTOP NAV */}
        <nav className="hidden items-center gap-7 lg:flex">
          <button
            type="button"
            onClick={onHome}
            className="text-sm font-semibold text-[#0b1b35] transition hover:text-[#f97316]"
          >
            Home
          </button>

          <button
            type="button"
            onClick={onProperties}
            className="text-sm font-medium text-gray-600 transition hover:text-[#f97316]"
          >
            Properties
          </button>

          <button
            type="button"
            onClick={onDevelopments}
            className="text-sm font-medium text-gray-600 transition hover:text-[#f97316]"
          >
            Developments
          </button>

          <button
            type="button"
            onClick={onWhyZertop}
            className="text-sm font-medium text-gray-600 transition hover:text-[#f97316]"
          >
            Why Zertop
          </button>

          <button
            type="button"
            onClick={onAbout}
            className="text-sm font-medium text-gray-600 transition hover:text-[#f97316]"
          >
            About
          </button>

          <button
            type="button"
            onClick={onContact}
            className="text-sm font-medium text-gray-600 transition hover:text-[#f97316]"
          >
            Contact
          </button>

          <button
            type="button"
            onClick={onStaffLogin}
            className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-semibold text-[#0b1b35] transition hover:border-[#f59e0b]/50 hover:bg-orange-50"
          >
            Staff Login
          </button>
        </nav>

        {/* MOBILE BUTTON */}
        <button
          type="button"
          onClick={() =>
            setMobileMenuOpen(
              (current) => !current
            )
          }
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-[#0b1b35] lg:hidden"
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? (
            <X size={20} />
          ) : (
            <Menu size={20} />
          )}
        </button>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="border-t border-gray-200 bg-white px-5 py-5 shadow-lg lg:hidden">
          <div className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() =>
                runMobileAction(onHome)
              }
              className="rounded-xl px-4 py-3 text-left text-sm font-semibold text-[#0b1b35] hover:bg-orange-50"
            >
              Home
            </button>

            <button
              type="button"
              onClick={() =>
                runMobileAction(
                  onProperties
                )
              }
              className="rounded-xl px-4 py-3 text-left text-sm font-medium text-gray-600 hover:bg-orange-50 hover:text-[#f97316]"
            >
              Properties
            </button>

            <button
              type="button"
              onClick={() =>
                runMobileAction(
                  onDevelopments
                )
              }
              className="rounded-xl px-4 py-3 text-left text-sm font-medium text-gray-600 hover:bg-orange-50 hover:text-[#f97316]"
            >
              Developments
            </button>

            <button
              type="button"
              onClick={() =>
                runMobileAction(
                  onWhyZertop
                )
              }
              className="rounded-xl px-4 py-3 text-left text-sm font-medium text-gray-600 hover:bg-orange-50 hover:text-[#f97316]"
            >
              Why Zertop
            </button>

            <button
              type="button"
              onClick={() =>
                runMobileAction(onAbout)
              }
              className="rounded-xl px-4 py-3 text-left text-sm font-medium text-gray-600 hover:bg-orange-50 hover:text-[#f97316]"
            >
              About
            </button>

            <button
              type="button"
              onClick={() =>
                runMobileAction(onContact)
              }
              className="rounded-xl px-4 py-3 text-left text-sm font-medium text-gray-600 hover:bg-orange-50 hover:text-[#f97316]"
            >
              Contact
            </button>

            <button
              type="button"
              onClick={() =>
                runMobileAction(
                  onStaffLogin
                )
              }
              className="mt-3 rounded-xl bg-[#0b1b35] px-4 py-3 text-left text-sm font-semibold text-white"
            >
              Staff Login
            </button>
          </div>
        </div>
      )}
    </header>
  );
}