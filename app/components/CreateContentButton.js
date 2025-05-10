'use client';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function CreateContentButton({ eventType }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  // Only show the button if user is logged in as admin
  if (!user) return null;

  const handleContentTypeSelect = (type) => {
    setIsDropdownOpen(false);
    if (type === 'article') {
      router.push('/editor/article');
    } else {
      router.push('/editor/event');
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="bg-primary hover:bg-primary-dark text-white p-4 rounded-full shadow-lg transition-transform hover:scale-105"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>

        {isDropdownOpen && (
          <div className="absolute bottom-16 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <button
              onClick={() => handleContentTypeSelect('event')}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Create Event
            </button>
            <button
              onClick={() => handleContentTypeSelect('article')}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Create Article
            </button>
          </div>
        )}
      </div>
    </>
  );
}