import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { renderMarkdown } from "@/lib/markdown";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt || `Lisez "${post.title}" sur 237 Top Usages.`,
  };
}

const CATEGORY_LABELS: Record<string, string> = {
  sport: "Sport",
  football: "Football",
  tech: "Tech",
  business: "Business",
  energie: "Énergie",
  "top-usages": "Top Usages",
  "problemes-solutions": "Problèmes & Solutions",
  tendances: "Tendances",
  actualites: "Actualités",
};

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const contentHtml = await renderMarkdown(post.content);

  // Estimation du temps de lecture
  const words = post.content.split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(words / 200)) + " min de lecture";

  const catLabel = CATEGORY_LABELS[post.category?.toLowerCase()] || post.category;

  const imageSrc =
    post.coverImage ||
    `/images/defaults/${post.category?.toLowerCase() || "actualites"}.jpg`;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Fil d'Ariane */}
      <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-emerald-600 transition-colors">
          Accueil
        </Link>
        <span>/</span>
        <Link
          href={`/categorie/${post.category}`}
          className="hover:text-emerald-600 transition-colors"
        >
          {catLabel}
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate max-w-[180px] sm:max-w-sm">
          {post.title}
        </span>
      </nav>

      <article className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
        {/* Accent de couleur supérieur */}
        <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-700" />

        <div className="p-6 sm:p-8 lg:p-10">
          {/* Header immersif */}
          <header className="mb-8 pb-6 border-b border-gray-100">
            {/* Métadonnées : Catégorie, Date, Temps de lecture */}
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-500 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                {catLabel}
              </span>
              <span>•</span>
              <time className="font-medium text-gray-600">{post.date}</time>
              <span>•</span>
              <span className="text-gray-500">{readingTime}</span>
            </div>

            {/* Titre principal */}
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight mb-4 tracking-tight">
              {post.title}
            </h1>

            {/* Source originale si dépêche */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-6">
              <span>D&apos;après une dépêche de</span>
              <span className="font-semibold text-gray-800">
                {post.sourceName || "Équipe 237 Top Usages"}
              </span>
              {post.sourceUrl && (
                <a
                  href={post.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 hover:text-emerald-800 font-medium hover:underline inline-flex items-center gap-0.5 ml-1"
                >
                  (source originale ↗)
                </a>
              )}
            </div>

            {/* Grande image de couverture 16/9 */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-sm border border-gray-200 bg-gray-100">
              <img
                src={imageSrc}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          </header>

          {/* Contenu Markdown */}
          <div
            className="prose-custom"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-10 pt-6 border-t border-gray-100">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="tag-badge font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      {/* Bouton retour */}
      <div className="mt-8 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
          Retour aux articles
        </Link>
      </div>
    </div>
  );
}
