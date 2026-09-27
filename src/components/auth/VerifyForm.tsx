"use client";

import { motion } from "motion/react";
import { ArrowRight, BookOpen, CheckCircle2, Clock, Loader2, Mail, PencilLine, RefreshCw, Smartphone } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { OtpInput } from "@/components/forms/fields/OtpInput";
import { FormAlert } from "@/components/forms/FormAlert";
import { Button, ButtonLink } from "@/components/ui/Button";
import { useSubmitError } from "@/components/forms/useSubmitError";
import { authService } from "@/services/auth.service";
import { flowStore, type PendingVerification } from "@/services/api/session-storage";
import { useAuth } from "@/providers/AuthProvider";
import { OTP_RE } from "@/lib/validation/schemas";
import { routes } from "@/config/routes";
import type { AuthSession, OtpChannel } from "@/types/api";
import { AuthHeading } from "./AuthHeading";
import { AuthStepper } from "./AuthStepper";
import { useCountdown } from "./useCountdown";
import { cn } from "@/lib/utils";

const RESEND_SECONDS = 30;
const formatSeconds = (s: number) => `00:${String(s).padStart(2, "0")}`;

interface ChannelCardProps {
  channel: OtpChannel;
  target: string;
  userId: string;
  otp: string;
  error: string;
  verified: boolean;
  busy: boolean;
  onOtpChange: (value: string) => void;
  onResendError: (message: string) => void;
}

function ChannelCard({ channel, target, userId, otp, error, verified, busy, onOtpChange, onResendError }: ChannelCardProps) {
  const t = useTranslations("auth.verify");
  const { seconds, restart } = useCountdown(RESEND_SECONDS);
  const toMessage = useSubmitError();
  const Icon = channel === "mobile" ? Smartphone : Mail;
  const title = channel === "mobile" ? t("mobileTitle") : t("emailTitle");

  const resend = async () => {
    try {
      const res = await authService.sendOtp({ userId, channel, target, purpose: "verify" });
      restart(res.retryAfterSeconds ?? RESEND_SECONDS);
    } catch (e) {
      onResendError(toMessage(e));
    }
  };

  return (
    <section className={cn("rounded-card border p-4 transition-colors short:p-3", verified ? "border-nature/30 bg-nature-soft/60" : error ? "border-accent/40 bg-surface" : "border-primary/25 bg-surface shadow-card")}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-lg">
          <Icon aria-hidden className="size-5 text-primary" />
          {title}
        </h2>
        <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold", verified ? "bg-nature/15 text-nature" : "bg-cta-soft text-cta")}>
          {verified ? <CheckCircle2 className="size-3.5" /> : <RefreshCw className="size-3.5" />}
          {verified ? t("statusVerified") : t("statusPending")}
        </span>
      </div>
      <p className="mt-1 text-sm text-ink-soft">{t(channel === "mobile" ? "mobileText" : "emailText", { target: channel === "mobile" ? `+91 ${target}` : target })}</p>
      <div className="mt-3 short:mt-2">
        <OtpInput id={`otp-${channel}`} label={title} value={otp} onChange={onOtpChange} invalid={!!error} disabled={verified || busy} tone={verified ? "success" : "default"} />
      </div>
      {verified ? (
        <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-nature">
          <CheckCircle2 className="size-3.5" />
          {channel === "mobile" ? t("mobileVerifiedNote") : t("emailVerifiedNote")}
        </p>
      ) : (
        <>
          {error && <p role="alert" className="mt-2 text-sm font-medium text-accent">{error}</p>}
          <button type="button" onClick={resend} disabled={seconds > 0} className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-accent disabled:cursor-not-allowed disabled:text-ink-soft">
            <Clock aria-hidden className="size-3.5" />
            {t("resend")}
            {seconds > 0 && <span className="font-bold">({formatSeconds(seconds)})</span>}
          </button>
        </>
      )}
    </section>
  );
}

