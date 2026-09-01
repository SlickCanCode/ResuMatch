"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api-client";
import { sendOtp } from "@/lib/authApi";
import { ArrowRight, CheckCircle2, MailCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type VerifyEmailPromptProps = {
  email: string;
  purpose: string;
};

function maskEmail(email: string) {
  const [name, domain] = email.split("@");

  if (!name || !domain || name.length <= 4) return email;

  return `${name.slice(0, 3)}${"*".repeat(name.length - 3)}@${domain}`;
}

export default function VerifyEmailPrompt({ email, purpose }: VerifyEmailPromptProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async () => {
    setError("");
    setIsLoading(true);

    try {
      await sendOtp(email);
      router.push(
        `/verify-email?email=${encodeURIComponent(email)}&purpose=${encodeURIComponent(purpose)}&step=otp`
      );
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : "Failed to send the verification code."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-muted/30 px-4 py-10">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

      <section className="relative w-full max-w-lg rounded-3xl border border-border bg-background p-7 shadow-xl sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
          <MailCheck className="h-8 w-8" />
        </div>

        <div className="mt-7 space-y-3 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
            One quick step
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Verify your email
          </h1>
          <p className="mx-auto max-w-sm leading-6 text-muted-foreground">
            Keep your account secure and unlock every ResuMatch feature by confirming your email address.
          </p>
          <p className="font-semibold text-foreground">{maskEmail(email)}</p>
        </div>

        <div className="mt-8 space-y-3 rounded-2xl bg-muted/60 p-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />
            <span>Protect your account and recovery options</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />
            <span>Receive a six-digit code in seconds</span>
          </div>
        </div>

        {error && (
          <Alert className="mt-6" variant="destructive">
            <AlertTitle>Could not send code</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="mt-8 space-y-3">
          <Button className="h-12 w-full gap-2" disabled={isLoading || !email} onClick={handleVerify}>
            {isLoading ? "Sending code..." : "Verify email"}
            {!isLoading && <ArrowRight className="h-4 w-4" />}
          </Button>
          <Button
            className="h-12 w-full"
            variant="ghost"
            disabled={isLoading}
            onClick={() => router.push("/dashboard")}
          >
            Skip for now
          </Button>
        </div>
      </section>
    </main>
  );
}