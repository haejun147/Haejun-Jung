import React from 'react';
import { Link } from 'react-router-dom';
import { getAllPosts } from '../lib/blog';
import { ImageIcon, Calendar } from 'lucide-react';
import SEO from '../components/SEO';

const Blog: React.FC = () => {
  const posts = getAllPosts();

  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-16 py-16 md:py-24">
      <SEO title="Blog" description="Thoughts on research, technology, and the academic journey." url="/blog" />
      <div className="mb-12 welcome-fade">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-gray-100 mb-4">Blog</h1>
      </div>

      {posts.length === 0 ? (
        <p className="text-gray-400 dark:text-gray-500 italic welcome-fade" style={{ animationDelay: '0.1s' }}>No posts yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 welcome-fade" style={{ animationDelay: '0.1s' }}>
          {posts.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              {/* Thumbnail */}
              <div className="aspect-[16/10] bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center overflow-hidden">
                {post.image ? (
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-300 dark:text-gray-500">
                    <ImageIcon size={32} />
                    <span className="text-xs">Thumbnail</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Tags */}
                <div className="flex gap-2 mb-3 flex-wrap">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] text-teal-700/80 dark:text-teal-400/80 px-2 py-0.5 bg-teal-50 dark:bg-teal-950 rounded-full font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors line-clamp-2 mb-2">
                  {post.title}
                </h2>

                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
                  {post.description}
                </p>

                <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                  <Calendar size={12} />
                  <span>{post.date}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Blog;
