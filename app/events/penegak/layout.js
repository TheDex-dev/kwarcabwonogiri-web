import { getEventsByTypeServer } from '../../firebase/events.server';

export const dynamicParams = true;
export const revalidate = 60; // Revalidate metadata every 60 seconds

export async function generateMetadata() {
  const events = await getEventsByTypeServer('penegak');
  const upcomingEvents = events.filter(event => new Date(event.date) >= new Date());

  return {
    title: 'Kegiatan Penegak - Kwarcab Wonogiri',
    description: 'Program kegiatan untuk anggota Pramuka tingkat Penegak di Kwartir Cabang Wonogiri',
    openGraph: {
      title: 'Kegiatan Penegak - Kwarcab Wonogiri',
      description: 'Program kegiatan untuk anggota Pramuka tingkat Penegak di Kwartir Cabang Wonogiri',
      type: 'website',
      images: [
        {
          url: upcomingEvents[0]?.image || '/images/hero1.jpeg',
          width: 1200,
          height: 630,
          alt: 'Kegiatan Pramuka Penegak Kwarcab Wonogiri',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Kegiatan Penegak - Kwarcab Wonogiri',
      description: 'Program kegiatan untuk anggota Pramuka tingkat Penegak di Kwartir Cabang Wonogiri',
      images: [upcomingEvents[0]?.image || '/images/hero1.jpeg'],
    },
  };
}

export default function Layout({ children }) {
  return children;
}
