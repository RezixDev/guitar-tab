// app/[locale]/layout.tsx
import { Metadata } from "next";
import { Inter } from "next/font/google";
import { RootLayout } from "@/components/layouts/root-layout";
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

type RootLayoutProps = {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
};

export default async function Layout(props: RootLayoutProps) {
    const params = await props.params;

    const {
        locale
    } = params;

    const {
        children
    } = props;

    // Lade die Übersetzungen
    const messages = (await import(`@/messages/${locale}.json`)).default;

    return (
		<html lang={locale} suppressHydrationWarning>
			<body className={inter.className}>
				<RootLayout locale={locale} messages={messages}>
					{children}
				</RootLayout>
			</body>
		</html>
	);
}

export function generateStaticParams() {
	return [{ locale: "en" }, { locale: "de" }, { locale: "pl" }];
}
