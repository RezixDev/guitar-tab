"use client";
import React from "react";
import { NextIntlClientProvider } from "next-intl";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { AppSidebar } from "./app-sidebar";

type RootLayoutProps = {
	children: React.ReactNode;
	locale: string; // Remove optional
	messages: any; // Remove optional
};

export const RootLayout = ({
	children,
	locale, // Remove default value
	messages, // Remove default value
}: RootLayoutProps) => {
	const [mounted, setMounted] = React.useState(false);

	React.useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	// Add validation to ensure we have required values
	if (!locale || !messages) {
		console.error("Missing required locale or messages");
		return null;
	}

	return (
		<NextIntlClientProvider locale={locale} messages={messages}>
			<ThemeProvider
				attribute="class"
				defaultTheme="system"
				enableSystem
				disableTransitionOnChange
			>
				<SidebarProvider>
					<div className="flex min-h-screen w-full">
						<div className="flex relative">
							<AppSidebar />
						</div>
						<main className="flex-1 min-w-0 relative">
							<div className="mx-auto max-w-6xl p-4 md:p-8 pt-16 md:pt-8">
								{children}
							</div>
						</main>
					</div>
				</SidebarProvider>
			</ThemeProvider>
		</NextIntlClientProvider>
	);
};
