"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { TextInput } from "./fields/TextInput";
import { TextArea } from "./fields/TextArea";
import { SelectField, type SelectOption } from "./fields/SelectField";
import { CheckboxField } from "./fields/CheckboxField";
import { SubmitButton } from "./SubmitButton";
import { FormAlert } from "./FormAlert";
import { FormSuccess } from "./FormSuccess";
import { useSubmitError } from "./useSubmitError";
import { useQueryPreset } from "./useQueryPreset";
import { membershipSchema } from "@/lib/validation/schemas";
import { buildMembershipPayload, formsService } from "@/services/forms.service";
import type { Locale } from "@/types/api";

const defaults = { name: "", email: "", mobile: "", address: "", city: "", state: "", pincode: "", plan: "", organization: "", message: "", consentUpdates: true };

export function MembershipForm({ plans }: { plans: SelectOption[] }) {
  const t = useTranslations("forms");
  const locale = useLocale() as Locale;
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState("");
  const form = useForm({ resolver: zodResolver(membershipSchema), defaultValues: defaults, mode: "onTouched" });
  const { register, handleSubmit, reset, setValue, control, formState } = form;
  const { errors, isSubmitting } = formState;
  const toMessage = useSubmitError(form.setError);
  const plan = useWatch({ control, name: "plan" });

  useQueryPreset("plan", plans.map((p) => p.value), (v) => setValue("plan", v, { shouldValidate: false }));

  const onSubmit = handleSubmit(async (values) => {
    setServerError("");
    try {
      await formsService.membership(buildMembershipPayload(values, locale));
      setSent(true);
      reset(defaults);
    } catch (error) {
      setServerError(toMessage(error));
    }
  });

  if (sent) return <FormSuccess title={t("success.title")} message={t("success.membership")} againLabel={t("success.again")} onAgain={() => setSent(false)} />;

  return (
    <form onSubmit={onSubmit} noValidate className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <SelectField id="member-plan" className="sm:col-span-2" label={t("fields.plan")} placeholder={t("fields.planPlaceholder")} options={plans} required error={errors.plan?.message} {...register("plan")} />
      <TextInput id="member-name" label={t("fields.name")} placeholder={t("fields.namePlaceholder")} autoComplete="name" required error={errors.name?.message} {...register("name")} />
      <TextInput id="member-email" type="email" label={t("fields.email")} placeholder={t("fields.emailPlaceholder")} autoComplete="email" required error={errors.email?.message} {...register("email")} />
      <TextInput id="member-mobile" type="tel" inputMode="numeric" prefix="+91" label={t("fields.mobile")} placeholder={t("fields.mobilePlaceholder")} autoComplete="tel-national" required error={errors.mobile?.message} {...register("mobile")} />
      <TextInput
        id="member-organization"
        label={t("fields.organization")}
        placeholder={t("fields.organizationPlaceholder")}
        autoComplete="organization"
        required={plan === "institutional"}
        optional={plan !== "institutional"}
        error={errors.organization?.message}
        {...register("organization")}
      />
      <TextInput id="member-address" className="sm:col-span-2" label={t("fields.address")} placeholder={t("fields.addressPlaceholder")} autoComplete="street-address" required error={errors.address?.message} {...register("address")} />
      <TextInput id="member-city" label={t("fields.city")} placeholder={t("fields.cityPlaceholder")} autoComplete="address-level2" required error={errors.city?.message} {...register("city")} />
      <TextInput id="member-state" label={t("fields.state")} placeholder={t("fields.statePlaceholder")} autoComplete="address-level1" required error={errors.state?.message} {...register("state")} />
      <TextInput id="member-pincode" inputMode="numeric" maxLength={6} label={t("fields.pincode")} placeholder={t("fields.pincodePlaceholder")} autoComplete="postal-code" required error={errors.pincode?.message} {...register("pincode")} />
      <TextArea id="member-message" className="sm:col-span-2" label={t("fields.message")} placeholder={t("fields.messagePlaceholder")} optional rows={4} error={errors.message?.message} {...register("message")} />
      <CheckboxField id="member-consent" className="sm:col-span-2" label={t("fields.consentUpdates")} {...register("consentUpdates")} />
      {serverError && <FormAlert className="sm:col-span-2">{serverError}</FormAlert>}
      <div className="sm:col-span-2">
        <SubmitButton loading={isSubmitting} loadingLabel={t("submit.sending")} icon={<UserPlus />}>
          {t("submit.membership")}
        </SubmitButton>
      </div>
    </form>
  );
}
