import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'content/blog');

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  category: string;
  tags: string[];
  author: string;
  featuredImage: string;
  readTime: string;
  content: string;
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  category: string;
  tags: string[];
  author: string;
  featuredImage: string;
  readTime: string;
}

export async function getAllPosts(): Promise<BlogPostMeta[]> {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);

      return {
        slug,
        ...(data as Omit<BlogPostMeta, 'slug'>),
      };
    });

  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    const processedContent = await remark().use(html, { sanitize: false }).process(content);
    const contentHtml = processedContent.toString();

    return {
      slug,
      content: contentHtml,
      ...(data as Omit<BlogPost, 'slug' | 'content'>),
    };
  } catch {
    return null;
  }
}

export async function getRelatedPosts(currentSlug: string, category: string, limit = 3): Promise<BlogPostMeta[]> {
  const allPosts = await getAllPosts();
  return allPosts
    .filter(post => post.slug !== currentSlug && post.category === category)
    .slice(0, limit);
}
