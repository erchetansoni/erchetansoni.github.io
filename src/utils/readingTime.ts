/**
 * Deterministic reading time estimator based on word count.
 * Standard estimation uses ~200 words per minute.
 */
export function getReadingTime(content: string | undefined | null): string {
  if (!content || !content.trim()) {
    return "1 min read";
  }

  // Remove code blocks, markdown headings, image links, and HTML tags for accurate word count
  const cleanContent = content
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`.*?`/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[.*?\]\(.*?\)/g, "")
    .replace(/[#*_~>\-]/g, " ")
    .trim();

  const words = cleanContent.split(/\s+/).filter(Boolean).length;
  const wordsPerMinute = 200;
  const minutes = Math.ceil(words / wordsPerMinute);

  return `${Math.max(1, minutes)} min read`;
}
