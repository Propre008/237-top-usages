"use client";

import Link from "next/link";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";

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
    <header className="sticky top-0 z-50 bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl border-b border-gray-200/70 dark:border-slate-800 shadow-sm transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-600 text-white font-display font-bold text-sm shadow-md group-hover:bg-emerald-700 transition-colors">
              237
            </span>
            <span className="font-display font-bold text-lg text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              Top Usages
            </span>
          </Link>

          {/* Desktop Nav + ThemeToggle */}
          <div className="hidden md:flex items-center gap-2">
            <nav className="flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-link px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    link.isFeatured
                      ? "text-emerald-800 dark:text-emerald-300 font-bold bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60"
                      : "text-gray-700 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-900"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="pl-2 border-l border-gray-200 dark:border-slate-800">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Actions (ThemeToggle + Burger) */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              <svg
                className="w-6 h-6"
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
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <nav className="md:hidden pb-4 mobile-menu-enter border-t border-gray-100 dark:border-slate-800/80 pt-2">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    link.isFeatured
                      ? "text-emerald-800 dark:text-emerald-300 font-bold bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60"
                      : "text-gray-700 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-900"
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
