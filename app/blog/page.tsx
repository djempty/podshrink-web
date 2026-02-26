import { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, Clock, Tag } from 'lucide-react';
import { getAllPosts } from '@/lib/blog';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';

export const metadata: Metadata = {
  title: 'Blog - PodShrink',
  description: 'Articles about podcasts, AI, productivity, and how to make the most of your listening time.',
  openGraph: {
    title: 'Blog - PodShrink',
    description: 'Articles about podcasts, AI, productivity, and how to make the most of your listening time.',
    type: 'website',
  },
  alternates: {
    canonical: '/blog',
  },
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <div className="min-h-screen bg-[#121212]">
      <PageHeader title="Blog" />

      <div className="max-w-5xl mx-auto px-6 py-4 md:py-8">
        <p className="text-gray-400 text-lg text-center mb-8">
          Insights on podcasts, AI, and productivity
        </p>
        <div className="grid gap-8">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block bg-[#1a1a1a] border border-gray-800 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all duration-300"
            >
              <div className="md:flex">
                {/* Featured Image */}
                <div className="md:w-80 h-48 md:h-auto bg-gradient-to-br from-purple-600/20 to-blue-600/20 relative overflow-hidden flex-shrink-0">
                  {post.featuredImage ? (
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg
                        className="w-16 h-16 text-purple-500/30"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                      >
                        <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
                        <path d="M12 8v8M8 12h8" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 p-6 md:p-8">
                  {/* Category Badge */}
                  <div className="inline-flex items-center gap-1.5 bg-purple-600/20 border border-purple-500/30 rounded-full px-3 py-1 mb-4">
                    <Tag size={12} className="text-purple-400" />
                    <span className="text-purple-300 text-xs font-medium">{post.category}</span>
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-gray-400 text-base leading-relaxed mb-4">
                    {post.excerpt}
                  </p>

                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} />
                      <span>{post.readTime}</span>
                    </div>
                    <span className="text-gray-600">by {post.author}</span>
                  </div>

                  {/* Tags */}
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs text-gray-500 bg-gray-800/50 px-2 py-1 rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500">No blog posts yet. Check back soon!</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
