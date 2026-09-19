import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "content/articles");

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  category: string;
  tags: string[];
  featured?: boolean;
  excerpt?: string;
  coverImage?: string;
  sourceName?: string;
  sourceUrl?: string;
  content: string;
};

const CATEGORY_DEFAULT_IMAGES: Record<string, string> = {
  tech: "/images/defaults/tech.jpg",
  business: "/images/defaults/business.jpg",
  energie: "/images/defaults/energie.jpg",
  sport: "/images/defaults/sport.jpg",
  football: "/images/defaults/sport.jpg",
  "top-usages": "/images/defaults/tech.jpg",
  "problemes-solutions": "/images/defaults/energie.jpg",
  tendances: "/images/defaults/business.jpg",
  actualites: "/images/defaults/actualites.jpg",
};

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(postsDirectory)) return [];
  const fileNames = fs.readdirSync(postsDirectory);
  const posts = fileNames
    .filter((name) => name.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);

      const excerpt =
        content.split("\n").slice(0, 3).join(" ").slice(0, 150) + "...";

      const category = (data.category as string) || "actualites";
      const coverImage =
        (data.cover_image as string) ||
        CATEGORY_DEFAULT_IMAGES[category] ||
        "/images/defaults/actualites.jpg";

      return {
        slug,
        title: data.title as string,
        date: data.date as string,
        category,
        tags: (data.tags as string[]) || [],
        featured: Boolean(data.featured),
        coverImage,
        sourceName: (data.source_name as string) || "237 Top Usages",
        sourceUrl: (data.source_url as string) || undefined,
        excerpt,
        content,
      };
    });

  // Tri par date décroissante
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getSortedPosts(): PostMeta[] {
  return getAllPosts();
}

/**
 * Algorithme de sélection automatique "À la une" :
 * 1. Priorise les articles marqués 'featured: true'
 * 2. Assure une diversité thématique (ex: 1 Foot/Sport + 1 Tech + 1 Eco/Énergie)
 * 3. Complète par ordre chronologique décroissant
 */
export function getFeaturedPosts(limit: number = 3): PostMeta[] {
  const all = getAllPosts();
  if (all.length <= limit) return all;

  const selected: PostMeta[] = [];
  const seenCategories = new Set<string>();

  // 1. Articles explicitement mis à la une
  for (const post of all) {
    if (post.featured) {
      selected.push(post);
      seenCategories.add(post.category);
      if (selected.length >= limit) return selected;
    }
  }

  // 2. Équilibrage thématique automatique (éviter la redondance)
  for (const post of all) {
    if (selected.length >= limit) break;
    if (!selected.some((p) => p.slug === post.slug)) {
      if (!seenCategories.has(post.category)) {
        selected.push(post);
        seenCategories.add(post.category);
      }
    }
  }

  // 3. Complément si nécessaire
  for (const post of all) {
    if (selected.length >= limit) break;
    if (!selected.some((p) => p.slug === post.slug)) {
      selected.push(post);
    }
  }

  return selected.slice(0, limit);
}

export function getPostBySlug(slug: string): PostMeta | null {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const category = (data.category as string) || "actualites";
  const coverImage =
    (data.cover_image as string) ||
    CATEGORY_DEFAULT_IMAGES[category] ||
    "/images/defaults/actualites.jpg";

  return {
    slug,
    title: data.title as string,
    date: data.date as string,
    category,
    tags: (data.tags as string[]) || [],
    featured: Boolean(data.featured),
    coverImage,
    sourceName: (data.source_name as string) || "237 Top Usages",
    sourceUrl: (data.source_url as string) || undefined,
    content,
  };
}
