import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { getPostBySlug } from '../lib/blog';
import { ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO';

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;

  if (!post) return <Navigate to="/blog" replace />;

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
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-teal-700 transition-colors mb-10"
        >
          <ArrowLeft size={14} />
          Back to Blog
        </Link>

        <header className="mb-12">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
            {post.title}
          </h1>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span>{post.date}</span>
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
        </header>

        <article className="prose prose-lg prose-gray prose-headings:font-display prose-headings:font-bold prose-a:text-teal-700 prose-a:no-underline hover:prose-a:underline prose-code:before:content-none prose-code:after:content-none prose-blockquote:border-teal-600 prose-blockquote:text-gray-700 prose-blockquote:not-italic prose-hr:my-14 prose-h2:mt-16 prose-h2:mb-6 prose-h3:mt-10 prose-h3:mb-4 prose-p:leading-[1.9] max-w-none">
          <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
            {post.content}
          </Markdown>
        </article>
      </div>
    </div>
  );
};

export default BlogPost;
