"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { TextInput } from "./fields/TextInput";
import { TextArea } from "./fields/TextArea";
import { SelectField, type SelectOption } from "./fields/SelectField";
import { SubmitButton } from "./SubmitButton";
import { FormAlert } from "./FormAlert";
import { FormSuccess } from "./FormSuccess";
import { useSubmitError } from "./useSubmitError";
import { useQueryPreset } from "./useQueryPreset";
import { advertiseSchema } from "@/lib/validation/schemas";
import { buildAdvertisePayload, formsService } from "@/services/forms.service";
import type { Locale } from "@/types/api";

const defaults = { name: "", organization: "", email: "", mobile: "", adSlot: "", issueMonth: "", message: "" };

export function AdvertiseForm({ slots }: { slots: SelectOption[] }) {
  const t = useTranslations("forms");
  const locale = useLocale() as Locale;
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState("");
  const form = useForm({ resolver: zodResolver(advertiseSchema), defaultValues: defaults, mode: "onTouched" });
  const { register, handleSubmit, reset, setValue, formState } = form;
  const { errors, isSubmitting } = formState;
  const toMessage = useSubmitError(form.setError);

  useQueryPreset("slot", slots.map((s) => s.value), (v) => setValue("adSlot", v));

  const onSubmit = handleSubmit(async (values) => {
    setServerError("");
    try {
      await formsService.advertise(buildAdvertisePayload(values, locale));
      setSent(true);
      reset(defaults);
    } catch (error) {
      setServerError(toMessage(error));
    }
  });

  if (sent) return <FormSuccess title={t("success.title")} message={t("success.advertise")} againLabel={t("success.again")} onAgain={() => setSent(false)} />;

  return (
    <form onSubmit={onSubmit} noValidate className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <TextInput id="ad-name" label={t("fields.name")} placeholder={t("fields.namePlaceholder")} autoComplete="name" required error={errors.name?.message} {...register("name")} />
      <TextInput id="ad-organization" label={t("fields.organization")} placeholder={t("fields.organizationPlaceholder")} autoComplete="organization" required error={errors.organization?.message} {...register("organization")} />
      <TextInput id="ad-email" type="email" label={t("fields.email")} placeholder={t("fields.emailPlaceholder")} autoComplete="email" required error={errors.email?.message} {...register("email")} />
      <TextInput id="ad-mobile" type="tel" inputMode="numeric" prefix="+91" label={t("fields.mobile")} placeholder={t("fields.mobilePlaceholder")} autoComplete="tel-national" required error={errors.mobile?.message} {...register("mobile")} />
      <SelectField id="ad-slot" label={t("fields.adSlot")} placeholder={t("fields.adSlotPlaceholder")} options={slots} required error={errors.adSlot?.message} {...register("adSlot")} />
      <TextInput id="ad-issue-month" label={t("fields.issueMonth")} placeholder={t("fields.issueMonthPlaceholder")} optional error={errors.issueMonth?.message} {...register("issueMonth")} />
      <TextArea id="ad-message" className="sm:col-span-2" label={t("fields.message")} placeholder={t("fields.messagePlaceholder")} required rows={5} error={errors.message?.message} {...register("message")} />
      {serverError && <FormAlert className="sm:col-span-2">{serverError}</FormAlert>}
      <div className="sm:col-span-2">
        <SubmitButton loading={isSubmitting} loadingLabel={t("submit.sending")} icon={<Send />}>
          {t("submit.advertise")}
        </SubmitButton>
      </div>
    </form>
  );
}
