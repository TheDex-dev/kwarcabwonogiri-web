import { getArticleServer } from '../../../firebase/articles';
import { Metadata } from 'next';

export const dynamicParams = true;
export const revalidate = 60; // Revalidate metadata every 60 seconds

export async function generateMetadata({ params }) {
  const article = await getArticleServer(params.id);

  if (!article) {
    return {
      title: 'Article Not Found - Kwarcab Wonogiri',
      description: 'The requested article could not be found.',
    };
  }

  return {
    title: `${article.title} - Kwarcab Wonogiri`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      images: [
        {
          url: article.imageUrl || '/images/profile.jpeg',
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      publishedTime: article.date,
      modifiedTime: article.date,
      section: article.category,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: [article.imageUrl || '/images/profile.jpeg'],
    },
  };
}

export default function Layout({ children }) {
  return children;
}