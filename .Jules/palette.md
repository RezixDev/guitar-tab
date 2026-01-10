## 2024-05-24 - [SidebarProvider Includes TooltipProvider]
**Learning:** The `SidebarProvider` from `shadcn/ui` (in `src/components/ui/sidebar.tsx`) includes a `TooltipProvider` wrapping its children.
**Action:** No need to add a global `TooltipProvider` in `RootLayout` if the app structure relies on `SidebarProvider`. Components inside the sidebar context can use `Tooltip` components directly.
