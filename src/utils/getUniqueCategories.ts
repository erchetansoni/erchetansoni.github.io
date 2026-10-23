import type { CollectionEntry } from "astro:content";
import { postFilter } from "./postFilter";
import { slugifyStr } from "./slugify";

export type Category = {
  category: string;
  categoryName: string;
  count: number;
};

/**
 * Normalizes categories from a post (handling both `categories` array and singular `category`)
 */
export function getPostCategories(post: CollectionEntry<"posts">): string[] {
  const result: string[] = [];
  if (post.data.category && typeof post.data.category === "string" && post.data.category.trim()) {
    result.push(post.data.category.trim());
  }
  if (Array.isArray(post.data.categories)) {
    for (const cat of post.data.categories) {
      if (typeof cat === "string" && cat.trim() && !result.includes(cat.trim())) {
        result.push(cat.trim());
      }
    }
  }
  return result.length > 0 ? result : ["DevOps"];
}

/**
 * Builds a de-duplicated, sorted list of categories with post counts.
 */
export function getUniqueCategories(posts: CollectionEntry<"posts">[]): Category[] {
  const filteredPosts = posts.filter(postFilter);
  const categoryMap = new Map<string, { categoryName: string; count: number }>();

  for (const post of filteredPosts) {
    const categories = getPostCategories(post);
    for (const cat of categories) {
      const slug = slugifyStr(cat);
      const existing = categoryMap.get(slug);
      if (existing) {
        existing.count += 1;
      } else {
        categoryMap.set(slug, { categoryName: cat, count: 1 });
      }
    }
  }

  const result: Category[] = Array.from(categoryMap.entries()).map(([slug, data]) => ({
    category: slug,
    categoryName: data.categoryName,
    count: data.count,
  }));

  return result.sort((a, b) => a.category.localeCompare(b.category));
}
