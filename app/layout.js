import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import RootClientWrapper from "./components/RootClientWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <RootClientWrapper>
          {children}
        </RootClientWrapper>
      </body>
    </html>
  );
}
