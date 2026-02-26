
import React from 'react';
import { Calendar } from 'lucide-react';
import { CMSData } from '../types';

interface MemoryProps {
  data: CMSData;
}

const Memory: React.FC<MemoryProps> = ({ data }) => {
  return (
    <div className="max-w-5xl mx-auto px-6 sm:px-8 py-16 md:py-24">
      <div className="mb-16 welcome-fade">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">Memory</h1>
        <p className="text-gray-500 text-base">
          Moments and updates from the scientific journey.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 welcome-fade" style={{ animationDelay: '0.1s' }}>
        {data.memories.map((post) => (
          <div key={post.id} className="group rounded-xl overflow-hidden border border-gray-100 hover:border-gray-200 transition-all hover:shadow-lg hover:shadow-gray-100">
            <div className="relative overflow-hidden aspect-[4/3]">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center text-gray-400 text-xs mb-3">
                <Calendar size={12} className="mr-1.5" /> {post.date}
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2 group-hover:text-teal-700 transition-colors">
                {post.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {post.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Memory;
