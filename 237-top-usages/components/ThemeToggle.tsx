"use client";

import { useEffect } from "react";

export default function ThemeToggle() {
  useEffect(() => {
    // 1. Synchronisation multi-onglets : si l'utilisateur change de thème dans un autre onglet
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "theme") {
        if (e.newValue === "dark") {
          document.documentElement.classList.add("dark");
        } else if (e.newValue === "light") {
          document.documentElement.classList.remove("dark");
        }
      }
    };

    // 2. Synchronisation automatique avec l'OS si l'utilisateur n'a pas verrouillé un choix manuel
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleMediaChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem("theme")) {
        if (e.matches) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    mediaQuery.addEventListener("change", handleMediaChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      mediaQuery.removeEventListener("change", handleMediaChange);
    };
  }, []);

  // Déclenchement d'un micro-son feutré (Web Audio API sans téléchargement externe)
  const playMicroClick = (toDark: boolean) => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      const startFreq = toDark ? 520 : 380;
      const endFreq = toDark ? 360 : 540;

      osc.frequency.setValueAtTime(startFreq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + 0.035);

      // Volume très discret et court (effet micro-interrupteur soyeux)
      gain.gain.setValueAtTime(0.035, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.035);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.04);

      // Libérer le contexte audio après la fin de l'oscillateur
      osc.onended = () => ctx.close().catch(() => {});
    } catch {
      // Silencieux si l'audio est bloqué
    }
  };

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains("dark");
    const nextDark = !isDark;

    // Retour haptique doux sur mobile (10ms)
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(10);
      } catch {
        // Ignorer si non supporté
      }
    }

    // Micro-son ultra-subtil
    playMicroClick(nextDark);

    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="relative p-2 rounded-xl border border-gray-200/90 dark:border-slate-800 bg-gray-50/90 hover:bg-gray-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-200 transition-all duration-200 shadow-sm flex items-center justify-center cursor-pointer active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
      aria-label="Basculer entre le mode clair et le mode sombre"
      title="Basculer le thème (Mode clair / Mode sombre)"
    >
      {/* Icône Soleil : Visible en mode sombre via CSS pur (dark:block), cachée en mode clair */}
      <svg
        className="w-4 h-4 text-amber-400 hidden dark:block transition-transform duration-300 hover:rotate-45"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
        />
      </svg>

      {/* Icône Lune : Visible en mode clair via CSS pur (block dark:hidden), cachée en mode sombre */}
      <svg
        className="w-4 h-4 text-slate-700 block dark:hidden transition-transform duration-300 hover:-rotate-12"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
        />
      </svg>
    </button>
  );
}
