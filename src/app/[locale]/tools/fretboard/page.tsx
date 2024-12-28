import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { FretboardGame } from "@/components/fretboard/FretboardGame";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/i18n/routing";

export default function Page({
	params: { locale },
}: {
	params: { locale: string };
}) {
	// Enable static rendering
	setRequestLocale(locale);

	const t = useTranslations("Fretboard");

	return (
		<div className="container mx-auto py-6">
			<Card>
				<CardHeader>
					<CardTitle>{t("title")}</CardTitle>
				</CardHeader>
				<CardContent>
					<FretboardGame />
					<div className="mt-4">
						<Link href="/">{t("backToHome")}</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
