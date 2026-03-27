import React from 'react';
import { BookOpen } from 'lucide-react';
import { CMSData } from '../types';
import SEO from '../components/SEO';

interface BookPageProps {
  data: CMSData;
}

const BookPage: React.FC<BookPageProps> = ({ data }) => {
  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-16 py-16 md:py-24">
      <SEO title="Book" description="Published books by Haejun Jung." url="/book" />
      <div className="mb-12 welcome-fade">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-gray-100 mb-4">Book</h1>
      </div>

      <div className="space-y-12 welcome-fade" style={{ animationDelay: '0.1s' }}>
        {data.books.map((book) => (
          <div key={book.id} className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
            {/* Book Cover */}
            <div className="w-full md:w-[280px] flex-shrink-0">
              <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800 rounded-xl overflow-hidden shadow-md">
                {book.image ? (
                  <img src={book.image} alt={book.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-gray-300 dark:text-gray-500">
                    <BookOpen size={40} />
                    <span className="text-sm">Cover</span>
                  </div>
                )}
              </div>
            </div>

            {/* Book Details */}
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-gray-100 mb-3">
                {book.title}
              </h2>
              <div className="space-y-2 mb-6">
                <p className="text-base text-teal-700 dark:text-teal-400 font-medium">
                  {book.publisher}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {book.date}
                </p>
              </div>
              {book.description && (
                <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed mb-6">
                  {book.description}
                </p>
              )}
              <div className="flex flex-wrap gap-3">
                {book.link && (
                  <a
                    href={book.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors"
                  >
                    <BookOpen size={16} />
                    Purchase Book
                  </a>
                )}
                {book.newsLink && (
                  <a
                    href={book.newsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    📰 Press Coverage
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookPage;
