"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import CookieConsent from "@/components/CookieConsent";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import LoadingBar from "@/components/LoadingBar";
import { usePathname } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { queryClient } from "@/lib/react-query";
import { movieApi } from "@/lib/api";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

// Prefetch popular movies
queryClient.prefetchInfiniteQuery({
  queryKey: ["movies", "popular"],
  queryFn: ({ pageParam = 1 }) => movieApi.getPopularMovies(pageParam),
  initialPageParam: 1,
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [hasConsent, setHasConsent] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    setHasConsent(!!consent);
  }, []);

  const handleCookieAccept = () => {
    localStorage.setItem("cookieConsent", "true");
    setHasConsent(true);
  };

  // Check if current path is an auth page
  const isAuthPage = pathname?.startsWith("/auth/");

  return (
    <html lang="en" className={inter.className}>
      <head>
        <title>Crackle - Watch Movies Online</title>
        <meta
          name="description"
          content="Watch your favorite movies online with Crackle. Stream the latest releases, popular movies, and classic films."
        />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-background text-white min-h-screen">
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            {!hasConsent && <CookieConsent onAccept={handleCookieAccept} />}
            <Navbar />
            <main className="container mx-auto px-4 py-8 min-h-screen">
              <LoadingBar />
              {isAuthPage ? (
                children
              ) : (
                <ProtectedRoute>{children}</ProtectedRoute>
              )}
            </main>
            <Footer />
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
