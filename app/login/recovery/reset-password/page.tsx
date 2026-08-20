"use client";

import Link from "next/link";
import {Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Check, Eye, EyeOff, FileText, Loader2, Lock } from "lucide-react";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ApiError } from "@/lib/api-client";
import { resetPassword } from "@/lib/authApi";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const resetToken = searchParams.get("rt");
  if (!resetToken) {
    window.location.href = "/login";
  }


  const passwordChecks = useMemo(
    () => ({
      length: password.length >= 6,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
    }),
    [password]
  );

  const isPasswordValid =
    passwordChecks.length &&
    passwordChecks.uppercase &&
    passwordChecks.lowercase &&
    passwordChecks.number;

  const passwordsMatch =
    password.length > 0 &&
    password === confirmPassword;

  const canSubmit = isPasswordValid && passwordsMatch;

  const handleSubmit = async (
    e: React.SubmitEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!canSubmit || !resetToken) return;
    const newPassword = password;
    setIsLoading(true);

    try {
      await resetPassword(newPassword, resetToken);
        window.location.href = "/login";
      } catch (error) {
        setError(error instanceof ApiError ? error.message : "Failed to reset password. Please try again.");
      } finally {
        setIsLoading(false);
      }

  };

  const Requirement = ({
    label,
    valid,
  }: {
    label: string;
    valid: boolean;
  }) => (
    <div
      className={`flex items-center gap-2 text-sm ${
        valid ? "text-green-600" : "text-slate-500"
      }`}
    >
      <Check
        size={16}
        className={
          valid
            ? "text-green-600"
            : "text-slate-300"
        }
      />

      {label}
    </div>
  );

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl sm:p-10">

        {/* Icon */}

        <div className="mb-8 flex justify-center">
              <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center">
                <FileText className="w-7 h-7 text-primary-foreground" />
              </div>
        </div>

        {/* Heading */}

        <div className="space-y-3 text-center">
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Create new password
          </h1>

          <p className="text-sm leading-6 text-slate-500">
            Your new password must be different from
            any password you've used before.
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

        {/* Form */}

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >
          {/* Password */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              New Password
            </label>

            <div className="flex h-14 items-center rounded-xl border border-slate-200 px-4 transition focus-within:border-black focus-within:ring-4 focus-within:ring-black/10">
              <Lock
                size={20}
                className="mr-3 text-slate-400"
              />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Enter your password"
                className="w-full bg-transparent outline-none"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
              >
                {showPassword ? (
                  <EyeOff
                    size={20}
                    className="text-slate-400"
                  />
                ) : (
                  <Eye
                    size={20}
                    className="text-slate-400"
                  />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Confirm Password
            </label>

            <div className="flex h-14 items-center rounded-xl border border-slate-200 px-4 transition focus-within:border-black focus-within:ring-4 focus-within:ring-black/10">
              <Lock
                size={20}
                className="mr-3 text-slate-400"
              />

              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                placeholder="Confirm your password"
                className="w-full bg-transparent outline-none"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
              >
                {showConfirmPassword ? (
                  <EyeOff
                    size={20}
                    className="text-slate-400"
                  />
                ) : (
                  <Eye
                    size={20}
                    className="text-slate-400"
                  />
                )}
              </button>
            </div>

            {confirmPassword.length > 0 &&
              !passwordsMatch && (
                <p className="mt-2 text-sm text-red-500">
                  Passwords do not match.
                </p>
              )}
          </div>

          {/* Password Requirements */}

          <div className="rounded-xl bg-slate-50 p-4">
            <p className="mb-3 text-sm font-semibold text-slate-700">
              Password requirements
            </p>

            <div className="space-y-2">
              <Requirement
                label="At least 8 characters"
                valid={passwordChecks.length}
              />

              <Requirement
                label="One uppercase letter"
                valid={
                  passwordChecks.uppercase
                }
              />

              <Requirement
                label="One lowercase letter"
                valid={
                  passwordChecks.lowercase
                }
              />

              <Requirement
                label="One number"
                valid={passwordChecks.number}
              />
            </div>
          </div>

          {/* Submit */}

          <button
            type="submit"
            disabled={!canSubmit || isLoading}
            className="flex h-14 w-full items-center justify-center rounded-full bg-black font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
          >
            {isLoading ? (
              <>
                <Loader2
                  size={18}
                  className="mr-2 animate-spin"
                />
                Updating Password...
              </>
            ) : (
              "Update Password"
            )}
          </button>
        </form>

        {/* Back */}

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