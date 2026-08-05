"use client";

import {Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, FileText, Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPassworPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL!;

  const handleSubmit = async (
    e: React.SubmitEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!email.trim()) return;

    setIsLoading(true);

    const response = await fetch(`${API_URL}/api/v1/auth/send-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (response.ok) {
          window.location.href = `/verify-email?email=${encodeURIComponent(email)}&purpose=reset-password`;
    } else 
      {
      const result = await response.json();
      setError(result.message);
    }
    setIsLoading(false);

  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl sm:p-10">

        <div className="mb-8 flex justify-center">
              <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center">
                <FileText className="w-7 h-7 text-primary-foreground" />
              </div>
        </div>

        <div className="space-y-3 text-center">
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Recover your account
          </h1>

          <p className="text-sm leading-6 text-slate-500">
            Enter the email associated with your account.
            We'll send you a six-digit verification code to
            securely reset your password.
          </p>
        </div>
            {error && (
           <Alert variant="destructive">
              <AlertTitle>Recovery Failed</AlertTitle>
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          )}
        <form
          onSubmit={handleSubmit}
          className="mt-10 space-y-6"
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Email Address
            </label>

            <div className="flex h-14 items-center rounded-xl border border-slate-200 px-4 transition focus-within:border-black focus-within:ring-4 focus-within:ring-black/10">
              <Mail
                size={20}
                className="mr-3 text-slate-400"
              />

              <input
                type="email"
                autoComplete="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="w-full bg-transparent outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          <button
            disabled={!email || isLoading}
            className="flex cursor-pointer h-14 w-full items-center justify-center rounded-full bg-black font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
          >
            {isLoading ? (
              <>
                <Loader2
                  className="mr-2 animate-spin"
                  size={18}
                />
                Sending...
              </>
            ) : (
              "Continue"
            )}
          </button>
        </form>

        <Link
          href="/login"
          className="mx-auto mt-8 flex w-fit items-center gap-2 text-slate-500 transition hover:text-black"
        >
          <ArrowLeft size={18} />
          Back to Sign In
        </Link>
      </div>
    </main>
  );
}