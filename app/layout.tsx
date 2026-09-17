import type { Metadata } from "next";
import { Nunito, Space_Grotesk } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-nunito",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "Mr. Cece — Platform Belajar Bahasa Inggris Terbaik",
  description:
    "Platform gamified untuk belajar kosakata Bahasa Inggris. Oxford 3000, CEFR Level A1-C1. Kumpulkan XP, raih badge, dan kuasai bahasa Inggris dengan cara yang menyenangkan!",
  keywords: ["belajar bahasa inggris", "vocabulary", "kosakata", "oxford 3000", "CEFR", "gamification", "edtech", "flashcard", "mr cece"],
  manifest: "/manifest.json",
  openGraph: {
    title: "Mr. Cece — Platform Belajar Bahasa Inggris Terbaik",
    description: "Platform gamified belajar kosakata bahasa Inggris. Oxford 3000, CEFR A1-C1. Seru, efektif, dan gratis!",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${nunito.variable} ${spaceGrotesk.variable} ${nunito.className}`}>
      <head>
        <meta name="application-name" content="Mr. Cece" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Mr. Cece" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#6366F1" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#080B1A" media="(prefers-color-scheme: dark)" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/mascot.png" />
      </head>
      <body className="antialiased overflow-x-hidden mesh-bg-light dark:mesh-bg text-slate-900 dark:text-white">
        {children}
      </body>
    </html>
  );
}

