import { Globe } from "lucide-react";
import { LOCALES, type Locale } from "@shared/types/i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@shared/ui/DropdownMenu";
import { Button } from "@shared/ui/Button";

const LABELS: Record<Locale, string> = {
  en: "English",
  de: "Deutsch",
  pl: "Polski",
};

export function LanguageSwitcher({
  locale,
  pathname,
}: {
  locale: Locale;
  pathname: string;
}) {
  const switchTo = (next: Locale) => {
    const stripped = pathname.replace(/^\/(en|de|pl)(?=\/|$)/, "") || "/";
    const newPath = `/${next}${stripped === "/" ? "" : stripped}` || `/${next}`;
    window.location.assign(newPath);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2"
          aria-label="Switch language"
        >
          <Globe className="size-4" />
          <span className="font-medium uppercase">{locale}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-36">
        {LOCALES.map((code) => (
          <DropdownMenuItem
            key={code}
            onSelect={() => switchTo(code)}
            aria-current={code === locale}
          >
            {LABELS[code]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
