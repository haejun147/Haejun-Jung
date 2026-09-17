
import React, { useState } from 'react';
import { Download, ChevronDown, ChevronUp } from 'lucide-react';
import { CMSData } from '../types';

interface CVProps {
  data: CMSData;
}

const CV: React.FC<CVProps> = ({ data }) => {
  const [showPdf, setShowPdf] = useState(true);

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

    </div>
  );
};

export default CV;
