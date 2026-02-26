
import React from 'react';
import { Linkedin, Mail } from 'lucide-react';
import { CMSData } from '../types';

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

  return (
    <div>
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-6 sm:px-8 py-16 md:py-28">
        <div className="welcome-fade">
          {/* Name + Role — centered */}
          <div className="text-center mb-14 md:mb-20">
            <h1 className="text-4xl md:text-[3.4rem] font-display font-bold text-gray-900 mb-4 leading-tight">
              {data.personalInfo.name}
            </h1>
            <p className="text-lg md:text-xl text-teal-700 font-medium">
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
              <div className="text-gray-600 text-base md:text-lg leading-[1.85]">
                <p>{data.personalInfo.bio}</p>
              </div>

              {/* Social links */}
              <div className="mt-8 flex items-center gap-5">
                <a href={data.personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-teal-700 transition-colors">
                  <Linkedin size={20} />
                </a>
                <a href={`mailto:${data.personalInfo.email}`} className="text-gray-400 hover:text-teal-700 transition-colors">
                  <Mail size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="bg-gray-50/80 py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-4 text-center">
            My Journey
          </h2>
          <p className="text-gray-500 text-center mb-16 max-w-xl mx-auto">
            A timeline of where I've been and what I've built along the way.
          </p>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gray-200 md:-translate-x-px" />

            <div className="space-y-12 md:space-y-16">
              {journeyItems.map((item, index) => {
                const isLeft = index % 2 === 0;
                return (
                  <div key={index} className="relative flex items-start md:items-center">
                    {/* Dot */}
                    <div className="absolute left-6 md:left-1/2 w-3 h-3 bg-teal-600 rounded-full -translate-x-1.5 md:-translate-x-1.5 mt-1.5 md:mt-0 z-10 ring-4 ring-white" />

                    {/* Content */}
                    <div className={`ml-14 md:ml-0 md:w-1/2 ${isLeft ? 'md:pr-16 md:text-right' : 'md:pl-16 md:ml-auto'}`}>
                      <span className="inline-block text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full mb-2">
                        {item.year}
                      </span>
                      <h3 className="text-base font-semibold text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-sm text-teal-700/80 font-medium mb-1">{item.place}</p>
                      {item.description && (
                        <p className="text-sm text-gray-500">{item.description}</p>
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
      <section className="py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-6 sm:px-8">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-4 text-center">
            Research
          </h2>
          <p className="text-gray-500 text-center mb-16 max-w-xl mx-auto">
            My work explores entrepreneurial decision-making, technology innovation, and AI applications in research.
          </p>

          {/* Publications */}
          <div className="mb-14">
            <h3 className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-6">Publications</h3>
            <div className="space-y-6">
              {publications.map((p) => (
                <div key={p.id} className="group">
                  <h4 className="text-base font-medium text-gray-900 group-hover:text-teal-700 transition-colors leading-relaxed">
                    {p.title}
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">
                    {p.authors} &middot; <em>{p.journal}</em>, {p.date}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Working Papers */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-6">Under Review & In Progress</h3>
            <div className="space-y-6">
              {workingPapers.map((p) => (
                <div key={p.id} className="group">
                  <h4 className="text-base font-medium text-gray-900 group-hover:text-teal-700 transition-colors leading-relaxed">
                    {p.title}
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">
                    {p.authors}
                    {p.journal && <> &middot; <em>{p.journal}</em></>}
                    <span className="ml-2 text-[11px] text-teal-700/70 bg-teal-50 px-2 py-0.5 rounded-full font-medium">
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
