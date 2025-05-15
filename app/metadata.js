export const metadata = {
  metadataBase: new URL(
    process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000'
      : 'https://www.pramukakwarcabwonogiri.com/'
  ),
  title: "Kwarcab Wonogiri",
  description: "Situs resmi Kwartir Cabang Wonogiri",
  openGraph: {
    title: "Kwarcab Wonogiri",
    description: "Situs resmi Kwartir Cabang Wonogiri",
    type: "website",
    url: "https://www.pramukakwarcabwonogiri.com/",
    siteName: "Kwarcab Wonogiri",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kwarcab Wonogiri",
    description: "Situs resmi Kwartir Cabang Wonogiri",
  }
};
