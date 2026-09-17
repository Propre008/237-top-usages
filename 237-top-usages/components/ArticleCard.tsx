import React from "react";
import Link from "next/link";

export interface ArticleCardProps {
  post?: {
    slug: string;
    title: string;
    date: string;
    category: string;
    excerpt?: string;
    coverImage?: string;
    cover_image?: string;
    sourceName?: string;
    source_name?: string;
    sourceUrl?: string;
    source_url?: string;
  };
  slug?: string;
  title?: string;
  date?: string;
  category?: string;
  excerpt?: string;
  coverImage?: string;
  cover_image?: string;
  sourceName?: string;
  source_name?: string;
  sourceUrl?: string;
  source_url?: string;
}

const CATEGORY_STYLES: Record<string, { badge: string; label: string }> = {
  sport: { badge: "bg-emerald-50 text-emerald-700 border-emerald-200", label: "Sport" },
  football: { badge: "bg-emerald-50 text-emerald-700 border-emerald-200", label: "Football" },
  tech: { badge: "bg-blue-50 text-blue-700 border-blue-200", label: "Tech" },
  business: { badge: "bg-purple-50 text-purple-700 border-purple-200", label: "Business" },
  energie: { badge: "bg-amber-50 text-amber-700 border-amber-200", label: "Énergie" },
  "top-usages": { badge: "bg-emerald-50 text-emerald-700 border-emerald-200", label: "Top Usages" },
  "problemes-solutions": { badge: "bg-amber-50 text-amber-700 border-amber-200", label: "Problèmes & Solutions" },
  tendances: { badge: "bg-sky-50 text-sky-700 border-sky-200", label: "Tendances" },
  actualites: { badge: "bg-slate-50 text-slate-700 border-slate-200", label: "Actualités" },
};

export default function ArticleCard(props: ArticleCardProps) {
  const item = props.post || props;
  const categoryKey = item.category?.toLowerCase() || "actualites";
  const catStyle = CATEGORY_STYLES[categoryKey] || CATEGORY_STYLES.actualites;
  const catLabel = catStyle.label || item.category || "Actualités";

  const imageSrc =
    item.coverImage ||
    item.cover_image ||
    (categoryKey === "sport" || categoryKey === "football"
      ? "/images/defaults/sport.jpg"
      : categoryKey === "tech" || categoryKey === "top-usages"
      ? "/images/defaults/tech.jpg"
      : categoryKey === "business" || categoryKey === "tendances"
      ? "/images/defaults/business.jpg"
      : categoryKey === "energie" || categoryKey === "problemes-solutions"
      ? "/images/defaults/energie.jpg"
      : "/images/defaults/actualites.jpg");

  const sourceName = item.sourceName || item.source_name || "237 Top Usages";

  return (
    <article className="group bg-white rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between">
      {/* Image de couverture avec ratio 16/9 et badge */}
      <Link
        href={`/article/${item.slug}`}
        className="block relative aspect-video w-full overflow-hidden bg-gray-100"
      >
        <img
          src={imageSrc}
          alt={item.title || "Article"}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <span
          className={`absolute top-3 left-3 text-[11px] font-bold px-2.5 py-0.5 rounded-full border shadow-sm backdrop-blur-md ${catStyle.badge}`}
        >
          {catLabel}
        </span>
      </Link>

      {/* Contenu textuel */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
            <span className="font-semibold text-gray-700">{sourceName}</span>
            <span>•</span>
            <time>{item.date}</time>
          </div>
          <Link href={`/article/${item.slug}`}>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
              {item.title}
            </h3>
          </Link>
          {item.excerpt && (
            <p className="mt-2.5 text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed">
              {item.excerpt}
            </p>
          )}
        </div>

        <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
          <Link
            href={`/article/${item.slug}`}
            className="text-emerald-700 font-bold group-hover:underline inline-flex items-center gap-1"
          >
            Lire la suite
            <svg
              className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}
