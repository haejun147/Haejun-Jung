
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
        <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-gray-100 mb-4">Research</h1>
      </div>

      {/* Publications */}
      <section className="mb-20 welcome-fade" style={{ animationDelay: '0.1s' }}>
        <h2 className="text-lg font-display font-semibold text-gray-900 dark:text-gray-100 mb-8 pb-3 border-b-2 border-teal-700 dark:border-teal-400">Publications</h2>
        <div className="space-y-8">
          {publications.length === 0 && <p className="text-gray-400 dark:text-gray-500 italic">No publications listed yet.</p>}
          {publications.map((project) => (
            <div key={project.id} className="group pb-8 border-b border-gray-100 dark:border-gray-800 last:border-0">
              <div className="flex justify-between items-start gap-4">
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors leading-snug">
                  {project.title}
                </h3>
                {project.link && project.link !== '#' && (
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-gray-300 dark:text-gray-600 hover:text-teal-700 dark:hover:text-teal-400 mt-0.5 transition-colors flex-shrink-0">
                    <ExternalLink size={16} />
                  </a>
                )}
              </div>
              <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 space-y-0.5">
                <div>{project.authors}</div>
                <div className="italic">{project.journal}, {project.date}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Working Papers */}
      <section className="welcome-fade" style={{ animationDelay: '0.2s' }}>
        <h2 className="text-lg font-display font-semibold text-gray-900 dark:text-gray-100 mb-8 pb-3 border-b-2 border-teal-700 dark:border-teal-400">Under Review & In Progress</h2>
        <div className="space-y-8">
          {workingPapers.length === 0 && <p className="text-gray-400 dark:text-gray-500 italic">No working papers listed yet.</p>}
          {workingPapers.map((project) => (
            <div key={project.id} className="group pb-8 border-b border-gray-100 dark:border-gray-800 last:border-0">
              <div className="flex justify-between items-start gap-4">
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors leading-snug">
                  {project.title}
                </h3>
                {project.link && project.link !== '#' && (
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-gray-300 dark:text-gray-600 hover:text-teal-700 dark:hover:text-teal-400 mt-0.5 transition-colors flex-shrink-0">
                    <ExternalLink size={16} />
                  </a>
                )}
              </div>
              <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 space-y-0.5">
                <div>{project.authors}</div>
                <div className="flex items-center gap-3">
                  <span className="italic">{project.journal || 'Working Paper'}</span>
                  <span className="text-[11px] text-teal-700/80 dark:text-teal-400/80 px-2 py-0.5 border border-teal-700/20 dark:border-teal-400/20 rounded-full bg-teal-50 dark:bg-teal-950">
                    {project.status === '2nd_r&r' ? '2nd R&R' : project.status === '1st_r&r' ? '1st R&R' : project.status.replace(/_/g, ' ')}
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
