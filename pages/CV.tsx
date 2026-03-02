
import React, { useState } from 'react';
import { GraduationCap, TrendingUp, Rocket, Download, ChevronDown, ChevronUp, type LucideIcon } from 'lucide-react';
import { CMSData } from '../types';

function getInstitutionIcon(place: string): LucideIcon {
  const p = place.toLowerCase();
  if (p.includes('kaist')) return GraduationCap;
  if (p.includes('hgu') || p.includes('handong')) return GraduationCap;
  if (p.includes('mit') || p.includes('massachusetts')) return GraduationCap;
  if (p.includes('flat') || p.includes('music')) return Rocket;
  if (p.includes('bluepoint')) return TrendingUp;
  return GraduationCap;
}

interface CVProps {
  data: CMSData;
}

const CV: React.FC<CVProps> = ({ data }) => {
  const [showPdf, setShowPdf] = useState(false);

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

  return (
    <div className="max-w-4xl mx-auto px-6 sm:px-8 py-16 md:py-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-gray-100 mb-2">Curriculum Vitae</h1>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowPdf(!showPdf)}
            className="flex items-center px-5 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium tracking-wide hover:border-teal-700 dark:hover:border-teal-400 hover:text-teal-700 dark:hover:text-teal-400 transition-colors rounded-lg"
          >
            {showPdf ? 'Hide' : 'View'} PDF
            {showPdf ? <ChevronUp size={14} className="ml-1.5" /> : <ChevronDown size={14} className="ml-1.5" />}
          </button>
          <a
            href={data.personalInfo.cvUrl}
            download
            className="flex items-center px-5 py-2.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs font-medium tracking-wide hover:bg-teal-700 dark:hover:bg-teal-400 transition-colors rounded-lg"
          >
            Download <Download size={14} className="ml-2" />
          </a>
        </div>
      </div>

      {/* PDF Viewer — toggle, full page width, no sidebar */}
      {showPdf && data.personalInfo.cvUrl && data.personalInfo.cvUrl !== '#' && (
        <div className="mb-16 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
          <iframe
            src={`${data.personalInfo.cvUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
            className="w-full h-[85vh]"
            title="CV PDF"
          />
        </div>
      )}

      {/* Journey Timeline */}
      <section className="welcome-fade">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-gray-100 mb-4 text-center">
          My Journey
        </h2>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[2.15rem] md:left-1/2 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700 md:-translate-x-px" />

          <div className="space-y-12 md:space-y-16">
            {journeyItems.map((item, index) => {
              const isLeft = index % 2 === 0;
              const Icon = getInstitutionIcon(item.place);
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
      </section>
    </div>
  );
};

export default CV;
