import Link from "next/link";
import { Gamepad2, Twitter, Facebook, Instagram, Youtube, Github, Mail } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const footerLinks = {
  "Quick Links": [
    { label: "Home", href: "/" },
    { label: "Store", href: "/store" },
    { label: "Deals", href: "/deals" },
    { label: "Categories", href: "/categories" },
  ],
  "Support": [
    { label: "Help Center", href: "/help" },
    { label: "Refund Policy", href: "/refunds" },
    { label: "Contact Us", href: "/contact" },
    { label: "FAQ", href: "/faq" },
  ],
  "Company": [
    { label: "About Us", href: "/about" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Careers", href: "/careers" },
  ],
};

const socialLinks = [
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
  { icon: Github, href: "https://github.com", label: "GitHub" },
];

export default function Footer() {
  return (
    <footer className="bg-[#060a10] border-t border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div className="relative">
                <Gamepad2 className="w-7 h-7 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                <span className="text-white">Steam</span>
                <span className="text-cyan-400"> Rush</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
              Your ultimate destination for digital gaming. Discover, buy, and
              play the best Steam games at unbeatable prices.
            </p>

            {/* Newsletter */}
            <div className="flex gap-2 mt-4">
              <div className="flex-1 relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  placeholder="Your email for deals..."
                  className="w-full pl-9 pr-3 py-2 text-sm bg-[#0d1117] border border-slate-700 rounded-lg text-slate-300 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
              <button className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black text-sm font-semibold rounded-lg transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:text-cyan-400 hover:bg-slate-700 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="space-y-4">
              <h4 className="text-sm font-semibold text-white tracking-wide uppercase">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-slate-400 hover:text-cyan-400 transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8 bg-slate-800/60" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} Steam Rush. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              All systems operational
            </span>
            <span>|</span>
            <span>Secure Payments</span>
            <span>|</span>
            <span>Instant Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
