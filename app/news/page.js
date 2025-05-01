'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getAllArticles } from '../firebase/articles';

export default function NewsPage() {
  const [articles, setArticles] = useState([]);
  const [filter, setFilter] = useState('Terbaru');
  const [displayCount, setDisplayCount] = useState(4);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await getAllArticles();
        setArticles(data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchArticles();
  }, []);

  const getFilteredArticles = () => {
    let filtered = [...articles];
    switch (filter) {
      case 'Kegiatan':
      case 'Berita':
        return filtered.filter(article => article.category === filter);
      case 'Populer':
        return filtered.sort((a, b) => parseInt(b.readTime) - parseInt(a.readTime));
      default: // Terbaru
        return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
  };

  const filteredArticles = getFilteredArticles();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      {/* Background Images */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/background/lightmode-blob.svg"
          alt="Background Light"
          fill
          className="object-cover block dark:hidden transition-all duration-300"
        />
        <Image
          src="/background/darkmode-blob.svg"
          alt="Background Dark"
          fill
          className="object-cover hidden dark:block transition-all duration-300"
        />
      </div>

      <main className="max-w-4xl mx-auto px-4 pt-24 pb-12 relative z-10">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 dark:text-white">Latest News</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">Stay informed with our latest updates and activities</p>
        </div>

        {/* Filters */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6 dark:text-white">Filter Articles</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Terbaru', 'Populer', 'Kegiatan', 'Berita'].map((filterName) => (
              <div 
                key={filterName} 
                onClick={() => setFilter(filterName)}
                className={`${
                  filter === filterName 
                    ? 'bg-blue-100 dark:bg-blue-900' 
                    : 'bg-gray-100 dark:bg-gray-700'
                } rounded-lg p-4 text-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors`}
              >
                <span className="font-medium dark:text-white">{filterName}</span>
              </div>
            ))}
          </div>
        </section>

        {/* News Articles Grid */}
        <section className="mb-16">
          {filteredArticles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-300">No articles found.</p>
            </div>
          ) : (
            <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {filteredArticles.slice(0, displayCount).map((article) => (
                <Link href={`/news/content/${article.id}`} key={article.id}>
                  <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 transition-transform hover:-translate-y-1">
                    <div className="mb-4">
                      <span className={`text-sm ${
                        article.category === 'Kegiatan' ? 'text-blue-600 dark:text-blue-400' :
                        article.category === 'Berita' ? 'text-green-600 dark:text-green-400' :
                        'text-orange-600 dark:text-orange-400'
                      }`}>{article.category}</span>
                      <h3 className="text-xl font-semibold mt-2 dark:text-white">{article.title}</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{article.excerpt}</p>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {article.date} · {article.readTime}
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Load More */}
        {displayCount < filteredArticles.length && (
          <div className="text-center">
            <button 
              onClick={() => setDisplayCount(prev => prev + 4)}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Load More Articles
            </button>
          </div>
        )}
      </main>
    </div>
  );
}