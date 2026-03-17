import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllPosts } from '../lib/blog';
import { ImageIcon, Calendar, Clock, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';

function estimateReadingTime(content: string): number {
  const koreanChars = (content.match(/[\u3131-\uD79D]/g) || []).length;
  const words = content.replace(/[\u3131-\uD79D]/g, '').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round((koreanChars / 500 + words / 200)));
}

const Blog: React.FC = () => {
  const posts = getAllPosts();
  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags)));
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const filtered = activeTag ? posts.filter((p) => p.tags.includes(activeTag)) : posts;

  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-16 py-16 md:py-24">
      <SEO title="Blog" description="Thoughts on research, technology, and the academic journey." url="/blog" />

      {/* Header */}
      <div className="mb-14 welcome-fade">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-gray-100 mb-3">Blog</h1>
        <p className="text-gray-500 dark:text-gray-400 text-base">연구, 기술, 그리고 삶에 대한 생각들을 기록합니다.</p>
      </div>

      {/* Tag Filter */}
      {allTags.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-10 welcome-fade" style={{ animationDelay: '0.05s' }}>
          <button
            onClick={() => setActiveTag(null)}
            className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all duration-200 ${
              activeTag === null
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag === activeTag ? null : tag)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all duration-200 ${
                activeTag === tag
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="text-gray-400 dark:text-gray-500 italic welcome-fade" style={{ animationDelay: '0.1s' }}>No posts yet.</p>
      ) : (
        <div className="space-y-0 welcome-fade" style={{ animationDelay: '0.1s' }}>
          {/* Featured Post (first post) */}
          {filtered.length > 0 && (
            <Link
              to={`/blog/${filtered[0].slug}`}
              className="group block mb-10"
            >
              <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-stretch">
                <div className="w-full md:w-[45%] flex-shrink-0">
                  <div className="aspect-[16/10] bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden">
                    {filtered[0].image ? (
                      <img src={filtered[0].image} alt={filtered[0].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-gray-300 dark:text-gray-600">
                        <ImageIcon size={40} strokeWidth={1.5} />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-center py-2">
                  <div className="flex gap-2 mb-4 flex-wrap">
                    {filtered[0].tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] text-teal-700/80 dark:text-teal-400/80 px-2.5 py-0.5 bg-teal-50 dark:bg-teal-950 rounded-full font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-xl md:text-2xl font-display font-bold text-gray-900 dark:text-gray-100 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors mb-3 leading-snug">
                    {filtered[0].title}
                  </h2>
                  <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 leading-relaxed mb-4 line-clamp-3">
                    {filtered[0].description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={13} />
                      {filtered[0].date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={13} />
                      {estimateReadingTime(filtered[0].content)} min read
                    </span>
                  </div>
                  <div className="mt-5">
                    <span className="inline-flex items-center gap-1.5 text-sm text-teal-700 dark:text-teal-400 font-medium group-hover:gap-2.5 transition-all duration-300">
                      Read more <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Divider */}
          {filtered.length > 1 && (
            <div className="border-t border-gray-200 dark:border-gray-800 my-10" />
          )}

          {/* Rest of posts grid */}
          {filtered.length > 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.slice(1).map((post) => (
                <Link
                  key={post.slug}
                  to={`/blog/${post.slug}`}
                  className="group bg-white dark:bg-gray-800/50 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:border-teal-200 dark:hover:border-teal-900 hover:shadow-lg hover:shadow-teal-500/5 transition-all duration-300 hover:-translate-y-0.5"
                >
                  <div className="aspect-[16/10] bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center overflow-hidden">
                    {post.image ? (
                      <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-gray-300 dark:text-gray-600">
                        <ImageIcon size={28} strokeWidth={1.5} />
                      </div>
                    )}
                  </div>

                  <div className="p-5">
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

                    <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors line-clamp-2 mb-2 leading-snug">
                      {post.title}
                    </h2>

                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
                      {post.description}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={12} />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock size={12} />
                        {estimateReadingTime(post.content)} min
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Blog;
