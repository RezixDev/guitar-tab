// layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import ThemeToggle from "@/components/theme-toggle";

import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
	title: "Guitar Chord Learning App",
	description:
		"Learn guitar chords with an interactive and easy-to-use interface.",
	keywords: "guitar, chords, music, learning, interactive",
	openGraph: {
		title: "Guitar Chord Learning App",
		description: "Master guitar chords with our interactive learning tool!",
		type: "website",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" dir="ltr" suppressHydrationWarning>
			<body className={`${inter.className} min-h-screen`}>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
					<header className="container mx-auto px-4 py-4 flex justify-between items-center">
						<ThemeToggle />
					</header>
					<main className="container mx-auto px-4 py-8">{children}</main>
				</ThemeProvider>
			</body>
		</html>
	);
}
