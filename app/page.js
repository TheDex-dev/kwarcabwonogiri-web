import Image from "next/image";
import Navigation from "./components/navigation";

export default function Home() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <main className="max-w-4xl mx-auto px-4 pt-24 pb-12">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4 dark:text-white">Academic Insights</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">Exploring ideas at the intersection of research and practice</p>
          </div>

          {/* Featured Posts */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-6 dark:text-white">Featured Articles</h2>
            <div className="grid gap-8 md:grid-cols-2">
              <article className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-transform hover:-translate-y-1">
                <div className="mb-4">
                  <span className="text-sm text-blue-600 dark:text-blue-400">Research</span>
                  <h3 className="text-xl font-semibold mt-2 dark:text-white">The Future of Machine Learning in Academia</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">Exploring the latest developments in machine learning and their implications for academic research.</p>
                <div className="text-sm text-gray-500 dark:text-gray-400">April 27, 2025 · 10 min read</div>
              </article>
              
              <article className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-transform hover:-translate-y-1">
                <div className="mb-4">
                  <span className="text-sm text-green-600 dark:text-green-400">Analysis</span>
                  <h3 className="text-xl font-semibold mt-2 dark:text-white">Sustainable Development in Higher Education</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">A comprehensive look at how universities are implementing sustainable practices.</p>
                <div className="text-sm text-gray-500 dark:text-gray-400">April 25, 2025 · 8 min read</div>
              </article>
            </div>
          </section>

          {/* Categories */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-6 dark:text-white">Browse by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Research', 'Analysis', 'Opinion', 'Reviews'].map((category) => (
                <div key={category} className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  <span className="font-medium dark:text-white">{category}</span>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
