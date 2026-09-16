import Link from "next/link";

type Post = {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt?: string;
};

const categoryColors: Record<string, string> = {
  "top-usages": "bg-brand-100 text-brand-800",
  "problemes-solutions": "bg-amber-100 text-amber-800",
  tendances: "bg-sky-100 text-sky-800",
};

const categoryLabels: Record<string, string> = {
  "top-usages": "Top Usages",
  "problemes-solutions": "Problèmes & Solutions",
  tendances: "Tendances",
};

export default function ArticleCard({ post }: { post: Post }) {
  const badgeClass = categoryColors[post.category] || "bg-surface-100 text-surface-700";
  const catLabel = categoryLabels[post.category] || post.category;

  return (
    <article className="card-hover group bg-white rounded-2xl border border-surface-200/80 overflow-hidden shadow-sm">
      {/* Color accent top bar */}
      <div className="h-1 bg-gradient-to-r from-brand-400 to-brand-600" />

      <div className="p-5 sm:p-6 flex flex-col gap-3">
        {/* Category badge + date */}
        <div className="flex items-center justify-between">
          <span className={`tag-badge ${badgeClass}`}>
            {catLabel}
          </span>
          <time className="text-xs text-surface-700 font-medium">{post.date}</time>
        </div>

        {/* Title */}
        <Link href={`/article/${post.slug}`}>
          <h3 className="font-display font-bold text-lg text-surface-900 group-hover:text-brand-700 transition-colors leading-snug">
            {post.title}
          </h3>
        </Link>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-sm text-surface-700 leading-relaxed line-clamp-3">
            {post.excerpt}
          </p>
        )}

        {/* Read more link */}
        <Link
          href={`/article/${post.slug}`}
          className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-800 transition-colors mt-auto pt-1"
        >
          Lire la suite
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>
    </article>
  );
}
