import ArticleCard from "./ArticleCard";

type Post = {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt?: string;
};

export default function ArticleList({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-100 mb-4">
          <svg className="w-8 h-8 text-surface-700" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9.75m3 0h3m-3 0v3m0-3v-3m-9-1.5h.008v.008H2.25V13.5z" />
          </svg>
        </div>
        <p className="text-surface-700 font-medium">Aucun article pour le moment.</p>
        <p className="text-surface-700 text-sm mt-1">De nouveaux contenus arrivent bientôt !</p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((p) => (
        <ArticleCard key={p.slug} post={p} />
      ))}
    </div>
  );
}
