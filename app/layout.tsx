import type { Metadata, Viewport } from "next";
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
  title: "Ascension Fasting - Track Your Fasting Journey",
  description: "Track your fasting journey, monitor weight, and achieve your wellness goals with Ascension Fasting. Simple, powerful fasting tracker with achievements and progress analytics.",
  keywords: ["fasting", "intermittent fasting", "weight loss", "health", "wellness", "tracker", "diet"],
  authors: [{ name: "Ascension Fasting" }],
  creator: "Ascension Fasting",
  publisher: "Ascension Fasting",
  applicationName: "Ascension Fasting",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Ascension Fasting",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#3b82f6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-50">{children}</body>
    </html>
  );
}
