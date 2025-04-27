'use client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { articles } from '../../../data/articles';

export default function ArticleContent() {
  const params = useParams();
  const article = articles.find(a => a.id === params.id);
  
  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 dark:text-white">Article Not Found</h1>
          <Link href="/news" className="text-blue-600 dark:text-blue-400 hover:underline">
            Return to News
          </Link>
        </div>
      </div>
    );
  }

  const currentIndex = articles.findIndex(a => a.id === params.id);
  const prevArticle = currentIndex > 0 ? articles[currentIndex - 1] : null;
  const nextArticle = currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null;

  const relatedArticles = articles
    .filter(a => a.id !== article.id && a.category === article.category)
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <main className="max-w-4xl mx-auto px-4 pt-24 pb-12">
        {/* Article Header */}
        <div className="mb-12">
          <span className={`text-sm ${
            article.category === 'Research' ? 'text-blue-600 dark:text-blue-400' :
            article.category === 'Analysis' ? 'text-green-600 dark:text-green-400' :
            article.category === 'Opinion' ? 'text-purple-600 dark:text-purple-400' :
            'text-orange-600 dark:text-orange-400'
          }`}>{article.category}</span>
          <h1 className="text-4xl font-bold mt-4 mb-6 dark:text-white">{article.title}</h1>
          <div className="flex items-center text-gray-600 dark:text-gray-300 mb-8">
            <span>{article.date}</span>
            <span className="mx-2">·</span>
            <span>{article.readTime}</span>
          </div>
        </div>

        {/* Article Content */}
        <article className="prose prose-lg dark:prose-invert max-w-none mb-16">
          {article.content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="text-gray-600 dark:text-gray-300 mb-6">
              {paragraph.startsWith('-') ? (
                <ul className="list-disc list-inside">
                  {paragraph.split('\n').map((item, i) => (
                    <li key={i} className="mb-2">{item.replace('- ', '')}</li>
                  ))}
                </ul>
              ) : (
                paragraph
              )}
            </p>
          ))}
        </article>

        {/* Navigation Links */}
        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            {prevArticle ? (
              <Link 
                href={`/news/content/${prevArticle.id}`}
                className="px-6 py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                ← {prevArticle.title}
              </Link>
            ) : (
              <div />
            )}
            {nextArticle ? (
              <Link 
                href={`/news/content/${nextArticle.id}`}
                className="px-6 py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                {nextArticle.title} →
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-semibold mb-8 dark:text-white">Related Articles</h2>
            <div className="grid gap-8 md:grid-cols-2">
              {relatedArticles.map(relatedArticle => (
                <Link href={`/news/content/${relatedArticle.id}`} key={relatedArticle.id}>
                  <article className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-transform hover:-translate-y-1">
                    <span className={`text-sm ${
                      relatedArticle.category === 'Research' ? 'text-blue-600 dark:text-blue-400' :
                      relatedArticle.category === 'Analysis' ? 'text-green-600 dark:text-green-400' :
                      relatedArticle.category === 'Opinion' ? 'text-purple-600 dark:text-purple-400' :
                      'text-orange-600 dark:text-orange-400'
                    }`}>{relatedArticle.category}</span>
                    <h3 className="text-xl font-semibold mt-2 mb-4 dark:text-white">{relatedArticle.title}</h3>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {relatedArticle.date} · {relatedArticle.readTime}
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}