
import React, { useEffect, useRef } from 'react';
import { Linkedin, Mail, ChevronDown, GraduationCap, TrendingUp, Rocket, type LucideIcon } from 'lucide-react';

function getInstitutionIcon(place: string): LucideIcon {
  const p = place.toLowerCase();
  if (p.includes('kaist')) return GraduationCap;
  if (p.includes('hgu') || p.includes('handong')) return GraduationCap;
  if (p.includes('mit') || p.includes('massachusetts')) return GraduationCap;
  if (p.includes('flat') || p.includes('music')) return Rocket;
  if (p.includes('bluepoint')) return TrendingUp;
  return GraduationCap;
}

function getInstitutionLogo(place: string): { src: string; size: string } | null {
  const p = place.toLowerCase();
  if (p.includes('kaist')) return { src: '/kaist.png', size: 'w-40 h-40' };
  if (p.includes('hgu') || p.includes('handong')) return { src: '/hgu.png', size: 'w-20 h-20' };
  if (p.includes('mit') || p.includes('massachusetts')) return { src: '/mit.png', size: 'w-20 h-20' };
  if (p.includes('flat') || p.includes('music')) return { src: '/flat.png', size: 'w-40 h-40' };
  if (p.includes('bluepoint')) return { src: '/bluepoint.png', size: 'w-40 h-40' };
  return null;
}
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

interface AboutProps {
  data: CMSData;
}

const About: React.FC<AboutProps> = ({ data }) => {
  // Build journey timeline from CV data
  const journeyItems = [
    ...data.cv.education.map(e => ({
      year: e.period.split('-')[0].trim().replace('–', '').trim(),
      title: e.title,
      place: e.institution,
      description: e.description,
      type: 'education' as const,
    })),
    ...data.cv.experience.map(e => ({
      year: e.period.split('-')[0].trim().replace('–', '').trim(),
      title: e.title,
      place: e.institution,
      description: e.description,
      type: 'experience' as const,
    })),
  ].sort((a, b) => parseInt(b.year) - parseInt(a.year));

  // Research
  const publications = data.research.filter(r => r.status === 'publication');
  const workingPapers = data.research.filter(r => r.status !== 'publication');

  const journeyRef = useScrollReveal<HTMLElement>();
  const researchRef = useScrollReveal<HTMLElement>();

  return (
    <div className="snap-container">
      {/* Hero Section */}
      <section className="snap-section min-h-[calc(100vh-6rem)] flex flex-col justify-center">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-16 py-16 md:py-20">
        <div className="welcome-fade">
          {/* Name + Role — centered */}
          <div className="text-center mb-14 md:mb-20">
            <h1 className="text-4xl md:text-[3.4rem] font-display font-bold text-gray-900 dark:text-gray-100 mb-4 leading-tight">
              {data.personalInfo.name}
            </h1>
            <p className="text-lg md:text-xl text-teal-700 dark:text-teal-400 font-medium">
              {data.personalInfo.role}
            </p>
          </div>

          {/* Photo left + Bio right */}
          <div className="flex flex-col md:flex-row gap-10 md:gap-14 items-stretch">
            {/* Headshot */}
            <div className="w-full md:w-[45%] flex-shrink-0">
              <div className="aspect-[3/4] overflow-hidden rounded-2xl group cursor-pointer relative">
                <img
                  src={data.personalInfo.headshot}
                  alt={data.personalInfo.name}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>

            {/* Bio */}
            <div className="flex-1 flex flex-col justify-center">
              <div className="text-gray-600 dark:text-gray-300 text-base md:text-lg leading-[1.85]">
                <p>{data.personalInfo.bio}</p>
              </div>

              {/* Social links */}
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
              onClick={() => document.getElementById('journey')?.scrollIntoView({ behavior: 'smooth' })}
              className="scroll-indicator text-gray-300 dark:text-gray-600 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
              aria-label="Scroll to Journey"
            >
              <ChevronDown size={28} />
            </button>
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section id="journey" ref={journeyRef} className="snap-section scroll-section min-h-screen bg-gray-50/80 dark:bg-gray-900/80 py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-16">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-gray-100 mb-4 text-center">
            My Journey
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-center mb-16 max-w-xl mx-auto">
            A timeline of where I've been and what I've built along the way.
          </p>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[2.15rem] md:left-1/2 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700 md:-translate-x-px" />

            <div className="space-y-12 md:space-y-16">
              {journeyItems.map((item, index) => {
                const isLeft = index % 2 === 0;
                const Icon = getInstitutionIcon(item.place);
                const logo = getInstitutionLogo(item.place);
                return (
                  <div key={index} className="relative flex items-start md:items-center">
                    {/* Icon */}
                    <div className="absolute left-6 md:left-1/2 -translate-x-1/2 mt-0.5 md:mt-0 z-10 w-9 h-9 rounded-full bg-teal-600 dark:bg-teal-500 ring-4 ring-white dark:ring-gray-950 flex items-center justify-center">
                      <Icon size={16} className="text-white" />
                    </div>

                    {/* Content */}
                    <div className={`ml-16 md:ml-0 md:w-1/2 ${isLeft ? 'md:pr-16 md:text-right' : 'md:pl-16 md:ml-auto'}`}>
                      <div className={`flex items-center gap-2.5 mb-3 ${isLeft ? 'md:flex-row-reverse' : ''}`}>
                        <span className="inline-block text-xs font-semibold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-2.5 py-1 rounded-full">
                          {item.year}
                        </span>
                        {logo && (
                          <img src={logo.src} alt={item.place} className="h-8 w-auto object-contain mix-blend-multiply dark:brightness-90" />
                        )}
                      </div>
                      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">{item.title}</h3>
                      <p className="text-sm text-teal-700/80 dark:text-teal-400/80 font-medium mb-1">{item.place}</p>
                      {item.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Research — narrative style */}
      <section ref={researchRef} className="snap-section scroll-section min-h-screen py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-16">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-gray-100 mb-4 text-center">
            Research
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-center mb-16 max-w-xl mx-auto">
            My work explores entrepreneurial decision-making, technology innovation, and AI applications in research.
          </p>

          {/* Publications */}
          <div className="mb-14">
            <h3 className="text-xs uppercase tracking-widest text-gray-400 dark:text-gray-500 font-semibold mb-6">Publications</h3>
            <div className="space-y-6">
              {publications.map((p) => (
                <div key={p.id} className="group">
                  <h4 className="text-base font-medium text-gray-900 dark:text-gray-100 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors leading-relaxed">
                    {p.title}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {p.authors} &middot; <em>{p.journal}</em>, {p.date}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Working Papers */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-gray-400 dark:text-gray-500 font-semibold mb-6">Under Review & In Progress</h3>
            <div className="space-y-6">
              {workingPapers.map((p) => (
                <div key={p.id} className="group">
                  <h4 className="text-base font-medium text-gray-900 dark:text-gray-100 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors leading-relaxed">
                    {p.title}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {p.authors}
                    {p.journal && <> &middot; <em>{p.journal}</em></>}
                    <span className="ml-2 text-[11px] text-teal-700/70 dark:text-teal-400/70 bg-teal-50 dark:bg-teal-950 px-2 py-0.5 rounded-full font-medium">
                      {p.status === '2nd_r&r' ? '2nd R&R' : p.status.replace(/_/g, ' ')}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
