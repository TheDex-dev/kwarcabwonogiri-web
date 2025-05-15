import { getEventsByTypeServer } from '../../firebase/events';

export const dynamicParams = true;
export const revalidate = 60; // Revalidate metadata every 60 seconds

export async function generateMetadata() {
  const events = await getEventsByTypeServer('pandega');
  const upcomingEvents = events.filter(event => new Date(event.date) >= new Date());

  return {
    title: 'Kegiatan Pandega - Kwarcab Wonogiri',
    description: 'Program kegiatan untuk anggota Pramuka tingkat Pandega di Kwartir Cabang Wonogiri',
    openGraph: {
      title: 'Kegiatan Pandega - Kwarcab Wonogiri',
      description: 'Program kegiatan untuk anggota Pramuka tingkat Pandega di Kwartir Cabang Wonogiri',
      type: 'website',
      images: [
        {
          url: upcomingEvents[0]?.image || '/images/hero1.jpeg',
          width: 1200,
          height: 630,
          alt: 'Kegiatan Pramuka Pandega Kwarcab Wonogiri',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Kegiatan Pandega - Kwarcab Wonogiri',
      description: 'Program kegiatan untuk anggota Pramuka tingkat Pandega di Kwartir Cabang Wonogiri',
      images: [upcomingEvents[0]?.image || '/images/hero1.jpeg'],
    },
  };
}

export default function Layout({ children }) {
  return children;
}
