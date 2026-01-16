
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
    { name: 'Memory', path: '/memory' },
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30">
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 md:h-20">
            <div className="flex items-center">
              <Link to="/" className="text-lg font-display font-bold hover:text-emerald-500 transition-colors tracking-tighter">
                {data.personalInfo.name.toUpperCase()}
              </Link>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-10">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `text-[10px] uppercase tracking-widest font-bold transition-colors hover:text-emerald-500 ${
                      isActive ? 'text-emerald-500' : 'text-gray-400'
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
                className="text-gray-400 hover:text-white"
              >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-black border-b border-white/5">
            <div className="px-4 pt-2 pb-6 space-y-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block text-xs font-bold tracking-widest uppercase ${
                      isActive ? 'text-emerald-500' : 'text-gray-400 hover:text-white'
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
      <main className="pt-16 md:pt-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-black border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-4">
            <div className="flex space-x-6">
              <a href={data.personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-emerald-500 transition-colors">
                <Linkedin size={18} />
              </a>
              <a href={`mailto:${data.personalInfo.email}`} className="text-gray-500 hover:text-emerald-500 transition-colors">
                <Mail size={18} />
              </a>
            </div>
            
            <div className="text-gray-600 text-[9px] uppercase tracking-[0.2em]">
              &copy; {new Date().getFullYear()} {data.personalInfo.name}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
