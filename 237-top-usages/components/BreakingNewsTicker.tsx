"use client";

import { useEffect, useState } from "react";

interface NewsItem {
  title: string;
  source: string;
  url: string;
  timeAgo: string;
  category: string;
  imageUrl?: string;
}

export default function BreakingNewsTicker() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNews() {
      try {
        const res = await fetch("/api/breaking-news");
        if (res.ok) {
          const data = await res.json();
          if (data.news && data.news.length > 0) {
            setNews(data.news);
          }
        }
      } catch {
        // En cas d'erreur de réseau, maintien silencieux
      } finally {
        setLoading(false);
      }
    }
    loadNews();
  }, []);

  // Défilement automatique toutes les 6 secondes
  useEffect(() => {
    if (news.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % news.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [news.length]);

  if (loading && news.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div className="h-11 rounded-xl bg-gray-100 dark:bg-slate-900 animate-pulse" />
      </div>
    );
  }

  if (news.length === 0) return null;

  const current = news[currentIndex];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
      <div className="relative flex items-center justify-between gap-3 px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-500/10 via-amber-500/5 to-transparent dark:from-red-950/40 dark:via-slate-900/40 border border-red-500/20 dark:border-red-900/30 backdrop-blur-sm">
        {/* Badge "EN DIRECT" façon MSN */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600" />
          </span>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-red-700 dark:text-red-400 hidden sm:inline">
            Flash 237 & Afrique
          </span>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-700 dark:text-red-400 sm:hidden">
            Flash
          </span>
        </div>

        {/* Contenu de la dépêche en direct */}
        <div className="flex-1 min-w-0 flex items-center gap-2 text-xs sm:text-sm">
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-200/80 dark:bg-slate-800 text-gray-700 dark:text-gray-300 shrink-0 hidden md:inline">
            {current.category}
          </span>
          <a
            href={current.url}
            target={current.url.startsWith("http") ? "_blank" : "_self"}
            rel="noopener noreferrer"
            className="font-medium text-gray-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors truncate"
            title={current.title}
          >
            {current.title}
          </a>
          <span className="text-[11px] text-gray-400 dark:text-gray-500 shrink-0 hidden sm:inline">
            • {current.source} ({current.timeAgo})
          </span>
        </div>

        {/* Contrôles Suivant / Précédent */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setCurrentIndex((prev) => (prev - 1 + news.length) % news.length)}
            className="p-1 rounded hover:bg-gray-200/60 dark:hover:bg-slate-800 text-gray-500 dark:text-gray-400 transition-colors"
            aria-label="Précédent"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <span className="text-[10px] font-mono text-gray-400 dark:text-gray-500">
            {currentIndex + 1}/{news.length}
          </span>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % news.length)}
            className="p-1 rounded hover:bg-gray-200/60 dark:hover:bg-slate-800 text-gray-500 dark:text-gray-400 transition-colors"
            aria-label="Suivant"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
