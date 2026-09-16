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

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const contentHtml = await renderMarkdown(post.content);

  const categoryLabels: Record<string, string> = {
    "top-usages": "Top Usages",
    "problemes-solutions": "Problèmes & Solutions",
    tendances: "Tendances",
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-surface-700 mb-6">
        <Link href="/" className="hover:text-brand-600 transition-colors">Accueil</Link>
        <span>/</span>
        <Link href={`/categorie/${post.category}`} className="hover:text-brand-600 transition-colors">
          {categoryLabels[post.category] || post.category}
        </Link>
        <span>/</span>
        <span className="text-surface-900 font-medium truncate">{post.title}</span>
      </nav>

      <article className="bg-white rounded-2xl border border-surface-200/80 shadow-sm overflow-hidden">
        {/* Gradient accent */}
        <div className="h-1.5 bg-gradient-to-r from-brand-400 via-brand-500 to-brand-700" />

        <div className="p-6 sm:p-8 lg:p-10">
          {/* Header */}
          <header className="space-y-4 mb-8 pb-6 border-b border-surface-200">
            <div className="flex flex-wrap items-center gap-3">
              <span className="tag-badge">
                {categoryLabels[post.category] || post.category}
              </span>
              <time className="text-sm text-surface-700">{post.date}</time>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-surface-900 leading-tight tracking-tight">
              {post.title}
            </h1>
            <p className="text-sm text-surface-700">
              Par <span className="font-medium text-surface-900">Équipe 237 Top Usages</span>
            </p>
          </header>

          {/* Content */}
          <div
            className="prose-custom"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />

          {/* Tags */}
          <div className="mt-10 pt-6 border-t border-surface-200">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="tag-badge">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </article>

      {/* Back button */}
      <div className="mt-8 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-800 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Retour aux articles
        </Link>
      </div>
    </div>
  );
}
