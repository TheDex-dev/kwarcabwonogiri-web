'use client';

export default function EventsLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container-custom pt-24 pb-16">
        {children}
      </div>
    </div>
  );
}