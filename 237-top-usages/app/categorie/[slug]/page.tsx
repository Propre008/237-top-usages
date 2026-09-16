import { getAllPosts } from "@/lib/posts";
import ArticleList from "@/components/ArticleList";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

const categoryMeta: Record<string, { label: string; desc: string; icon: string }> = {
  "top-usages": {
    label: "Top Usages",
    desc: "Les apps, services et outils les plus populaires au Cameroun.",
    icon: "🏆",
  },
  "problemes-solutions": {
    label: "Problèmes & Solutions",
    desc: "Astuces, hacks et solutions concrètes face aux défis du quotidien.",
    icon: "🔧",
  },
  tendances: {
    label: "Tendances",
    desc: "Ce qui buzz au Cameroun — tech, innovations, business et nouvelles habitudes.",
    icon: "📈",
  },
  actualites: {
    label: "Actualités",
    desc: "Les temps forts de l'actualité au Cameroun — foot, économie, société et faits marquants.",
    icon: "⚡",
  },
};

const getCategoryMeta = (slug: string) => {
  if (categoryMeta[slug]) return categoryMeta[slug];
  const formatted = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    label: formatted,
    desc: `Tous les articles et dossiers sur le thème ${formatted}.`,
    icon: "📌",
  };
};

export async function generateStaticParams() {
  const posts = getAllPosts();
  const categories = Array.from(new Set(posts.map((p) => p.category)));
  return categories.map((cat) => ({ slug: cat }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const meta = getCategoryMeta(slug);
  return {
    title: meta.label,
    description: meta.desc,
  };
}

export default async function CategoriePage({ params }: Props) {
  const { slug } = await params;
  const allPosts = getAllPosts();
  const filtered = allPosts.filter((p) => p.category === slug);
  const meta = getCategoryMeta(slug);

  if (!meta) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-surface-700 mb-6">
        <Link href="/" className="hover:text-brand-600 transition-colors">Accueil</Link>
        <span>/</span>
        <span className="text-surface-900 font-medium">{meta.label}</span>
      </nav>

      {/* Header */}
      <div className="mb-8 flex items-start gap-4">
        <span className="text-4xl">{meta.icon}</span>
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-surface-900 tracking-tight">
            {meta.label}
          </h1>
          <p className="text-surface-700 mt-1">{meta.desc}</p>
          <p className="text-sm text-surface-700 mt-2">
            {filtered.length} article{filtered.length > 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <ArticleList posts={filtered} />
    </div>
  );
}
