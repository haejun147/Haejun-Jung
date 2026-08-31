
import React from 'react';
import { Linkedin, Mail } from 'lucide-react';
import { CMSData } from '../types';

interface AboutProps {
  data: CMSData;
}

const About: React.FC<AboutProps> = ({ data }) => {
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

        </div>
      </section>
    </div>
  );
};

export default About;
