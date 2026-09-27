"use client";

import { RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations("errorPage");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main id="main" className="flex min-h-[70vh] items-center justify-center px-4 text-center">
      <div className="max-w-lg">
        <p className="font-serif text-6xl font-bold text-primary">!</p>
        <h1 className="mt-4 text-3xl">{t("title")}</h1>
        <p className="mt-3 text-lg text-ink-soft">{t("text")}</p>
        <Button className="mt-8" onClick={reset} icon={<RotateCcw />} iconPosition="start">
          {t("retry")}
        </Button>
      </div>
    </main>
  );
}
