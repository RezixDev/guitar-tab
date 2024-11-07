"use client"
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ThemeProvider } from "@/components/theme-provider";
import { AppSidebar } from './app-sidebar';

export const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider>
        <div className="flex min-h-screen">
          <div className="flex relative"> {/* Added wrapper */}
            <AppSidebar />
          </div>
          <main className="flex-1">
            <div className="mx-auto max-w-6xl p-4 md:p-8 pt-16 md:pt-8">
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
};