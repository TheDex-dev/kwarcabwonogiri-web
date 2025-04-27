'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-black/50 backdrop-blur-sm' : 'bg-transparent'
    }`}>
      <div className="max-w-4xl mx-auto px-4 py-4">
        <ul className="flex justify-center space-x-8">
          <li>
            <Link href="/" className="hover:text-gray-600 border-b border-transparent hover:border-gray-600 transition-all">
              Home
            </Link>
          </li>
          <li>
            <Link href="/news" className="hover:text-gray-600 border-b border-transparent hover:border-gray-600 transition-all">
              Berita
            </Link>
          </li>
          <li>
            <Link href="/profile" className="hover:text-gray-600 border-b border-transparent hover:border-gray-600 transition-all">
              Profil
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}