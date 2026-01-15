
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { CMSData } from '../types';

interface ResearchProps {
  data: CMSData;
}

const Research: React.FC<ResearchProps> = ({ data }) => {
  const publications = data.research.filter(r => r.status === 'publication');
  const workingPapers = data.research.filter(r => r.status !== 'publication');

  // Modern accent color: #2DD4BF (Mint Teal)
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="mb-20">
        <h1 className="text-4xl font-display font-bold text-white mb-4">Research</h1>
        <div className="h-1 w-20 bg-[#2DD4BF]"></div>
      </div>

      {/* Publications */}
      <section className="mb-24">
        <h2 className="text-xs uppercase tracking-[0.3em] text-[#2DD4BF] font-bold mb-10">Selected Publications</h2>
        <div className="space-y-12">
          {publications.length === 0 && <p className="text-zinc-500 italic">No publications listed yet.</p>}
          {publications.map((project) => (
            <div key={project.id} className="group border-b border-white/5 pb-10">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-start gap-4">
                  <h3 className="text-xl font-bold text-white group-hover:text-[#2DD4BF] transition-all duration-300">
                    {project.title}
                  </h3>
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-[#2DD4BF] hover:text-[#5EEAD4] mt-1 transition-colors">
                      <ExternalLink size={18} />
                    </a>
                  )}
                </div>
                {/* Author moved to metadata section (gray) */}
                <div className="flex flex-col text-zinc-500 text-sm gap-1">
                   <div className="font-medium">{project.authors}</div>
                   <div className="italic">{project.journal} ({project.date})</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Working Papers / Others */}
      <section>
        <h2 className="text-xs uppercase tracking-[0.3em] text-[#2DD4BF] font-bold mb-10">Working Papers & Others</h2>
        <div className="space-y-12">
          {workingPapers.length === 0 && <p className="text-zinc-500 italic">No working papers listed yet.</p>}
          {workingPapers.map((project) => (
            <div key={project.id} className="group border-b border-white/5 pb-10">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-start gap-4">
                  <h3 className="text-xl font-bold text-white group-hover:text-[#2DD4BF] transition-all duration-300">
                    {project.title}
                  </h3>
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-[#2DD4BF] hover:text-[#5EEAD4] mt-1 transition-colors">
                      <ExternalLink size={18} />
                    </a>
                  )}
                </div>
                {/* Author moved to metadata section (gray) */}
                <div className="flex flex-col text-zinc-500 text-sm gap-2">
                   <div className="font-medium">{project.authors}</div>
                   <div className="flex items-center gap-4">
                    <span className="italic">{project.journal || "Working Paper"}</span>
                    <span className="text-[10px] uppercase tracking-widest text-[#2DD4BF]/80 px-2 py-0.5 border border-[#2DD4BF]/20 rounded bg-[#2DD4BF]/5">
                      {project.status.replace('_', ' ')}
                    </span>
                  </div>
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
