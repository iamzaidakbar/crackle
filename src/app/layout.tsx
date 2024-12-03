import type { Metadata } from "next";
import localFont from "next/font/local";
import Navbar from "@/components/Navbar";
import PageWrapper from "@/components/PageWrapper";
import Providers from "@/components/Providers";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Crackle - Movie App",
  description: "Watch your favorite movies and TV shows",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-black w-full overflow-x-hidden`}
      >
        <Providers>
          <Navbar />
          <main className="flex-grow w-full">
            <div className="container mx-auto px-4 py-8">
              <PageWrapper>{children}</PageWrapper>
            </div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
