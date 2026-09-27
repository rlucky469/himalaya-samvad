"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, AtSign } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useRouter } from "@/i18n/navigation";
import { TextInput } from "@/components/forms/fields/TextInput";
import { PasswordField } from "@/components/forms/fields/PasswordField";
import { CheckboxField } from "@/components/forms/fields/CheckboxField";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { FormAlert } from "@/components/forms/FormAlert";
import { useSubmitError } from "@/components/forms/useSubmitError";
import { loginSchema } from "@/lib/validation/schemas";
import { authService, buildLoginPayload } from "@/services/auth.service";
import { ApiError } from "@/services/api/errors";
import { flowStore } from "@/services/api/session-storage";
import { useAuth } from "@/providers/AuthProvider";
import { routes } from "@/config/routes";
import { safeNextPath } from "./safe-next";

export function LoginForm() {
  const t = useTranslations("auth.login");
  const tf = useTranslations("forms");
  const router = useRouter();
  const next = safeNextPath(useSearchParams().get("next"));
  const { signIn } = useAuth();
  const [serverError, setServerError] = useState("");
  const form = useForm({ resolver: zodResolver(loginSchema), defaultValues: { identifier: "", password: "", rememberMe: true }, mode: "onTouched" });
  const { register, handleSubmit, formState } = form;
  const { errors, isSubmitting } = formState;
  const toMessage = useSubmitError(form.setError);

  const onSubmit = handleSubmit(async (values) => {
    setServerError("");
    try {
      const session = await authService.login(buildLoginPayload(values));
      signIn(session, values.rememberMe);
      router.replace(next);
    } catch (error) {
      // Backend contract: 403 + code ACCOUNT_NOT_VERIFIED + errors.userId when OTPs are still pending
      if (error instanceof ApiError && error.code === "ACCOUNT_NOT_VERIFIED" && error.fieldErrors?.userId) {
        const isEmail = values.identifier.includes("@");
        flowStore.setVerification({ userId: error.fieldErrors.userId, name: "", email: isEmail ? values.identifier : "", mobile: isEmail ? "" : values.identifier });
        router.push(routes.verify);
        return;
      }
      setServerError(toMessage(error));
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4 short:space-y-3">
      <TextInput id="login-identifier" variant="filled" icon={<AtSign />} label={tf("fields.identifier")} placeholder={tf("fields.identifierPlaceholder")} autoComplete="username" required error={errors.identifier?.message} {...register("identifier")} />
      <PasswordField id="login-password" variant="filled" label={tf("fields.password")} placeholder="••••••••" autoComplete="current-password" required error={errors.password?.message} {...register("password")} />
      <div className="flex items-center justify-between gap-3">
        <CheckboxField id="login-remember" label={t("remember")} {...register("rememberMe")} />
        <Link href={routes.forgotPassword} className="shrink-0 text-sm font-bold text-primary hover:text-accent">
          {t("forgot")}
        </Link>
      </div>
      {serverError && <FormAlert>{serverError}</FormAlert>}
      <SubmitButton loading={isSubmitting} loadingLabel={tf("submit.sending")} icon={<ArrowRight />} className="w-full short:py-3">
        {t("submit")}
      </SubmitButton>
    </form>
  );
}
