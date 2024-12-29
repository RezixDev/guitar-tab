import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { FretboardGame } from "@/components/fretboard/FretboardGame";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/i18n/routing";
import { use } from "react";

type PageParams = {
	locale: string;
};

interface PageProps {
	params: Promise<PageParams>;
}

export default function Page({ params }: PageProps) {
	const resolvedParams = use(params);
	setRequestLocale(resolvedParams.locale);
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
