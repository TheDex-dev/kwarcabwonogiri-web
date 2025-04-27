import Image from "next/image";
import Link from "next/link";
import { articles } from "./data/articles";

export default function Home() {
  // Get the two most recent articles for the featured section
  const featuredArticles = articles.slice(0, 2);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <main className="max-w-4xl mx-auto px-4 pt-24 pb-12">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4 dark:text-white">Kwarcab Wonogiri</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">Gerakan Pramuka Kuartir Cabang Wonogiri</p>
            <div className="relative w-full max-w-3xl mx-auto rounded-xl overflow-hidden shadow-lg">
              <video 
                className="w-full h-auto"
                width="1920"
                height="1080"
                autoPlay
                muted
                loop
                playsInline
                controls
                poster="/kwarcabwonogiri-web/videos/sample.mp4?poster=true"
              >
                <source src="/kwarcabwonogiri-web/videos/sample.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          {/* Featured Posts */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-6 dark:text-white">Featured Articles</h2>
            <div className="grid gap-8 md:grid-cols-2">
              {featuredArticles.map((article) => (
                <Link href={`/news/content/${article.id}`} key={article.id}>
                  <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 transition-transform hover:-translate-y-1">
                    <div className="mb-4">
                      <span className="text-sm text-blue-600 dark:text-blue-400">{article.category}</span>
                      <h3 className="text-xl font-semibold mt-2 dark:text-white">{article.title}</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{article.excerpt}</p>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{article.date} · {article.readTime}</div>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
