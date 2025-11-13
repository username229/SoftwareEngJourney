import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MovieMate - Your Entertainment Companion",
  description: "Discover, search, and organize your favorite movies and TV shows with MovieMate. Watch trailers, explore genres, and create your personal entertainment library.",
  keywords: ["movies", "tv shows", "entertainment", "TMDB", "trailers", "YouTube", "favorites", "search", "genres", "streaming"],
  authors: [{ name: "MovieMate Team" }],
  creator: "MovieMate",
  publisher: "MovieMate",
  metadataBase: new URL('http://localhost:3000'),
  openGraph: {
    title: "MovieMate - Your Entertainment Companion",
    description: "Discover movies and TV shows, watch trailers, and create your entertainment library",
    url: 'http://localhost:3000',
    siteName: 'MovieMate',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/manifest.json',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#3b82f6',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
