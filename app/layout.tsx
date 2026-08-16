import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mr. Cece — Belajar Bahasa Inggris Seru!",
  description:
    "Aplikasi belajar kosakata Bahasa Inggris bergaya gamification. Oxford 3000, CEFR Level A1-C2. Match kata, kumpulkan XP, dan naik level!",
  keywords: ["belajar bahasa inggris", "vocabulary", "kosakata", "oxford 3000", "CEFR", "flashcard"],
  manifest: "/manifest.json",
  openGraph: {
    title: "Mr. Cece — Belajar Bahasa Inggris Seru!",
    description: "Aplikasi belajar kosakata bergaya gamification. Oxford 3000.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={nunito.className}>
      <head>
        <meta name="application-name" content="Mr. Cece" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Mr. Cece" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#3B82F6" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0f172a" media="(prefers-color-scheme: dark)" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/mascot.png" />
      </head>
      <body className="antialiased overflow-x-hidden bg-white text-slate-900 dark:bg-gray-900 dark:text-white">
        {children}
      </body>
    </html>
  );
}
