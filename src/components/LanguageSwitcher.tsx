import { usePathname, useRouter } from "next/navigation";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const languages = [
	{ code: "en", name: "English" },
	{ code: "de", name: "Deutsch" },
	{ code: "pl", name: "Polski" },
];

export function LanguageSwitcher() {
	const pathname = usePathname();
	const router = useRouter();

	const switchLanguage = (locale: string) => {
		const newPath = pathname.replace(/^\/[a-z]{2}/, `/${locale}`);
		router.push(newPath);
	};

	const currentLocale = pathname.split("/")[1];

	return (
		<Select value={currentLocale} onValueChange={switchLanguage}>
			<SelectTrigger className="w-[120px]">
				<SelectValue placeholder="Language" />
			</SelectTrigger>
			<SelectContent>
				{languages.map((lang) => (
					<SelectItem key={lang.code} value={lang.code}>
						{lang.name}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
