'use client';

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export function HeroSection() {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      <video 
        className="absolute top-0 left-0 w-full h-full object-cover transform scale-105"
        width="1920"
        height="1080"
        autoPlay
        muted
        loop
        playsInline
        controls={false}
        poster="/videos/sample.mp4?poster=true"
      >
        <source src="/videos/sample.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4"
      >
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-6xl md:text-7xl font-bold mb-6 text-white drop-shadow-lg tracking-tight"
        >
          Kwarcab Wonogiri
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-xl md:text-2xl text-gray-200 drop-shadow-lg max-w-3xl font-light leading-relaxed"
        >
          Gerakan Pramuka Kwartir Cabang Wonogiri
        </motion.p>
        <motion.a 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          href="#featured" 
          className="mt-8 btn-primary"
        >
          Pelajari Lebih Jauh
        </motion.a>
      </motion.div>

      <motion.div 
        animate={{ 
          y: [0, 10, 0],
        }}
        transition={{ 
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <svg className="w-6 h-6 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </motion.div>
    </div>
  );
}

export function ContentSection() {
  return (
    <section className="relative py-20 bg-white dark:bg-gray-800">
      <div className="absolute inset-0 w-full h-full z-0">
        <Image
          src="/background/lightmode-waves.svg"
          alt="Wave Background"
          fill
          className="object-cover rotate-180 block dark:hidden"
          priority
        />
        <Image
          src="/background/darkmode-waves.svg"
          alt="Wave Background"
          fill
          className="object-cover rotate-180 hidden dark:block"
          priority
        />
      </div>
      <div className="container-custom relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row items-center gap-12 mb-20"
        >
          <motion.div 
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="w-full md:w-1/2"
          >
            <div className="relative aspect-[4/3] w-full">
              <Image
                src="/images/hero0.jpeg"
                alt="Kwarcab Activity"
                fill
                className="object-cover rounded-lg shadow-lg"
              />
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="w-full md:w-1/2"
          >
            <h2 className="text-3xl font-bold mb-4 text-white">Our Mission</h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Membentuk kader bangsa yang berkarakter, berjiwa patriot, dan memiliki 
              kepedulian terhadap sesama serta lingkungan. Melalui berbagai kegiatan 
              kepramukaan, kami mempersiapkan generasi muda untuk menjadi pemimpin masa depan.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
              <Link href="/profile" className="btn-primary inline-block">
                Learn More
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col-reverse md:flex-row items-center gap-12"
        >
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="w-full md:w-1/2"
          >
            <h2 className="text-3xl font-bold mb-4 text-white">Our Activities</h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Kami mengadakan berbagai kegiatan yang mendukung pengembangan karakter, 
              keterampilan kepramukaan, dan jiwa kepemimpinan. Mulai dari kegiatan rutin 
              mingguan hingga event-event besar tahunan yang melibatkan seluruh anggota 
              Pramuka di Wonogiri.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
              <Link href="/news" className="btn-primary inline-block">
                View Activities
              </Link>
            </motion.div>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="w-full md:w-1/2"
          >
            <div className="relative aspect-[4/3] w-full">
              <Image
                src="/images/hero1.jpeg"
                alt="Pramuka Activities"
                fill
                className="object-cover rounded-lg shadow-lg"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export function FeaturedArticles({ articles }) {
  return (
    <div id="featured" className="relative bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="absolute inset-0 w-full h-full z-0">
        <Image
          src="/background/lightmode-waves.svg"
          alt="Wave Background"
          fill
          className="object-cover block dark:hidden"
          priority
        />
        <Image
          src="/background/darkmode-waves.svg"
          alt="Wave Background"
          fill
          className="object-cover hidden dark:block"
          priority
        />
      </div>
      <main className="container-custom py-20 relative z-10">
        <section className="mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 text-white">Featured Articles</h2>
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: "6rem" }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="h-1 bg-primary mx-auto rounded-full"
            ></motion.div>
          </motion.div>
          
          <div className="grid gap-8 md:grid-cols-2">
            {articles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
              >
                <Link href={`/news/content/${article.id}`} className="group">
                  <motion.article 
                    whileHover={{ y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="card p-6 h-full"
                  >
                    <div className="mb-4">
                      <span className="inline-block px-3 py-1 text-sm font-medium text-primary bg-primary/10 rounded-full">
                        {article.category}
                      </span>
                      <h3 className="text-2xl font-semibold mt-3 dark:text-white group-hover:text-primary transition-colors">
                        {article.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{article.excerpt}</p>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <span>{article.date}</span>
                      <span className="mx-2">·</span>
                      <span>{article.readTime}</span>
                    </div>
                  </motion.article>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
