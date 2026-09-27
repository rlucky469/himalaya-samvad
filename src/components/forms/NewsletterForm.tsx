"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { formsService } from "@/services/forms.service";
import { newsletterSchema } from "@/lib/validation/schemas";
import type { Locale } from "@/types/api";
import { useSubmitError } from "./useSubmitError";

export function NewsletterForm() {
  const t = useTranslations("footer");
  const tv = useTranslations("validation");
  const locale = useLocale() as Locale;
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState("");
  const toMessage = useSubmitError();
  const { register, handleSubmit, formState } = useForm({ resolver: zodResolver(newsletterSchema), defaultValues: { email: "" } });

  const onSubmit = handleSubmit(async (values) => {
    setServerError("");
    try {
      await formsService.newsletter({ email: values.email.toLowerCase(), locale });
      setDone(true);
    } catch (error) {
      setServerError(toMessage(error));
    }
  });

  if (done) return <p className="rounded-xl bg-white/10 px-4 py-3 text-sm text-white" role="status">{t("newsletterSuccess")}</p>;

  const error = formState.errors.email?.message;
  return (
    <form onSubmit={onSubmit} noValidate className="space-y-2">
      <div className="flex overflow-hidden rounded-xl bg-white ring-1 ring-white/20 focus-within:ring-2 focus-within:ring-cta">
        <label htmlFor="newsletter-email" className="sr-only">
          {t("newsletterPlaceholder")}
        </label>
        <input
          id="newsletter-email"
          type="email"
          autoComplete="email"
          placeholder={t("newsletterPlaceholder")}
          aria-invalid={!!error}
          className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-ink outline-none placeholder:text-muted"
          {...register("email")}
        />
        <button type="submit" disabled={formState.isSubmitting} aria-label={t("newsletterButton")} className="inline-flex items-center gap-1.5 bg-cta px-4 text-sm font-semibold text-white transition-colors hover:bg-cta-hover disabled:opacity-70">
          {formState.isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
          <span className="hidden sm:inline">{t("newsletterButton")}</span>
        </button>
      </div>
      {(error || serverError) && (
        <p role="alert" className="text-xs font-medium text-cta">
          {error ? tv(error as never) : serverError}
        </p>
      )}
    </form>
  );
}
