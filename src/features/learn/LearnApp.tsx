import { GraduationCap } from "lucide-react";
import type { Locale, Messages } from "@shared/types/i18n";
import { I18nProvider, useTranslations } from "@shared/i18n/I18nProvider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@shared/ui/Tabs";
import { LearningPathCard } from "./components/LearningPathCard";
import { LEARNING_PATHS } from "./data/paths";

function LearnContent({ locale }: { locale: Locale }) {
  const t = useTranslations("learn");

  const handleSelect = (pathId: string) => {
    window.location.href = `/${locale}/learn/${pathId}`;
  };

  return (
    <div className="container mx-auto max-w-6xl space-y-6 p-4 md:p-8">
      <header className="mb-2 flex items-center gap-3">
        <GraduationCap className="size-8" />
        <h1 className="text-4xl font-bold tracking-tight">{t("title")}</h1>
      </header>

      <Tabs defaultValue="beginner" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="beginner">{t("learn.beginner")}</TabsTrigger>
          <TabsTrigger value="intermediate">{t("learn.intermediate")}</TabsTrigger>
          <TabsTrigger value="advanced">{t("learn.advanced")}</TabsTrigger>
        </TabsList>

        <TabsContent value="beginner" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {LEARNING_PATHS.beginner.map((path) => (
              <LearningPathCard key={path.id} path={path} progress={0} onSelect={handleSelect} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="intermediate" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {LEARNING_PATHS.intermediate.map((path) => (
              <LearningPathCard key={path.id} path={path} progress={0} onSelect={handleSelect} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {LEARNING_PATHS.advanced.map((path) => (
              <LearningPathCard key={path.id} path={path} progress={0} onSelect={handleSelect} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function LearnApp({
  locale,
  messages,
}: {
  locale: Locale;
  messages: Messages;
}) {
  return (
    <I18nProvider locale={locale} messages={messages}>
      <LearnContent locale={locale} />
    </I18nProvider>
  );
}
