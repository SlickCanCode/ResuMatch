"use client";

import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {useRouter} from "next/navigation";

export default function PasswordResetSuccessPage() {
  const [timeLeft, setTimeLeft] = useState(5);
  const router = useRouter();

  useEffect(() => {
    if (timeLeft === 0) {
      router.push("/login");
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          ease: "easeOut",
        }}
        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl sm:p-10"
      >
        {/* Success Icon */}

        <div className="mb-8 flex justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.2,
              duration: 0.45,
              type: "spring",
              stiffness: 200,
              damping: 12,
            }}
            className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100"
          >
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 0.4,
                duration: 0.25,
              }}
            >
              <Check
                size={40}
                className="text-green-600"
                strokeWidth={3}
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Heading */}

        <div className="space-y-3 text-center">
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Password updated
          </h1>

          <p className="text-sm leading-7 text-slate-500">
            Your password has been successfully updated.
            You can now sign in using your new password.
          </p>
        </div>

        {/* Continue Button */}

        <Link
          href="/login"
          className="
            mt-10
            flex
            h-14
            w-full
            items-center
            justify-center
            rounded-full
            bg-black
            font-medium
            text-white
            transition
            duration-200
            hover:bg-neutral-800
          "
        >
          Continue to Sign In
        </Link>

        {/* Redirect Countdown */}

        <p className="mt-5 text-center text-sm text-slate-400">
          Redirecting to sign in in{" "}
          <span className="font-semibold text-slate-600">
            {timeLeft}
          </span>{" "}
          {timeLeft === 1 ? "second" : "seconds"}...
        </p>

        {/* Divider */}

        <div className="my-8 flex items-center">
          <div className="h-px flex-1 bg-slate-200" />

          <span className="mx-4 text-sm text-slate-400">
            or
          </span>

          <div className="h-px flex-1 bg-slate-200" />
        </div>

        {/* Back to Home */}

        <Link
          href="/"
          className="
            mx-auto
            flex
            w-fit
            items-center
            gap-2
            text-slate-500
            transition
            hover:text-black
          "
        >
          <ArrowLeft size={18} />
          Back to Home
        </Link>
      </motion.div>
    </main>
  );
}