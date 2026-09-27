"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { TextInput } from "./fields/TextInput";
import { TextArea } from "./fields/TextArea";
import { SelectField } from "./fields/SelectField";
import { FileField } from "./fields/FileField";
import { SubmitButton } from "./SubmitButton";
import { FormAlert } from "./FormAlert";
import { FormSuccess } from "./FormSuccess";
import { useSubmitError } from "./useSubmitError";
import { useQueryPreset } from "./useQueryPreset";
import { ATTACHMENT_ACCEPT, contactSchema } from "@/lib/validation/schemas";
import { buildContactPayload, formsService } from "@/services/forms.service";
import type { Locale } from "@/types/api";

const defaults = { name: "", email: "", mobile: "", subject: "", message: "", attachment: null };

export function ContactForm() {
  const t = useTranslations("forms");
  const locale = useLocale() as Locale;
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState("");
  const form = useForm({ resolver: zodResolver(contactSchema), defaultValues: defaults, mode: "onTouched" });
  const { register, handleSubmit, control, reset, setValue, formState } = form;
  const { errors, isSubmitting } = formState;
  const toMessage = useSubmitError(form.setError);
  const subjects = t.raw("subjects") as { value: string; label: string }[];

  useQueryPreset("subject", subjects.map((s) => s.value), (v) => setValue("subject", v));

  const onSubmit = handleSubmit(async (values) => {
    setServerError("");
    try {
      await formsService.contact(buildContactPayload(values, locale));
      setSent(true);
      reset(defaults);
    } catch (error) {
      setServerError(toMessage(error));
    }
  });

  if (sent) return <FormSuccess title={t("success.title")} message={t("success.contact")} againLabel={t("success.again")} onAgain={() => setSent(false)} />;

  return (
    <form onSubmit={onSubmit} noValidate className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <TextInput id="contact-name" label={t("fields.name")} placeholder={t("fields.namePlaceholder")} autoComplete="name" required error={errors.name?.message} {...register("name")} />
      <TextInput id="contact-email" type="email" label={t("fields.email")} placeholder={t("fields.emailPlaceholder")} autoComplete="email" required error={errors.email?.message} {...register("email")} />
      <TextInput id="contact-mobile" type="tel" inputMode="numeric" prefix="+91" label={t("fields.mobile")} placeholder={t("fields.mobilePlaceholder")} autoComplete="tel-national" required error={errors.mobile?.message} {...register("mobile")} />
      <SelectField id="contact-subject" label={t("fields.subject")} placeholder={t("fields.subjectPlaceholder")} options={subjects} required error={errors.subject?.message} {...register("subject")} />
      <TextArea id="contact-message" className="sm:col-span-2" label={t("fields.message")} placeholder={t("fields.messagePlaceholder")} required rows={6} error={errors.message?.message} {...register("message")} />
      <Controller
        control={control}
        name="attachment"
        render={({ field, fieldState }) => (
          <FileField id="contact-attachment" className="sm:col-span-2" label={t("fields.attachment")} optional accept={ATTACHMENT_ACCEPT} value={field.value} onChange={field.onChange} onBlur={field.onBlur} error={fieldState.error?.message} />
        )}
      />
      {serverError && <FormAlert className="sm:col-span-2">{serverError}</FormAlert>}
      <div className="sm:col-span-2">
        <SubmitButton loading={isSubmitting} loadingLabel={t("submit.sending")} icon={<Send />}>
          {t("submit.contact")}
        </SubmitButton>
      </div>
    </form>
  );
}
