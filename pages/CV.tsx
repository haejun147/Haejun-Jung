
import React, { useState } from 'react';
import { Briefcase, GraduationCap, Calendar, Download, ChevronDown, ChevronUp } from 'lucide-react';
import { CMSData } from '../types';

interface CVProps {
  data: CMSData;
}

const CV: React.FC<CVProps> = ({ data }) => {
  const [showPdf, setShowPdf] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-6 sm:px-8 py-16 md:py-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-2">Curriculum Vitae</h1>
          <p className="text-gray-500 text-sm">Education and professional experience.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowPdf(!showPdf)}
            className="flex items-center px-5 py-2.5 border border-gray-200 text-gray-700 text-xs font-medium tracking-wide hover:border-teal-700 hover:text-teal-700 transition-colors rounded-lg"
          >
            {showPdf ? 'Hide' : 'View'} PDF
            {showPdf ? <ChevronUp size={14} className="ml-1.5" /> : <ChevronDown size={14} className="ml-1.5" />}
          </button>
          <a
            href={data.personalInfo.cvUrl}
            download
            className="flex items-center px-5 py-2.5 bg-gray-900 text-white text-xs font-medium tracking-wide hover:bg-teal-700 transition-colors rounded-lg"
          >
            Download <Download size={14} className="ml-2" />
          </a>
        </div>
      </div>

      {/* PDF Viewer — toggle, full page width, no sidebar */}
      {showPdf && data.personalInfo.cvUrl && data.personalInfo.cvUrl !== '#' && (
        <div className="mb-16 border border-gray-100 rounded-xl overflow-hidden">
          <iframe
            src={`${data.personalInfo.cvUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
            className="w-full h-[85vh]"
            title="CV PDF"
          />
        </div>
      )}

      {/* Experience Section */}
      <section className="mb-16 welcome-fade">
        <div className="flex items-center space-x-3 mb-8">
          <Briefcase className="text-teal-700" size={18} />
          <h2 className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Experience</h2>
        </div>

        <div className="space-y-10">
          {data.cv.experience.map((item) => (
            <div key={item.id} className="group pl-6 border-l-2 border-gray-100 hover:border-teal-700/40 transition-colors">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-1.5">
                <h3 className="text-base font-semibold text-gray-900">{item.title}</h3>
                <span className="text-gray-400 text-xs mt-1 md:mt-0 flex items-center flex-shrink-0">
                  <Calendar size={12} className="mr-1.5" /> {item.period}
                </span>
              </div>
              <p className="text-teal-700 text-sm font-medium mb-2">{item.institution}</p>
              {item.description && (
                <p className="text-gray-500 text-sm leading-relaxed">
                  {item.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Education Section */}
      <section className="welcome-fade" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center space-x-3 mb-8">
          <GraduationCap className="text-teal-700" size={18} />
          <h2 className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Education</h2>
        </div>

        <div className="space-y-10">
          {data.cv.education.map((item) => (
            <div key={item.id} className="group pl-6 border-l-2 border-gray-100 hover:border-teal-700/40 transition-colors">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-1.5">
                <h3 className="text-base font-semibold text-gray-900">{item.title}</h3>
                <span className="text-gray-400 text-xs mt-1 md:mt-0 flex items-center flex-shrink-0">
                  <Calendar size={12} className="mr-1.5" /> {item.period}
                </span>
              </div>
              <p className="text-teal-700 text-sm font-medium mb-2">{item.institution}</p>
              {item.description && (
                <p className="text-gray-500 text-sm leading-relaxed">
                  {item.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CV;
