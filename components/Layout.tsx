
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, Linkedin, Mail } from 'lucide-react';
import { CMSData } from '../types';
import ThemeToggle from './ThemeToggle';

interface LayoutProps {
  children: React.ReactNode;
  data: CMSData;
}

const Layout: React.FC<LayoutProps> = ({ children, data }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const navItems = [
    { name: 'About', path: '/' },
    { name: 'Book', path: '/book' },
    { name: 'CV', path: '/cv' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-16">
          <div className="flex justify-between h-24">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-display font-bold text-gray-900 dark:text-gray-100 hover:text-teal-700 dark:hover:text-teal-400 transition-colors">
                {data.personalInfo.name}
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-12">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `text-[17px] transition-colors hover:text-teal-700 dark:hover:text-teal-400 ${
                      isActive ? 'text-teal-700 dark:text-teal-400 font-medium' : 'text-gray-500 dark:text-gray-400'
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
              <ThemeToggle />
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-2">
              <ThemeToggle />
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800">
            <div className="px-6 pt-2 pb-6 space-y-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block text-base ${
                      isActive ? 'text-teal-700 dark:text-teal-400 font-medium' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="pt-24">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 dark:border-gray-800 py-10">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-16">
          <div className="flex flex-col items-center gap-4">
            <div className="flex space-x-5">
              <a href={data.personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 dark:text-gray-500 hover:text-teal-700 dark:hover:text-teal-400 transition-colors">
                <Linkedin size={18} />
              </a>
              <a href={`mailto:${data.personalInfo.email}`} className="text-gray-400 dark:text-gray-500 hover:text-teal-700 dark:hover:text-teal-400 transition-colors">
                <Mail size={18} />
              </a>
            </div>
            <div className="text-gray-400 dark:text-gray-500 text-xs">
              &copy; {new Date().getFullYear()} {data.personalInfo.name}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
