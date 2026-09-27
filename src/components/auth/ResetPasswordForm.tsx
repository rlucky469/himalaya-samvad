"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { ArrowRight, CheckCircle2, Clock, LogIn, Smartphone } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Link } from "@/i18n/navigation";
import { OtpInput } from "@/components/forms/fields/OtpInput";
import { PasswordField } from "@/components/forms/fields/PasswordField";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { FormAlert } from "@/components/forms/FormAlert";
import { ButtonLink } from "@/components/ui/Button";
import { useSubmitError } from "@/components/forms/useSubmitError";
import { resetSchema } from "@/lib/validation/schemas";
import { authService, buildResetPayload } from "@/services/auth.service";
import { flowStore, type PendingReset } from "@/services/api/session-storage";
import { routes } from "@/config/routes";
import { AuthHeading } from "./AuthHeading";
import { AuthStepper } from "./AuthStepper";
import { useCountdown } from "./useCountdown";

const formatSeconds = (s: number) => `00:${String(s).padStart(2, "0")}`;

export function ResetPasswordForm() {
  const t = useTranslations("auth.reset");
  const tvf = useTranslations("auth.verify");
  const tp = useTranslations("auth.password");
  const tf = useTranslations("forms");
  const tv = useTranslations("validation");
  const [pending, setPending] = useState<PendingReset | null | undefined>(undefined);
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState("");
  const { seconds, restart } = useCountdown(30);
  const form = useForm({ resolver: zodResolver(resetSchema), defaultValues: { otp: "", password: "", confirmPassword: "" }, mode: "onTouched" });
  const { register, handleSubmit, control, formState } = form;
  const { errors, isSubmitting } = formState;
  const password = useWatch({ control, name: "password" });
  const toMessage = useSubmitError(form.setError);
  const steps = t.raw("steps") as string[];

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- pending data lives in sessionStorage
    setPending(flowStore.getReset());
  }, []);

  const header = (
    <>
      <AuthStepper steps={steps} current={done ? 2 : 1} label={t("title")} />
      <div className="mt-5 short:mt-3">
        <AuthHeading title={t("title")} subtitle={done ? undefined : t("subtitle")} />
      </div>
    </>
  );

  if (pending === undefined) return <div className="h-80 animate-pulse rounded-card bg-mist" />;

  if (done)
    return (
      <div>
        {header}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-6 flex gap-4 rounded-card bg-nature-soft p-5 sm:p-6">
          <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl bg-nature/15 text-nature">
            <CheckCircle2 className="size-7" />
          </span>
          <div>
            <h2 className="text-xl text-nature sm:text-2xl">{t("successTitle")}</h2>
            <p className="mt-1.5 text-sm text-ink-soft">{t("successText")}</p>
            <ButtonLink href={routes.login} variant="navy" size="sm" className="mt-4" icon={<LogIn />}>
              {t("loginCta")}
            </ButtonLink>
          </div>
        </motion.div>
      </div>
    );

  if (!pending)
    return (
      <div>
        {header}
        <FormAlert tone="info" className="mt-6">
          {t("missing")}{" "}
          <Link href={routes.forgotPassword} className="font-semibold underline">
            {tvf("sendOtp")}
          </Link>
        </FormAlert>
      </div>
    );

  const onSubmit = handleSubmit(async (values) => {
    setServerError("");
    try {
      await authService.resetPassword(buildResetPayload(pending.identifier, values));
      flowStore.clearReset();
      setDone(true);
    } catch (error) {
      setServerError(toMessage(error));
    }
  });

  const resend = async () => {
    try {
      await authService.forgotPassword({ identifier: pending.identifier, identifierType: pending.identifierType });
      restart(30);
    } catch (error) {
      setServerError(toMessage(error));
    }
  };

  return (
    <div>
      {header}
      <form onSubmit={onSubmit} noValidate className="mt-5 space-y-4 short:mt-3 short:space-y-2.5">
        <div className="rounded-card bg-primary-tint p-4 short:p-3">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-bold text-ink">
              {t("otpLabel")} <span className="text-accent">*</span>
            </p>
            <span className="inline-flex items-center gap-1.5 rounded-md bg-surface px-2 py-1 text-xs font-medium text-ink-soft shadow-card">
              <Smartphone aria-hidden className="size-3.5" />
              {pending.maskedTarget}
            </span>
          </div>
          <Controller control={control} name="otp" render={({ field }) => <OtpInput id="reset-otp" label={t("otpLabel")} value={field.value} onChange={field.onChange} invalid={!!errors.otp} />} />
          {errors.otp?.message && <p role="alert" className="mt-2 text-sm font-medium text-accent">{tv(errors.otp.message as never)}</p>}
          <div className="mt-3 flex items-center justify-between gap-3 text-xs">
            <button type="button" onClick={resend} disabled={seconds > 0} className="inline-flex items-center gap-1.5 font-semibold text-primary hover:text-accent disabled:cursor-not-allowed disabled:text-muted">
              <Clock aria-hidden className="size-3.5" />
              {tvf("resend")}
              {seconds > 0 && <span className="font-mono text-accent">({formatSeconds(seconds)})</span>}
            </button>
            <Link href={routes.forgotPassword} className="font-semibold text-ink-soft underline underline-offset-2 hover:text-primary">
              {t("change")}
            </Link>
          </div>
        </div>
        <PasswordField id="reset-password" variant="filled" label={tf("fields.newPassword")} placeholder={tf("fields.passwordPlaceholder")} autoComplete="new-password" required showStrength hint={tp("hint")} value={password} error={errors.password?.message} {...register("password")} />
        <PasswordField id="reset-confirm" variant="filled" label={tf("fields.confirmPassword")} placeholder={tf("fields.confirmPasswordPlaceholder")} autoComplete="new-password" required error={errors.confirmPassword?.message} {...register("confirmPassword")} />
        {serverError && <FormAlert>{serverError}</FormAlert>}
        <SubmitButton loading={isSubmitting} loadingLabel={tf("submit.sending")} icon={<ArrowRight />} className="w-full short:py-3">
          {t("submit")}
        </SubmitButton>
      </form>
    </div>
  );
}
