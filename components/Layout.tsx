
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, Linkedin, Mail } from 'lucide-react';
import { CMSData } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  data: CMSData;
}

const Layout: React.FC<LayoutProps> = ({ children, data }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const navItems = [
    { name: 'About', path: '/' },
    { name: 'Research', path: '/research' },
    { name: 'CV', path: '/cv' },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 sm:px-8">
          <div className="flex justify-between h-24">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-display font-bold text-gray-900 hover:text-teal-700 transition-colors">
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
                    `text-[17px] transition-colors hover:text-teal-700 ${
                      isActive ? 'text-teal-700 font-medium' : 'text-gray-500'
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-500 hover:text-gray-900"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white border-b border-gray-100">
            <div className="px-6 pt-2 pb-6 space-y-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block text-base ${
                      isActive ? 'text-teal-700 font-medium' : 'text-gray-500 hover:text-gray-900'
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
      <footer className="border-t border-gray-100 py-10">
        <div className="max-w-5xl mx-auto px-6 sm:px-8">
          <div className="flex flex-col items-center gap-4">
            <div className="flex space-x-5">
              <a href={data.personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-teal-700 transition-colors">
                <Linkedin size={18} />
              </a>
              <a href={`mailto:${data.personalInfo.email}`} className="text-gray-400 hover:text-teal-700 transition-colors">
                <Mail size={18} />
              </a>
            </div>
            <div className="text-gray-400 text-xs">
              &copy; {new Date().getFullYear()} {data.personalInfo.name}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
