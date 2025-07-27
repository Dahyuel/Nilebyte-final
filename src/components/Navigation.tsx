import React, { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../styles/animations.css';

// Add custom styles for the logo
const logoStyles = {
  gradient: {
    background: 'linear-gradient(45deg, #0052D4, #4364F7, #6FB1FC, #0052D4, #4364F7)',
    backgroundSize: '300% 300%',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    animation: 'gradient-shift 2.5s ease infinite'
  }
};

const Navigation = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'faq', label: 'FAQ' },
    { id: 'contact', label: 'Contact' }
  ];

  const scrollToSection = (sectionId: string) => {
    setShowMobileMenu(false);
    
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToHome = () => {
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById('home');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return;
    }

    const element = document.getElementById('home');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => ({
        id: item.id,
        element: document.getElementById(item.id)
      }));

      const current = sections.find(section => {
        if (section.element) {
          const rect = section.element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });

      if (current) {
        setActiveSection(current.id);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-black/30 backdrop-blur-xl border border-white/5 rounded-full hover-glow w-full max-w-sm md:max-w-fit px-4 md:px-6 mx-4 md:mx-0">
      <div className="flex items-center justify-between h-16 w-full">
        {/* Logo (left) */}
        <div className="flex flex-shrink-0 items-end pb-1">
          <button onClick={scrollToHome} className="flex items-center mt-1">
            <img 
              src="/trans logo.png" 
              alt="NileByte Logo" 
              className="h-14 md:h-12 lg:h-14 xl:h-16 w-auto"
            />
          </button>
        </div>

        {/* Desktop Nav Items - Show on large screens */}
        <div className="hidden xl:flex items-center space-x-6 ml-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`relative px-4 py-2 text-sm font-light tracking-wide transition-all duration-300 rounded-lg whitespace-nowrap ${
                activeSection === item.id
                  ? 'text-blue-400 bg-blue-400/10'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Tablet Nav Items - Responsive scaling from large to mobile */}
        <div className="hidden sm:flex xl:hidden items-center space-x-1 sm:space-x-2 md:space-x-3 lg:space-x-4 xl:space-x-5 ml-2 sm:ml-3 md:ml-4 lg:ml-6 xl:ml-7">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`relative px-1.5 sm:px-2 md:px-2.5 lg:px-3 xl:px-3.5 py-1 sm:py-1.5 md:py-2 text-xs font-light tracking-wide transition-all duration-300 rounded-lg whitespace-nowrap ${
                activeSection === item.id
                  ? 'text-blue-400 bg-blue-400/10'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Mobile Menu Button (right) */}
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="sm:hidden p-2 text-gray-300 hover:text-white transition-colors duration-200"
        >
          {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu - Fixed positioning and better styling */}
      {showMobileMenu && (
        <div className="sm:hidden absolute top-full left-0 right-0 mt-2 bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl overflow-hidden">
          <div className="flex flex-col py-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  scrollToSection(item.id);
                  setShowMobileMenu(false);
                }}
                className={`w-full text-left px-6 py-3 text-sm font-light tracking-wide transition-all duration-300 ${
                  activeSection === item.id
                    ? 'text-blue-400 bg-blue-400/10'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;