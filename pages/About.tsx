
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, Mail, ChevronDown, ChevronLeft, ChevronRight, ImageIcon, Calendar } from 'lucide-react';
import { getAllPosts } from '../lib/blog';
import { CMSData } from '../types';

function useScrollReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('scroll-visible');
          observer.unobserve(el);
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function useCarousel(cardWidth: number) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const pauseTimeout = useRef<ReturnType<typeof setTimeout>>();

  const scroll = useCallback((direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    // Pause auto-scroll temporarily when user clicks arrows
    setPaused(true);
    if (pauseTimeout.current) clearTimeout(pauseTimeout.current);
    pauseTimeout.current = setTimeout(() => setPaused(false), 3000);

    const gap = 20; // gap-5 = 1.25rem = 20px
    const shift = cardWidth + gap;
    el.scrollBy({ left: direction === 'right' ? shift : -shift, behavior: 'smooth' });
  }, [cardWidth]);

  return { scrollRef, paused, setPaused, scroll };
}

interface AboutProps {
  data: CMSData;
}

const About: React.FC<AboutProps> = ({ data }) => {
  const posts = getAllPosts().slice(0, 5);

  const researchCarousel = useCarousel(384); // ~24rem
  const blogCarousel = useCarousel(384);

  const researchRef = useScrollReveal<HTMLElement>();
  const blogRef = useScrollReveal<HTMLElement>();

  return (
    <div className="snap-container">
      {/* Hero Section */}
      <section className="snap-section min-h-[calc(100vh-6rem)] flex flex-col justify-center">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-16 py-16 md:py-20">
        <div className="welcome-fade">
          {/* Name + Role */}
          <div className="text-center mb-14 md:mb-20">
            <h1 className="text-4xl md:text-[3.4rem] font-display font-bold text-gray-900 dark:text-gray-100 mb-4 leading-tight">
              {data.personalInfo.name}
            </h1>
            <p className="text-lg md:text-xl text-teal-700 dark:text-teal-400 font-medium">
              {data.personalInfo.role}
            </p>
          </div>

          {/* Photo + Bio */}
          <div className="flex flex-col md:flex-row gap-10 md:gap-14 items-stretch">
            <div className="w-full md:w-[32%] flex-shrink-0">
              <div className="aspect-[3/4] overflow-hidden rounded-2xl group cursor-pointer relative">
                <img
                  src={data.personalInfo.headshot}
                  alt={data.personalInfo.name}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-center">
              <div className="text-gray-600 dark:text-gray-300 text-base md:text-lg leading-[1.85]">
                <p>{data.personalInfo.bio}</p>
              </div>

              <div className="mt-8 flex items-center gap-5">
                <a href={data.personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 dark:text-gray-500 hover:text-teal-700 dark:hover:text-teal-400 transition-colors">
                  <Linkedin size={20} />
                </a>
                <a href={`mailto:${data.personalInfo.email}`} className="text-gray-400 dark:text-gray-500 hover:text-teal-700 dark:hover:text-teal-400 transition-colors">
                  <Mail size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>

          {/* Scroll indicator */}
          <div className="flex justify-center mt-12 md:mt-16">
            <button
              onClick={() => document.getElementById('pub-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="scroll-indicator text-gray-300 dark:text-gray-600 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
              aria-label="Scroll to Publications"
            >
              <ChevronDown size={28} />
            </button>
          </div>
        </div>
      </section>

      {/* Publications Carousel */}
      <section id="pub-section" ref={researchRef} className="snap-section scroll-section min-h-screen bg-gray-50/80 dark:bg-gray-900/80 py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-16">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-gray-100 mb-10 text-center">
            Publications
          </h2>

          {(() => {
            const pubs = data.research.filter(r => r.status === 'publication');
            const bookCards = data.books.map(b => ({ type: 'book' as const, ...b }));
            const pubCards = pubs.map(p => ({ type: 'paper' as const, ...p }));
            const allCards = [...pubCards, ...bookCards];
            const doubled = [...allCards, ...allCards];
            return (
              <div className="relative group/carousel">
                {/* Left Arrow */}
                <button
                  onClick={() => researchCarousel.scroll('left')}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-20 w-10 h-10 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-teal-700 dark:hover:text-teal-400 hover:scale-110 transition-all opacity-0 group-hover/carousel:opacity-100"
                  aria-label="Previous"
                >
                  <ChevronLeft size={20} />
                </button>
                {/* Right Arrow */}
                <button
                  onClick={() => researchCarousel.scroll('right')}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-20 w-10 h-10 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-teal-700 dark:hover:text-teal-400 hover:scale-110 transition-all opacity-0 group-hover/carousel:opacity-100"
                  aria-label="Next"
                >
                  <ChevronRight size={20} />
                </button>

                <div
                  ref={researchCarousel.scrollRef}
                  className="overflow-hidden"
                  onMouseEnter={() => researchCarousel.setPaused(true)}
                  onMouseLeave={() => researchCarousel.setPaused(false)}
                >
                  <div
                    className="flex gap-5"
                    style={{
                      animation: `marquee-left ${allCards.length * 8}s linear infinite`,
                      animationPlayState: researchCarousel.paused ? 'paused' : 'running',
                      width: 'max-content',
                    }}
                  >
                    {doubled.map((card, i) => (
                      <div key={`${card.id}-${i}`} className="flex-shrink-0 w-[20rem] md:w-[24rem] lg:w-[28rem]">
                        <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.04] h-full">
                          <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center overflow-hidden">
                            {card.image ? (
                              <img src={card.image} alt={card.title} className="w-full h-full object-cover transition-transform duration-500" />
                            ) : (
                              <div className="flex flex-col items-center gap-2 text-gray-300 dark:text-gray-500">
                                <ImageIcon size={28} />
                                <span className="text-xs">{card.type === 'book' ? 'Book Cover' : 'Cover Image'}</span>
                              </div>
                            )}
                          </div>
                          <div className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                                card.type === 'book'
                                  ? 'text-amber-700/80 dark:text-amber-400/80 bg-amber-50 dark:bg-amber-950'
                                  : 'text-teal-700/80 dark:text-teal-400/80 bg-teal-50 dark:bg-teal-950'
                              }`}>
                                {card.type === 'book' ? 'Book' : card.category}
                              </span>
                              <span className="text-[11px] text-gray-400 dark:text-gray-500">
                                {card.date}
                              </span>
                            </div>
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 leading-snug mb-1.5">
                              {card.title}
                            </h3>
                            {card.type === 'paper' ? (
                              <>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                                  {card.authors}
                                </p>
                                {card.journal && (
                                  <p className="text-xs text-gray-400 dark:text-gray-500 italic">{card.journal}</p>
                                )}
                              </>
                            ) : (
                              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                                {card.publisher}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}

          <div className="text-center mt-8">
            <Link to="/research" className="text-sm text-teal-700 dark:text-teal-400 hover:underline font-medium">
              View all research &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section ref={blogRef} className="snap-section scroll-section min-h-[60vh] bg-gray-50/80 dark:bg-gray-900/80 py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-16">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-gray-100 mb-10 text-center">
            Recent Posts
          </h2>

          {posts.length === 0 ? (
            <p className="text-center text-gray-400 dark:text-gray-500 italic">No posts yet.</p>
          ) : (
            <div className="relative group/carousel">
              {/* Left Arrow */}
              <button
                onClick={() => blogCarousel.scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-20 w-10 h-10 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-teal-700 dark:hover:text-teal-400 hover:scale-110 transition-all opacity-0 group-hover/carousel:opacity-100"
                aria-label="Previous"
              >
                <ChevronLeft size={20} />
              </button>
              {/* Right Arrow */}
              <button
                onClick={() => blogCarousel.scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-20 w-10 h-10 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-teal-700 dark:hover:text-teal-400 hover:scale-110 transition-all opacity-0 group-hover/carousel:opacity-100"
                aria-label="Next"
              >
                <ChevronRight size={20} />
              </button>

              <div
                ref={blogCarousel.scrollRef}
                className="overflow-hidden"
                onMouseEnter={() => blogCarousel.setPaused(true)}
                onMouseLeave={() => blogCarousel.setPaused(false)}
              >
                <div
                  className="flex gap-5"
                  style={{
                    animation: `marquee-left ${Math.max(posts.length, 3) * 6}s linear infinite`,
                    animationPlayState: blogCarousel.paused ? 'paused' : 'running',
                    width: 'max-content',
                  }}
                >
                  {[...posts, ...posts].map((post, i) => (
                    <Link
                      key={`${post.slug}-${i}`}
                      to={`/blog/${post.slug}`}
                      className="flex-shrink-0 w-[20rem] md:w-[24rem] lg:w-[28rem]"
                    >
                      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.04] h-full group">
                        <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center overflow-hidden">
                          {post.image ? (
                            <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500" />
                          ) : (
                            <div className="flex flex-col items-center gap-2 text-gray-300 dark:text-gray-500">
                              <ImageIcon size={28} />
                              <span className="text-xs">Thumbnail</span>
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <div className="flex gap-2 mb-2 flex-wrap">
                            {post.tags.map((tag) => (
                              <span key={tag} className="text-[11px] text-teal-700/80 dark:text-teal-400/80 px-2 py-0.5 bg-teal-50 dark:bg-teal-950 rounded-full font-medium">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors line-clamp-2 leading-snug mb-2">
                            {post.title}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">
                            {post.description}
                          </p>
                          <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                            <Calendar size={12} />
                            <span>{post.date}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="text-center mt-8">
            <Link to="/blog" className="text-sm text-teal-700 dark:text-teal-400 hover:underline font-medium">
              View all posts &rarr;
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
