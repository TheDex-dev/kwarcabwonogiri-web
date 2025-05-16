'use client';

import { useEffect, useState, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { getArticleServer } from '../../../firebase/server';

function ArticleContent() {
  const { id } = useParams();
  const router = useRouter();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadArticle() {
      try {
        const articleData = await getArticleServer(id);
        setArticle(articleData);
      } catch (error) {
        console.error('Error loading article:', error);
      } finally {
        setLoading(false);
      }
    }

    loadArticle();
  }, [id]);

  // Format the date to be more readable
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Share article function
  const shareArticle = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 pt-24">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-4 dark:text-white">Article not found</h1>
          <p className="text-gray-600 dark:text-gray-300">The article you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="fixed top-24 left-4 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>

      {/* Hero Section with Image */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={article.imageUrl || "/images/hero0.jpeg"}
            alt={article.title}
            fill
            className="object-cover"
            priority
            onError={(e) => {
              console.error('Error loading image:', e);
              e.target.src = "/images/hero0.jpeg";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>
        </div>
        
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 container mx-auto">
          <span className="text-sm font-medium text-white bg-primary/80 px-4 py-1 rounded-full mb-6">
            {article.category}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white max-w-4xl">
            {article.title}
          </h1>
          <div className="flex items-center space-x-4 text-gray-200">
            <span>{formatDate(article.date)}</span>
            <span>·</span>
            <span>{article.readTime}</span>
            <button
              onClick={shareArticle}
              className="ml-4 p-2 hover:bg-white/10 rounded-full transition-colors"
              title="Share article"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <main className="container mx-auto px-4 py-12">
        <article className="max-w-3xl mx-auto">
          {/* Article excerpt/summary */}
          {article.excerpt && (
            <div className="mb-8 text-lg text-gray-600 dark:text-gray-300 font-serif border-l-4 border-primary pl-4">
              {article.excerpt}
            </div>
          )}
          
          {/* Main content */}
          <div className="prose prose-lg max-w-none dark:prose-invert">
            {/* Split content by newlines and render paragraphs */}
            {article.content.split('\n').map((paragraph, index) => (
              paragraph.trim() && (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              )
            ))}
          </div>

          {/* Article footer */}
          <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Published on {formatDate(article.date)}
              </div>
              <button
                onClick={shareArticle}
                className="flex items-center space-x-2 text-primary hover:text-primary-dark transition-colors"
              >
                <span>Share Article</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
            </div>
          </footer>
        </article>
      </main>
    </div>
  );
}

export default function ArticlePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ArticleContent />
    </Suspense>
  );
}