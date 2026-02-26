
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { CMSData } from '../types';

interface ResearchProps {
  data: CMSData;
}

const Research: React.FC<ResearchProps> = ({ data }) => {
  const publications = data.research.filter(r => r.status === 'publication');
  const workingPapers = data.research.filter(r => r.status !== 'publication');

  return (
    <div className="max-w-3xl mx-auto px-6 sm:px-8 py-16 md:py-24">
      <div className="mb-16 welcome-fade">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">Research</h1>
        <p className="text-gray-500 text-base leading-relaxed max-w-2xl">
          My research examines entrepreneurial decision-making, technology innovation, and the application of AI in research methodology.
        </p>
      </div>

      {/* Publications */}
      <section className="mb-20 welcome-fade" style={{ animationDelay: '0.1s' }}>
        <h2 className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-8">Publications</h2>
        <div className="space-y-8">
          {publications.length === 0 && <p className="text-gray-400 italic">No publications listed yet.</p>}
          {publications.map((project) => (
            <div key={project.id} className="group pb-8 border-b border-gray-100 last:border-0">
              <div className="flex justify-between items-start gap-4">
                <h3 className="text-base font-semibold text-gray-900 group-hover:text-teal-700 transition-colors leading-snug">
                  {project.title}
                </h3>
                {project.link && project.link !== '#' && (
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-teal-700 mt-0.5 transition-colors flex-shrink-0">
                    <ExternalLink size={16} />
                  </a>
                )}
              </div>
              <div className="mt-2 text-sm text-gray-500 space-y-0.5">
                <div>{project.authors}</div>
                <div className="italic">{project.journal}, {project.date}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Working Papers */}
      <section className="welcome-fade" style={{ animationDelay: '0.2s' }}>
        <h2 className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-8">Under Review & In Progress</h2>
        <div className="space-y-8">
          {workingPapers.length === 0 && <p className="text-gray-400 italic">No working papers listed yet.</p>}
          {workingPapers.map((project) => (
            <div key={project.id} className="group pb-8 border-b border-gray-100 last:border-0">
              <div className="flex justify-between items-start gap-4">
                <h3 className="text-base font-semibold text-gray-900 group-hover:text-teal-700 transition-colors leading-snug">
                  {project.title}
                </h3>
                {project.link && project.link !== '#' && (
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-teal-700 mt-0.5 transition-colors flex-shrink-0">
                    <ExternalLink size={16} />
                  </a>
                )}
              </div>
              <div className="mt-2 text-sm text-gray-500 space-y-0.5">
                <div>{project.authors}</div>
                <div className="flex items-center gap-3">
                  <span className="italic">{project.journal || 'Working Paper'}</span>
                  <span className="text-[11px] text-teal-700/80 px-2 py-0.5 border border-teal-700/20 rounded-full bg-teal-50">
                    {project.status === '2nd_r&r' ? '2nd R&R' : project.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Research;
