"use client";
import React from "react";
import { useTheme } from "next-themes";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
	SidebarFooter,
	useSidebar,
} from "@/components/ui/sidebar";
import { Guitar, Book, Settings, Home, Menu, ChevronLeft } from "lucide-react";
import ThemeToggle from "@/components/theme-toggle";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLocale } from "next-intl";

export const AppSidebar = () => {
	const pathname = usePathname();
	const locale = useLocale();
	const { isMobile, openMobile, setOpenMobile } = useSidebar();
	const [isOpen, setIsOpen] = React.useState(() => {
		if (typeof window !== "undefined") {
			const saved = localStorage.getItem("sidebarOpen");
			return saved !== null ? JSON.parse(saved) : true;
		}
		return true;
	});

	React.useEffect(() => {
		localStorage.setItem("sidebarOpen", JSON.stringify(isOpen));
	}, [isOpen]);

	const menuItems = [
		{ icon: Home, label: "Home", href: `/${locale}` },
		{
			icon: Guitar,
			label: "Guitar Tools",
			href: "#",
			subItems: [
				{ label: "Fretboard Game", href: `/${locale}/tools/fretboard` },
				{ label: "Scale Viewer", href: `/${locale}/tools/scales` },
				{ label: "Chord Library", href: `/${locale}/tools/chords` },
				{ label: "Guitar Tuner", href: `/${locale}/tools/tuner` },
				{ label: "Sheet Music Composer", href: `/${locale}/tools/sheet` },
				{ label: "Daily Practice", href: `/${locale}/tools/practice` },
			],
		},
		{ icon: Book, label: "Lessons", href: `/${locale}/learn` },
		{ icon: Settings, label: "Settings", href: `/${locale}/settings` },
	];

	return (
		<>
			{/* Mobile Menu Button */}
			<Button
				variant="ghost"
				size="icon"
				className="fixed top-4 left-4 z-50 md:hidden"
				onClick={() => setOpenMobile(!openMobile)}
			>
				<Menu className="h-6 w-6" />
			</Button>

			{/* Mobile Overlay */}
			{isMobile && openMobile && (
				<div
					className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
					onClick={() => setOpenMobile(false)}
				/>
			)}

			<Sidebar
				className={cn(
					"h-screen transition-all duration-300 ease-in-out",
					isMobile ? "fixed z-50" : "sticky top-0",
					isOpen ? "w-64" : "w-[70px]",
					isMobile && !openMobile && "translate-x-[-100%]"
				)}
			>
				<SidebarHeader className="flex items-center justify-between p-4">
					<h2
						className={cn(
							"text-xl font-bold transition-opacity duration-300",
							!isOpen && "opacity-0 md:hidden"
						)}
					>
						Guitar Learn
					</h2>
					<Button
						variant="ghost"
						size="icon"
						className="hidden md:flex"
						onClick={() => setIsOpen(!isOpen)}
					>
						<ChevronLeft
							className={cn(
								"h-5 w-5 transition-transform duration-300",
								!isOpen && "rotate-180"
							)}
						/>
					</Button>
				</SidebarHeader>

				<SidebarContent>
					<SidebarMenu>
						{menuItems.map((item) => (
							<React.Fragment key={item.label}>
								<SidebarMenuItem>
									<SidebarMenuButton asChild isActive={pathname === item.href}>
										{item.href === "#" ? (
											<button className="flex w-full items-center gap-2 p-2">
												<item.icon className="h-5 w-5 shrink-0" />
												<span
													className={cn(
														"transition-opacity duration-300",
														!isOpen && "opacity-0 md:hidden"
													)}
												>
													{item.label}
												</span>
											</button>
										) : (
											<Link
												href={item.href}
												className="flex items-center gap-2 p-2"
												onClick={() => isMobile && setOpenMobile(false)}
											>
												<item.icon className="h-5 w-5 shrink-0" />
												<span
													className={cn(
														"transition-opacity duration-300",
														!isOpen && "opacity-0 md:hidden"
													)}
												>
													{item.label}
												</span>
											</Link>
										)}
									</SidebarMenuButton>
								</SidebarMenuItem>

								{item.subItems && isOpen && (
									<div className="ml-6 space-y-1">
										{item.subItems.map((subItem) => (
											<SidebarMenuItem key={subItem.label}>
												<SidebarMenuButton
													asChild
													isActive={pathname === subItem.href}
												>
													<Link
														href={subItem.href}
														className="flex items-center gap-2 p-2"
														onClick={() => isMobile && setOpenMobile(false)}
													>
														<span>{subItem.label}</span>
													</Link>
												</SidebarMenuButton>
											</SidebarMenuItem>
										))}
									</div>
								)}
							</React.Fragment>
						))}
					</SidebarMenu>
				</SidebarContent>

				<SidebarFooter className="p-4">
					<div className={cn("flex items-center gap-4", !isOpen && "flex-col")}>
						<ThemeToggle />
						{isOpen && <LanguageSwitcher />}
					</div>
				</SidebarFooter>
			</Sidebar>
		</>
	);
};
