"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Mail, MapPin, UserRound } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Link, useRouter } from "@/i18n/navigation";
import { TextInput } from "@/components/forms/fields/TextInput";
import { PasswordField } from "@/components/forms/fields/PasswordField";
import { CheckboxField } from "@/components/forms/fields/CheckboxField";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { FormAlert } from "@/components/forms/FormAlert";
import { useSubmitError } from "@/components/forms/useSubmitError";
import { registerSchema } from "@/lib/validation/schemas";
import { authService, buildRegisterPayload } from "@/services/auth.service";
import { flowStore } from "@/services/api/session-storage";
import { routes } from "@/config/routes";
import type { Locale } from "@/types/api";

export function RegisterForm() {
  const t = useTranslations("auth.register");
  const tp = useTranslations("auth.password");
  const tf = useTranslations("forms");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", mobile: "", city: "", password: "", acceptTerms: false },
    mode: "onTouched",
  });
  const { register, handleSubmit, control, formState } = form;
  const { errors, isSubmitting } = formState;
  const password = useWatch({ control, name: "password" });
  const toMessage = useSubmitError(form.setError);

  const onSubmit = handleSubmit(async (values) => {
    setServerError("");
    try {
      const result = await authService.register(buildRegisterPayload(values, locale));
      flowStore.setVerification({ userId: result.userId, name: values.name, email: values.email, mobile: values.mobile });
      router.push(routes.verify);
    } catch (error) {
      setServerError(toMessage(error));
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-3.5 short:space-y-2.5">
      <TextInput id="reg-name" variant="filled" icon={<UserRound />} label={tf("fields.name")} placeholder={tf("fields.namePlaceholder")} autoComplete="name" required error={errors.name?.message} {...register("name")} />
      <TextInput id="reg-email" variant="filled" icon={<Mail />} type="email" label={tf("fields.email")} placeholder={tf("fields.emailPlaceholder")} autoComplete="email" required error={errors.email?.message} {...register("email")} />
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-[1.4fr_1fr] short:gap-2.5">
        <TextInput id="reg-mobile" variant="filled" type="tel" inputMode="numeric" prefix="+91" label={tf("fields.mobile")} placeholder={tf("fields.mobilePlaceholder")} autoComplete="tel-national" required error={errors.mobile?.message} {...register("mobile")} />
        <TextInput id="reg-city" variant="filled" icon={<MapPin />} label={tf("fields.city")} placeholder={tf("fields.cityPlaceholder")} autoComplete="address-level2" required error={errors.city?.message} {...register("city")} />
      </div>
      <PasswordField id="reg-password" variant="filled" label={tf("fields.password")} placeholder={tf("fields.passwordPlaceholder")} autoComplete="new-password" required showStrength hint={tp("hint")} value={password} error={errors.password?.message} {...register("password")} />
      <CheckboxField
        id="reg-terms"
        error={errors.acceptTerms?.message}
        label={t.rich("terms", {
          terms: (chunks) => (
            <Link href={routes.terms} target="_blank" className="font-semibold text-primary underline decoration-cta underline-offset-2">
              {chunks}
            </Link>
          ),
          privacy: (chunks) => (
            <Link href={routes.privacy} target="_blank" className="font-semibold text-primary underline decoration-cta underline-offset-2">
              {chunks}
            </Link>
          ),
        })}
        {...register("acceptTerms")}
      />
      {serverError && <FormAlert>{serverError}</FormAlert>}
      <SubmitButton loading={isSubmitting} loadingLabel={tf("submit.sending")} icon={<ArrowRight />} className="w-full short:py-3">
        {t("submit")}
      </SubmitButton>
    </form>
  );
}
