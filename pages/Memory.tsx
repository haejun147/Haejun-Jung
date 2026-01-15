
import React from 'react';
import { Calendar } from 'lucide-react';
import { CMSData } from '../types';

interface MemoryProps {
  data: CMSData;
}

const Memory: React.FC<MemoryProps> = ({ data }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="mb-20">
        <h1 className="text-4xl font-display font-bold text-white mb-4">Memory</h1>
        <div className="h-1 w-20 bg-emerald-500 mb-6"></div>
        <p className="text-zinc-400 max-w-2xl text-base">
          Moments and updates from the scientific journey.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {data.memories.map((post) => (
          <div key={post.id} className="group border border-white/5 rounded-lg overflow-hidden bg-zinc-900/30 transition-all hover:border-emerald-500/20">
            <div className="relative overflow-hidden aspect-[4/3]">
              <img 
                src={post.imageUrl} 
                alt={post.title} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 grayscale hover:grayscale-0"
              />
            </div>
            <div className="p-8">
              <div className="flex items-center text-zinc-600 text-[10px] font-bold uppercase tracking-widest mb-4">
                <Calendar size={10} className="mr-2 text-emerald-500" /> {post.date}
              </div>
              <h3 className="text-lg font-bold text-white mb-4 group-hover:text-emerald-500 transition-colors">
                {post.title}
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
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
