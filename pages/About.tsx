
import React from 'react';
import { CMSData } from '../types';

interface AboutProps {
  data: CMSData;
}

const About: React.FC<AboutProps> = ({ data }) => {
  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-24 md:py-40 relative">
      <div className="flex flex-col md:flex-row items-center gap-16 md:gap-32">
        {/* Headshot with sophisticated masking */}
        <div className="w-full md:w-2/5 welcome-fade" style={{ animationDelay: '0.2s' }}>
          <div className="relative group">
            <div className="absolute inset-0 bg-emerald-500/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
            <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-zinc-900 border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)] relative z-10">
              <img 
                src={data.personalInfo.headshot} 
                alt={data.personalInfo.name}
                className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000 ease-in-out scale-105 group-hover:scale-100"
              />
            </div>
          </div>
        </div>

        {/* Bio Side */}
        <div className="flex-1 text-center md:text-left welcome-fade">
          <h1 className="text-7xl md:text-9xl font-display font-extrabold text-white leading-tight mb-8 tracking-tighter">
            <span className="text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">Welcome!</span>
          </h1>
          <p className="text-xl md:text-2xl text-zinc-300 leading-relaxed font-light max-w-2xl mx-auto md:mx-0">
            {data.personalInfo.bio}
          </p>
          <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center md:justify-start">
             <div className="text-xs uppercase tracking-[0.3em] font-bold text-zinc-500">
               {data.personalInfo.role}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
