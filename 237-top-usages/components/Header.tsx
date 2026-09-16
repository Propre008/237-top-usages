"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { href: "/calculateur-forfait-data", label: "Calculateur Data 🚀", isFeatured: true },
  { href: "/categorie/top-usages", label: "Top Usages" },
  { href: "/categorie/problemes-solutions", label: "Problèmes & Solutions" },
  { href: "/categorie/tendances", label: "Tendances" },
  { href: "/categorie/actualites", label: "Actualités" },
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-surface-200/60 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-brand-600 text-white font-display font-bold text-sm shadow-md group-hover:bg-brand-700 transition-colors">
              237
            </span>
            <span className="font-display font-bold text-lg text-surface-900 group-hover:text-brand-700 transition-colors">
              Top Usages
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  link.isFeatured
                    ? "text-brand-800 font-bold bg-brand-50 border border-brand-200/60 hover:bg-brand-100"
                    : "text-surface-700 hover:text-brand-700 hover:bg-brand-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-surface-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            <svg
              className="w-6 h-6 text-surface-700"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <nav className="md:hidden pb-4 mobile-menu-enter">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    link.isFeatured
                      ? "text-brand-800 font-bold bg-brand-50 border border-brand-200/60"
                      : "text-surface-700 hover:text-brand-700 hover:bg-brand-50"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
