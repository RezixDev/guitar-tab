import { Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@shared/ui/Button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@shared/ui/Sheet";

export type NavLink = {
  label: string;
  href: string;
};

export type NavSection = {
  label: string;
  links: NavLink[];
};

export function MobileNav({
  brand,
  sections,
  pathname,
}: {
  brand: string;
  sections: NavSection[];
  pathname: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
      >
        <Menu className="size-5" />
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72">
          <SheetHeader>
            <SheetTitle>{brand}</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-6 overflow-y-auto pt-2">
            {sections.map((section) => (
              <div key={section.label}>
                <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-fg-muted)]">
                  {section.label}
                </p>
                <ul className="flex flex-col gap-1">
                  {section.links.map((link) => {
                    const active = pathname === link.href;
                    return (
                      <li key={link.href}>
                        <a
                          href={link.href}
                          onClick={() => setOpen(false)}
                          className={
                            "flex rounded-md px-3 py-2 text-sm transition " +
                            (active
                              ? "bg-[var(--color-accent-soft)] text-[var(--color-accent)] font-medium"
                              : "text-[var(--color-fg)] hover:bg-[var(--color-accent-soft)]")
                          }
                        >
                          {link.label}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </>
  );
}
