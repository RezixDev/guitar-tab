import { Metadata } from "next";
import { Inter } from "next/font/google";
import { RootLayout } from "@/components/layouts/root-layout";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Guitar Chord Learning App",
  description: "Learn guitar chords with an interactive and easy-to-use interface.",
  keywords: "guitar, chords, music, learning, interactive",
  openGraph: {
    title: "Guitar Chord Learning App",
    description: "Master guitar chords with our interactive learning tool!",
    type: "website",
  },
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <RootLayout>{children}</RootLayout>
      </body>
    </html>
  );
}