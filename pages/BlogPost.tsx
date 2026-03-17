import React, { useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { getPostBySlug, getAllPosts } from '../lib/blog';
import { ArrowLeft, Calendar, Clock, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';
import { useTheme } from '../context/ThemeContext';

function estimateReadingTime(content: string): number {
  const koreanChars = (content.match(/[\u3131-\uD79D]/g) || []).length;
  const words = content.replace(/[\u3131-\uD79D]/g, '').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round((koreanChars / 500 + words / 200)));
}

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;
  const { theme } = useTheme();

  useEffect(() => {
    const link = document.getElementById('hljs-theme') as HTMLLinkElement | null;
    if (link) {
      link.href = theme === 'dark'
        ? 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/github-dark.min.css'
        : 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/github.min.css';
    }
  }, [theme]);

  if (!post) return <Navigate to="/blog" replace />;

  const allPosts = getAllPosts();
  const currentIndex = allPosts.findIndex((p) => p.slug === post.slug);
  const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;

  return (
    <div className="max-w-3xl mx-auto px-6 sm:px-8 py-16 md:py-24">
      <SEO
        title={post.title}
        description={post.description}
        type="article"
        url={`/blog/${post.slug}`}
        publishedTime={post.date}
        tags={post.tags}
      />
      <div className="welcome-fade">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 dark:text-gray-500 hover:text-teal-700 dark:hover:text-teal-400 transition-colors mb-12"
        >
          <ArrowLeft size={14} />
          Back to Blog
        </Link>

        <header className="mb-14">
          {/* Tags */}
          <div className="flex gap-2 mb-5 flex-wrap">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] text-teal-700 dark:text-teal-400 px-2.5 py-1 bg-teal-50 dark:bg-teal-950 rounded-full font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-[2.75rem] font-display font-extrabold text-gray-900 dark:text-gray-100 mb-5 leading-[1.2] tracking-tight">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-gray-400 dark:text-gray-500 pb-6 border-b border-gray-200 dark:border-gray-800">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {post.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} />
              {estimateReadingTime(post.content)} min read
            </span>
          </div>
        </header>

        <article className="prose prose-lg prose-slate dark:prose-invert prose-headings:font-display prose-a:text-teal-700 dark:prose-a:text-teal-400 prose-a:no-underline hover:prose-a:underline prose-code:before:content-none prose-code:after:content-none prose-blockquote:border-l-4 prose-blockquote:border-teal-500 prose-blockquote:bg-teal-50/50 dark:prose-blockquote:bg-teal-950/20 prose-blockquote:rounded-r-lg prose-blockquote:py-1 prose-blockquote:px-5 prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300 prose-blockquote:not-italic prose-hr:hidden prose-h2:text-[1.55rem] prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-8 prose-h2:text-blue-600 dark:prose-h2:text-blue-400 prose-h2:tracking-tight prose-h2:pl-4 prose-h2:border-l-[3px] prose-h2:border-blue-500 prose-h3:text-xl prose-h3:font-bold prose-h3:mt-12 prose-h3:mb-5 prose-p:text-[21px] prose-p:leading-[2.15] prose-p:mb-10 prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-p:tracking-[-0.01em] prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-strong:font-bold max-w-none">
          <Markdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              h2: ({ children }) => (
                <h2 style={{ fontSize: '23px', fontWeight: 700, color: '#2563eb', borderLeft: '3px solid #3b82f6', paddingLeft: '16px', marginTop: '32px', marginBottom: '32px', lineHeight: 1.3 }}>
                  {children}
                </h2>
              ),
            }}
          >
            {post.content}
          </Markdown>
        </article>

        {/* Post Navigation */}
        {(prevPost || nextPost) && (
          <nav className="mt-20 pt-10 border-t border-gray-200 dark:border-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {prevPost ? (
                <Link
                  to={`/blog/${prevPost.slug}`}
                  className="group flex flex-col p-5 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-teal-50 dark:hover:bg-teal-950/30 border border-gray-100 dark:border-gray-800 hover:border-teal-200 dark:hover:border-teal-900 transition-all duration-300"
                >
                  <span className="text-xs text-gray-400 dark:text-gray-500 mb-2 flex items-center gap-1">
                    <ArrowLeft size={12} /> Previous
                  </span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors line-clamp-1">
                    {prevPost.title}
                  </span>
                </Link>
              ) : <div />}
              {nextPost ? (
                <Link
                  to={`/blog/${nextPost.slug}`}
                  className="group flex flex-col items-end p-5 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-teal-50 dark:hover:bg-teal-950/30 border border-gray-100 dark:border-gray-800 hover:border-teal-200 dark:hover:border-teal-900 transition-all duration-300"
                >
                  <span className="text-xs text-gray-400 dark:text-gray-500 mb-2 flex items-center gap-1">
                    Next <ArrowRight size={12} />
                  </span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors line-clamp-1">
                    {nextPost.title}
                  </span>
                </Link>
              ) : <div />}
            </div>
          </nav>
        )}
      </div>
    </div>
  );
};

export default BlogPost;
