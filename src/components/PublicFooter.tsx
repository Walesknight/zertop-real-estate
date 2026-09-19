import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
} from "react-icons/fa6";

type PublicFooterProps = {
  onHome: () => void;
  onProperties: () => void;
  onDevelopments: () => void;
  onWhyZertop: () => void;
  onAbout: () => void;
  onContact: () => void;
};

export default function PublicFooter({
  onHome,
  onProperties,
  onDevelopments,
  onWhyZertop,
  onAbout,
  onContact,
}: PublicFooterProps) {
  return (
    <footer className="border-t border-gray-200 bg-[#f8fafc]">
      <div className="mx-auto max-w-7xl px-5 py-14 md:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.9fr_1.2fr]">
          {/* BRAND */}
          <div>
            <img
              src="/zertop-logo.png"
              alt="Zertop Limited"
              className="h-14 w-auto object-contain"
            />

            <p className="mt-5 max-w-sm text-sm leading-7 text-gray-500">
              Zertop Limited is a real estate and
              property development company creating
              opportunities around property ownership,
              investment and long-term value.
            </p>

            {/* SOCIAL MEDIA */}
            <div className="mt-5 flex items-center gap-3">
              <a
                href="https://instagram.com/zertop.real.estate"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Zertop Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition hover:border-orange-200 hover:bg-orange-50 hover:text-[#f97316]"
              >
                <FaInstagram size={18} />
              </a>

              <a
                href="https://facebook.com/realzertop"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Zertop Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition hover:border-orange-200 hover:bg-orange-50 hover:text-[#f97316]"
              >
                <FaFacebookF size={17} />
              </a>

              <a
                href="https://tiktok.com/@zertopreal.estate"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Zertop TikTok"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition hover:border-orange-200 hover:bg-orange-50 hover:text-[#f97316]"
              >
                <FaTiktok size={17} />
              </a>
            </div>

            <button
              type="button"
              onClick={onProperties}
              className="mt-6 rounded-xl bg-gradient-to-r from-[#f5a400] via-[#f97316] to-[#ef233c] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5"
            >
              Browse Properties
            </button>
          </div>

          {/* QUICK LINKS */}
          <div>
            <p className="text-sm font-black uppercase tracking-[0.15em] text-[#0b1b35]">
              Quick Links
            </p>

            <div className="mt-5 flex flex-col items-start gap-3">
              <button
                type="button"
                onClick={onHome}
                className="text-sm text-gray-500 transition hover:text-[#f97316]"
              >
                Home
              </button>

              <button
                type="button"
                onClick={onProperties}
                className="text-sm text-gray-500 transition hover:text-[#f97316]"
              >
                Properties
              </button>

              <button
                type="button"
                onClick={onDevelopments}
                className="text-sm text-gray-500 transition hover:text-[#f97316]"
              >
                Developments
              </button>

              <button
                type="button"
                onClick={onWhyZertop}
                className="text-sm text-gray-500 transition hover:text-[#f97316]"
              >
                Why Zertop
              </button>

              <button
                type="button"
                onClick={onAbout}
                className="text-sm text-gray-500 transition hover:text-[#f97316]"
              >
                About Us
              </button>

              <button
                type="button"
                onClick={onContact}
                className="text-sm text-gray-500 transition hover:text-[#f97316]"
              >
                Contact
              </button>
            </div>
          </div>

          {/* CONTACT */}
          <div>
            <p className="text-sm font-black uppercase tracking-[0.15em] text-[#0b1b35]">
              Contact
            </p>

            <div className="mt-5 space-y-3 text-sm leading-6 text-gray-500">
              <div>
                <a
                  href="tel:+2348135420099"
                  className="transition hover:text-[#f97316]"
                >
                  0813 542 0099
                </a>
              </div>

              <div>
                <a
                  href="tel:+2349042509860"
                  className="transition hover:text-[#f97316]"
                >
                  0904 250 9860
                </a>
              </div>

              <div className="pt-1">
                <a
                  href="mailto:admin@zertoplimited.com"
                  className="break-all transition hover:text-[#f97316]"
                >
                  admin@zertoplimited.com
                </a>
              </div>
            </div>
          </div>

          {/* OFFICE */}
          <div>
            <p className="text-sm font-black uppercase tracking-[0.15em] text-[#0b1b35]">
              Head Office
            </p>

            <p className="mt-5 text-sm leading-7 text-gray-500">
              Suite 35 Awoyaya Shopping Plaza Opposite
              Sunbet Filling Station Awoyaya Bus Stop
              Lekki-Epe Expressway, Lagos, Nigeria.
            </p>

            <a
              href="https://www.zertoplimited.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-sm font-bold text-[#f97316] transition hover:text-[#ef233c]"
            >
              www.zertoplimited.com
            </a>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="mt-12 flex flex-col gap-4 border-t border-gray-200 pt-6 text-sm text-gray-400 md:flex-row md:items-center md:justify-between">
          <p>
            © 2026 Zertop Limited. All rights reserved.
          </p>

          <p>
            Real Estate & Property Development
          </p>
        </div>
      </div>
    </footer>
  );
}