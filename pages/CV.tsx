
import React from 'react';
import { Briefcase, GraduationCap, Calendar, Download } from 'lucide-react';
import { CMSData } from '../types';

interface CVProps {
  data: CMSData;
}

const CV: React.FC<CVProps> = ({ data }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
        <div>
          <h1 className="text-4xl font-display font-bold text-white mb-4">Curriculum Vitae</h1>
          <div className="h-1 w-20 bg-[#2DD4BF]"></div>
        </div>
        <a 
          href={data.personalInfo.cvUrl} 
          className="flex items-center px-6 py-3 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-[#2DD4BF] hover:text-white transition-all rounded shadow-lg shadow-[#2DD4BF]/10"
        >
          Download Full CV <Download size={14} className="ml-2" />
        </a>
      </div>

      {/* Experience Section */}
      <section className="mb-20">
        <div className="flex items-center space-x-4 mb-12">
          <Briefcase className="text-[#2DD4BF]" size={20} />
          <h2 className="text-lg font-bold uppercase tracking-widest text-white">Experience</h2>
        </div>
        
        <div className="space-y-16">
          {data.cv.experience.map((item) => (
            <div key={item.id} className="group">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                <h3 className="text-xl font-bold text-white group-hover:text-[#2DD4BF] transition-all duration-300">{item.title}</h3>
                <span className="text-zinc-500 text-xs font-mono mt-2 md:mt-0 flex items-center">
                  <Calendar size={12} className="mr-2" /> {item.period}
                </span>
              </div>
              <p className="text-[#2DD4BF]/80 text-sm font-bold uppercase tracking-widest mb-4">{item.institution}</p>
              <p className="text-zinc-400 text-sm leading-relaxed max-w-3xl">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Education Section */}
      <section>
        <div className="flex items-center space-x-4 mb-12">
          <GraduationCap className="text-[#2DD4BF]" size={20} />
          <h2 className="text-lg font-bold uppercase tracking-widest text-white">Education</h2>
        </div>
        
        <div className="space-y-16">
          {data.cv.education.map((item) => (
            <div key={item.id} className="group">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                <h3 className="text-xl font-bold text-white group-hover:text-[#2DD4BF] transition-all duration-300">{item.title}</h3>
                <span className="text-zinc-500 text-xs font-mono mt-2 md:mt-0 flex items-center">
                  <Calendar size={12} className="mr-2" /> {item.period}
                </span>
              </div>
              <p className="text-[#2DD4BF]/80 text-sm font-bold uppercase tracking-widest mb-4">{item.institution}</p>
              <p className="text-zinc-400 text-sm leading-relaxed max-w-3xl">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CV;
