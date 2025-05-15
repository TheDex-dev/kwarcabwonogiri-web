export const metadata = {
  title: 'Kegiatan - Kwarcab Wonogiri',
  description: 'Kegiatan dan acara terbaru dari Kwartir Cabang Wonogiri.',
  openGraph: {
    title: 'Kegiatan Kwarcab Wonogiri',
    description: 'Kegiatan dan acara terbaru dari Kwartir Cabang Wonogiri.',
    type: 'website',
    images: [
      {
        url: '/images/hero1.jpeg',
        width: 1200,
        height: 630,
        alt: 'Kegiatan Pramuka Kwarcab Wonogiri',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kegiatan Kwarcab Wonogiri',
    description: 'Kegiatan dan acara terbaru dari Kwartir Cabang Wonogiri.',
    images: ['/images/hero1.jpeg'],
  },
};

export default function EventsLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container-custom pt-24 pb-16">
        {children}
      </div>
    </div>
  );
}