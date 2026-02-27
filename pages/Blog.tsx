import React from 'react';
import { Link } from 'react-router-dom';
import { getAllPosts } from '../lib/blog';
import SEO from '../components/SEO';

const Blog: React.FC = () => {
  const posts = getAllPosts();

  return (
    <div className="max-w-3xl mx-auto px-6 sm:px-8 py-16 md:py-24">
      <SEO title="Blog" description="Thoughts on research, technology, and the academic journey." url="/blog" />
      <div className="mb-16 welcome-fade">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">Blog</h1>
        <p className="text-gray-500 text-base leading-relaxed max-w-2xl">
          Thoughts on research, technology, and the academic journey.
        </p>
      </div>

      <div className="space-y-8 welcome-fade" style={{ animationDelay: '0.1s' }}>
        {posts.length === 0 && (
          <p className="text-gray-400 italic">No posts yet.</p>
        )}
        {posts.map((post) => (
          <Link
            key={post.slug}
            to={`/blog/${post.slug}`}
            className="group block pb-8 border-b border-gray-100 last:border-0"
          >
            <h2 className="text-base font-semibold text-gray-900 group-hover:text-teal-700 transition-colors leading-snug">
              {post.title}
            </h2>
            <div className="mt-2 text-sm text-gray-500 space-y-1">
              <p>{post.description}</p>
              <div className="flex items-center gap-3">
                <span className="italic">{post.date}</span>
                <div className="flex gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] text-teal-700/80 px-2 py-0.5 border border-teal-700/20 rounded-full bg-teal-50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Blog;
