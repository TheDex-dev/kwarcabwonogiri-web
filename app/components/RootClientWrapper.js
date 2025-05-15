'use client';

import { ErrorBoundary } from 'react-error-boundary';
import { AnimatePresence } from 'framer-motion';
import Navigation from "./navigation";
import CreateContentButton from "./CreateContentButton";
import { AuthContextProvider } from "../context/AuthContext";
import { Analytics } from "@vercel/analytics/next";

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

export default function RootClientWrapper({ children }) {
  return (
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
  );
}
