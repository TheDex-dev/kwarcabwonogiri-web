'use client';

import { Analytics } from "@vercel/analytics/next"
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "./components/navigation";
import CreateContentButton from "./components/CreateContentButton";
import { AuthContextProvider } from "./context/AuthContext";
import { ErrorBoundary } from 'react-error-boundary';
import { AnimatePresence } from 'framer-motion';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function ErrorFallback({error}) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-bold mb-4">Something went wrong:</h2>
        <pre className="text-red-500">{error.message}</pre>
      </div>
    </div>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <AuthContextProvider>
            <Navigation />
            <AnimatePresence mode="wait">
              {children}
            </AnimatePresence>
            <CreateContentButton />
            <Analytics />
          </AuthContextProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
