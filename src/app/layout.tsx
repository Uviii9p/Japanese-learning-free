import type { Metadata } from "next";
import "./globals.css";
import { PWAProvider } from "@/components/PWAProvider";

export const metadata: Metadata = {
  title: "Japanese Mastery — Learn Japanese from Zero to N1",
  description: "A complete Japanese language learning application that takes you from absolute beginner to JLPT N1. Learn hiragana, katakana, kanji, grammar, and more.",
  keywords: ["Japanese", "JLPT", "language learning", "hiragana", "katakana", "kanji", "grammar"],
  openGraph: {
    title: "Japanese Mastery",
    description: "Learn Japanese from zero to N1",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#0d0d0d" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="日本語" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body suppressHydrationWarning>
        <PWAProvider />
        {children}
      </body>
    </html>
  );
}
