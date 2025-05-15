import { getEventsByTypeServer } from '../../firebase/events';

export const dynamicParams = true;
export const revalidate = 60; // Revalidate metadata every 60 seconds

export async function generateMetadata() {
  const events = await getEventsByTypeServer('penggalang');
  const upcomingEvents = events.filter(event => new Date(event.date) >= new Date());

  return {
    title: 'Kegiatan Penggalang - Kwarcab Wonogiri',
    description: 'Program kegiatan untuk anggota Pramuka tingkat Penggalang di Kwartir Cabang Wonogiri',
    openGraph: {
      title: 'Kegiatan Penggalang - Kwarcab Wonogiri',
      description: 'Program kegiatan untuk anggota Pramuka tingkat Penggalang di Kwartir Cabang Wonogiri',
      type: 'website',
      images: [
        {
          url: upcomingEvents[0]?.image || '/images/hero1.jpeg',
          width: 1200,
          height: 630,
          alt: 'Kegiatan Pramuka Penggalang Kwarcab Wonogiri',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Kegiatan Penggalang - Kwarcab Wonogiri',
      description: 'Program kegiatan untuk anggota Pramuka tingkat Penggalang di Kwartir Cabang Wonogiri',
      images: [upcomingEvents[0]?.image || '/images/hero1.jpeg'],
    },
  };
}

export default function Layout({ children }) {
  return children;
}
