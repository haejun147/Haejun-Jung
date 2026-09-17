
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
      <section aria-labelledby="about-name" className="snap-section pt-8 md:pt-12">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 welcome-fade">
          <div className="overflow-hidden rounded-2xl md:rounded-3xl bg-[#FAF9F6] dark:ring-1 dark:ring-white/10">
            <img
              src="/journey-hero.png"
              alt="A watercolor journey through Qingdao, Pohang, Daejeon, Seoul, and Boston, with a naval ship representing Navy service."
              className="block w-full h-auto dark:brightness-90"
              fetchPriority="high"
            />
          </div>

          {/* Name */}
          <div className="text-center pt-8 md:pt-10 pb-10 md:pb-14">
            <h1 id="about-name" className="text-4xl md:text-[3.4rem] font-display font-bold text-gray-900 dark:text-gray-100 mb-4 leading-tight">
              {data.personalInfo.name}
            </h1>
          </div>
        </div>
      </section>

      {/* Photo + Bio */}
      <section aria-label="About me" className="snap-section">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-16 pt-4 md:pt-8 pb-16 md:pb-24">
          <div className="flex flex-col md:flex-row gap-10 md:gap-14 items-stretch">
            <div data-analytics-section="about_profile" className="w-full md:w-[32%] flex-shrink-0">
              <div className="aspect-[3/4] overflow-hidden rounded-2xl group cursor-pointer relative">
                <img
                  src={data.personalInfo.headshot}
                  alt={data.personalInfo.name}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>

            <div data-analytics-section="about_bio" className="flex-1 flex flex-col justify-center">
              <div className="text-gray-600 dark:text-gray-300 text-base md:text-lg leading-[1.85]">
                <p>{data.personalInfo.bio}</p>
              </div>

              <div className="mt-8 flex items-center gap-5">
                <a data-analytics-click="about_linkedin" href={data.personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 dark:text-gray-500 hover:text-teal-700 dark:hover:text-teal-400 transition-colors">
                  <Linkedin size={20} />
                </a>
                <a data-analytics-click="about_email" href={`mailto:${data.personalInfo.email}`} className="text-gray-400 dark:text-gray-500 hover:text-teal-700 dark:hover:text-teal-400 transition-colors">
                  <Mail size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
