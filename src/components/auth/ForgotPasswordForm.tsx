"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, AtSign, MailQuestion } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "@/i18n/navigation";
import { TextInput } from "@/components/forms/fields/TextInput";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { FormAlert } from "@/components/forms/FormAlert";
import { useSubmitError } from "@/components/forms/useSubmitError";
import { forgotSchema, identifierType } from "@/lib/validation/schemas";
import { authService, buildForgotPayload } from "@/services/auth.service";
import { flowStore } from "@/services/api/session-storage";
import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";

export function ForgotPasswordForm() {
  const t = useTranslations("auth.forgot");
  const tf = useTranslations("forms");
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const form = useForm({ resolver: zodResolver(forgotSchema), defaultValues: { identifier: "" }, mode: "onTouched" });
  const { register, handleSubmit, formState } = form;
  const toMessage = useSubmitError(form.setError);
  const email = siteConfig.contact.emails.info;
  const [infoBefore, infoAfter] = t("info", { email: "{email}" }).split("{email}");

  const onSubmit = handleSubmit(async (values) => {
    setServerError("");
    try {
      const res = await authService.forgotPassword(buildForgotPayload(values));
      flowStore.setReset({ identifier: values.identifier, identifierType: identifierType(values.identifier), maskedTarget: res.maskedTarget });
      router.push(routes.resetPassword);
    } catch (error) {
      setServerError(toMessage(error));
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <TextInput
        id="forgot-identifier"
        variant="filled"
        icon={<AtSign />}
        label={tf("fields.identifier")}
        placeholder={tf("fields.identifierPlaceholder")}
        hint={t("hint")}
        autoComplete="username"
        required
        error={formState.errors.identifier?.message}
        {...register("identifier")}
      />
      {serverError && <FormAlert>{serverError}</FormAlert>}
      <SubmitButton loading={formState.isSubmitting} loadingLabel={tf("submit.sending")} icon={<ArrowRight />} className="w-full short:py-3">
        {t("submit")}
      </SubmitButton>
      <p className="flex gap-3 rounded-xl bg-primary-tint px-4 py-3.5 text-sm leading-relaxed text-ink-soft">
        <MailQuestion aria-hidden className="mt-0.5 size-5 shrink-0 text-primary" />
        <span>
          {infoBefore}
          <a href={`mailto:${email}`} className="font-semibold text-primary hover:text-accent">
            {email}
          </a>
          {infoAfter}
        </span>
      </p>
    </form>
  );
}
