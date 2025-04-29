'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      // No need to redirect, AuthContext will handle the state
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-lg border-b border-gray-200 dark:border-gray-800' 
        : 'bg-black/30 backdrop-blur-sm'
    }`}>
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className={`text-2xl font-bold tracking-tight transition-colors ${
            isScrolled ? 'text-gray-900 dark:text-white' : 'text-white'
          }`}>
            Kwarcab
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              isScrolled ? 'text-gray-600 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800' : 'text-white hover:bg-white/10'
            }`}
          >
            <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12"></path>
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              )}
            </svg>
          </button>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink href="/" text="Beranda" isScrolled={isScrolled} />
            <NavLink href="/news" text="Berita" isScrolled={isScrolled} />
            <NavLink href="/profile" text="Profil" isScrolled={isScrolled} />
            {user ? (
              <button
                onClick={handleLogout}
                className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                  isScrolled
                    ? 'border-primary text-primary hover:bg-primary hover:text-white'
                    : 'border-white text-white hover:bg-white hover:text-gray-900'
                }`}
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                  isScrolled
                    ? 'border-primary text-primary hover:bg-primary hover:text-white'
                    : 'border-white text-white hover:bg-white hover:text-gray-900'
                }`}
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden transition-all duration-300 ${
          isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}>
          <div className={`mx-2 mb-2 p-4 rounded-lg shadow-lg border ${
            isScrolled 
              ? 'bg-white/95 dark:bg-gray-800/95 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700' 
              : 'bg-black/80 backdrop-blur-md text-white border-gray-700'
          }`}>
            <div className="space-y-3">
              <MobileNavLink href="/" text="Beranda" onClick={() => setIsMenuOpen(false)} />
              <MobileNavLink href="/news" text="Berita" onClick={() => setIsMenuOpen(false)} />
              <MobileNavLink href="/profile" text="Profil" onClick={() => setIsMenuOpen(false)} />
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                {user ? (
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-lg hover:bg-white/10 rounded transition-colors"
                  >
                    Logout
                  </button>
                ) : (
                  <MobileNavLink href="/login" text="Login" onClick={() => setIsMenuOpen(false)} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, text, isScrolled }) {
  return (
    <Link
      href={href}
      className={`transition-colors relative group ${
        isScrolled ? 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white' 
        : 'text-gray-200 hover:text-white'
      }`}
    >
      {text}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
    </Link>
  );
}

function MobileNavLink({ href, text, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block px-4 py-2 text-lg hover:bg-white/10 rounded transition-colors"
    >
      {text}
    </Link>
  );
}