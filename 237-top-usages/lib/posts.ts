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
  excerpt?: string;
  content: string;
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

      return {
        slug,
        title: data.title as string,
        date: data.date as string,
        category: data.category as string,
        tags: (data.tags as string[]) || [],
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

export function getPostBySlug(slug: string): PostMeta | null {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title as string,
    date: data.date as string,
    category: data.category as string,
    tags: (data.tags as string[]) || [],
    content,
  };
}