export function VerifyForm() {
  const t = useTranslations("auth.verify");
  const tr = useTranslations("auth.register");
  const tv = useTranslations("validation");
  const { signIn } = useAuth();
  const toMessage = useSubmitError();
  const [pending, setPending] = useState<PendingVerification | null | undefined>(undefined);
  const [otp, setOtp] = useState<Record<OtpChannel, string>>({ mobile: "", email: "" });
  const [errors, setErrors] = useState<Record<OtpChannel, string>>({ mobile: "", email: "" });
  const [verified, setVerified] = useState<Record<OtpChannel, boolean>>({ mobile: false, email: false });
  const [busy, setBusy] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [session, setSession] = useState<AuthSession | undefined>();
  const steps = t.raw("steps") as string[];

  useEffect(() => {
    setPending(flowStore.getVerification());
  }, []);

  // A channel the user never gave (e.g. unverified login by email only) counts as done
  const needs: Record<OtpChannel, boolean> = { mobile: Boolean(pending?.mobile), email: Boolean(pending?.email) };
  const complete = Boolean(pending) && (!needs.mobile || verified.mobile) && (!needs.email || verified.email);

  useEffect(() => {
    if (!complete) return;
    if (session) signIn(session, true);
    flowStore.clearVerification();
  }, [complete, session, signIn]);

  const heading = (
    <>
      <AuthStepper steps={steps} current={complete ? 2 : 1} label={t("title")} />
      <div className="mt-5 short:mt-3">
        <AuthHeading title={t("title")} subtitle={complete ? undefined : t("subtitle")} />
      </div>
    </>
  );

  if (pending === undefined) return <div className="h-80 animate-pulse rounded-card bg-mist" />;

  if (!pending)
    return (
      <div>
        {heading}
        <FormAlert tone="info" className="mt-6">
          {t("missing")}{" "}
          <Link href={routes.register} className="font-semibold underline">
            {tr("title")}
          </Link>
        </FormAlert>
      </div>
    );

  if (complete)
    return (
      <div>
        {heading}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-6 rounded-card bg-nature-soft p-6 text-center">
          <CheckCircle2 className="mx-auto size-12 text-nature" />
          <h2 className="mt-3 text-2xl text-nature">{t("doneTitle")}</h2>
          <p className="mt-2 text-ink-soft">{t("doneText")}</p>
          <ButtonLink href={routes.currentIssueReader} className="mt-5 w-full" icon={<BookOpen />} iconPosition="start">
            {t("doneCta")}
          </ButtonLink>
        </motion.div>
      </div>
    );

  const channels = (["mobile", "email"] as const).filter((c) => needs[c]);

  // One button verifies every channel that still needs it
  const verifyAll = async () => {
    setGeneralError("");
    const todo = channels.filter((c) => !verified[c]);
    const invalid = todo.filter((c) => !OTP_RE.test(otp[c]));
    if (invalid.length) {
      setErrors((prev) => ({ ...prev, ...Object.fromEntries(invalid.map((c) => [c, tv("otpInvalid")])) }));
      return;
    }
    setBusy(true);
    for (const channel of todo) {
      try {
        const target = channel === "mobile" ? pending.mobile : pending.email;
        const res = await authService.verifyOtp({ userId: pending.userId, channel, target, otp: otp[channel] });
        setVerified((prev) => ({ ...prev, [channel]: true }));
        setErrors((prev) => ({ ...prev, [channel]: "" }));
        if (res.session) setSession(res.session);
      } catch (e) {
        setErrors((prev) => ({ ...prev, [channel]: toMessage(e) || tv("otpInvalid") }));
      }
    }
    setBusy(false);
  };

  return (
    <div>
      {heading}
      <div className="mt-5 space-y-3 short:mt-3 short:space-y-2">
        {channels.map((channel) => (
          <ChannelCard
            key={channel}
            channel={channel}
            target={channel === "mobile" ? pending.mobile : pending.email}
            userId={pending.userId}
            otp={otp[channel]}
            error={errors[channel]}
            verified={verified[channel]}
            busy={busy}
            onOtpChange={(value) => {
              setOtp((prev) => ({ ...prev, [channel]: value }));
              setErrors((prev) => ({ ...prev, [channel]: "" }));
            }}
            onResendError={setGeneralError}
          />
        ))}
      </div>
      <div className="mt-2 text-right">
        <Link href={routes.register} className="inline-flex items-center gap-1 text-xs font-semibold text-primary underline underline-offset-2 hover:text-accent">
          {t("changeDetails")}
          <PencilLine aria-hidden className="size-3.5" />
        </Link>
      </div>
      {generalError && <FormAlert className="mt-3">{generalError}</FormAlert>}
      <Button type="button" size="lg" onClick={verifyAll} disabled={busy} className="mt-4 w-full short:mt-2 short:py-3" icon={busy ? <Loader2 className="animate-spin" /> : <ArrowRight />}>
        {t("submit")}
      </Button>
      <p className="mt-2.5 text-center text-xs text-muted">{t("note")}</p>
    </div>
  );
}
