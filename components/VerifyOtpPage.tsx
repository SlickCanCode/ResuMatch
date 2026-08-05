"use client";

import { ArrowLeft } from "lucide-react";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { useRouter } from "next/navigation";

export default function VerifyOtpPage() {
  const OTP_LENGTH = 6;
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const purpose = searchParams.get("purpose");
  const router = useRouter();

  // if(!email) {
  //   window.location.href = "/register";
  // }

  const [code, setCode] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [timeLeft, setTimeLeft] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const [error,setError] = useState("");
  const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL!;

  const maskEmail = (email: string) => {
    if (!email) return "";

    const [name, domain] = email.split("@");

      if (name.length <= 4) return email;

      return `${name.slice(0, 3)}${"*".repeat(
          name.length - 3
      )}@${domain}`;
  };

  const inputs = useRef<(HTMLInputElement | null)[]>([]);
    useEffect(() => {
      inputs.current[0]?.focus();
  }, []);
  
  useEffect(() => {
    if (timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const updated = [...code];
    updated[index] = value;
    setCode(updated);

    if (updated.every((d) => d !== "")) {
        setTimeout(() => {
            verifyOtp(updated.join(""));
        }, 150);
    }

    if (value && index < OTP_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace") {
      if (code[index]) {
        const updated = [...code];
        updated[index] = "";
        setCode(updated);
      } else if (index > 0) {
        inputs.current[index - 1]?.focus();
      }
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (text: string) => {
    const values = text
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH)
      .split("");

    if (!values.length) return;

    const updated = [...code];

    values.forEach((digit, index) => {
      updated[index] = digit;
    });

    setCode(updated);

    const lastIndex = Math.min(values.length - 1, OTP_LENGTH - 1);
    inputs.current[lastIndex]?.focus();
  };

  const verifyOtp = async (verificationCode?: string) => {
    const otp = verificationCode ?? code.join("");
    setIsLoading(true);

    const response = await fetch(`${API_URL}/api/v1/auth/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", 
      body: JSON.stringify({
        otp,
        email,
        purpose,
      }),
    });

     if (response.ok) {
       const result = await response.json();
          if (purpose === "register") {
      window.location.href = "/dashboard";
    } else if (purpose === "reset-password") {
        const resetToken = result.resetToken;
            router.push(
        `/login/recovery/reset-password?rt=${encodeURIComponent(resetToken)}`
      );

    }
    } else {
      const result = await response.json();
      setError(result.message);
    }
      setIsLoading(false);
  };

  const handleSubmit = () => {
    verifyOtp(code.join(""));
  };

  const handleResend = async () => {
    if (timeLeft > 0) return;


    const response = await fetch(`${API_URL}/api/v1/auth/send-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const result = await response.json();
      setError(result.message);
      console.error("Error:", error);
    }
    setCode(Array(OTP_LENGTH).fill(""));
    setTimeLeft(60);
    inputs.current[0]?.focus();
  };

  const formattedTime = `${String(Math.floor(timeLeft / 60)).padStart(
    2,
    "0"
  )}:${String(timeLeft % 60).padStart(2, "0")}`;

  const otp = code.join("");

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl sm:p-10">
        {/* Heading */}

        <div className="space-y-3 text-center">
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Check your email
          </h1>

          <p className="text-sm leading-6 text-slate-500">
            Please enter the six digit verification code we sent to
          </p>

          <p className="font-semibold text-slate-700">
            {maskEmail(email? email : "")}
          </p>
        </div>
          {error && (
           <Alert variant="destructive">
              <AlertTitle>Verification Failed</AlertTitle>
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          )}
        {/* OTP */}

        <div
          className="mt-10 flex justify-center gap-2 sm:gap-3"
          onPaste={(e) => {
            e.preventDefault();
            handlePaste(e.clipboardData.getData("text"));
          }}
        >
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputs.current[index] = el;
              }}
              value={digit}
              maxLength={1}
              inputMode="numeric"
              autoComplete="one-time-code"
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onFocus={(e) => e.target.select()}
              className="
                h-12 w-12
                sm:h-14 sm:w-14
                
                rounded-xl
                border-2
                border-slate-200
                bg-white
                text-center
                text-xl
                font-semibold
                text-slate-900
                outline-none
                transition-all
                duration-200
                focus:border-black
                focus:ring-4
                focus:ring-black/10
              "
            />
          ))}
        </div>

        {/* Button */}

        <button
          disabled={otp.length !== OTP_LENGTH || isLoading}
          onClick={handleSubmit}
          className="
            mt-10
            h-14
            w-full
            rounded-full
            bg-black
            text-white
            font-medium
            transition
            duration-200
            hover:bg-neutral-800
            disabled:cursor-not-allowed
            disabled:bg-neutral-300
          "
        >
          Confirm {isLoading && "..."}
        </button>

        {/* Resend */}

        <div className="mt-7 text-center text-sm text-slate-500">
          Didn't receive the email?{" "}
          {timeLeft > 0 ? (
            <span className="font-medium text-slate-700">
              Resend in {formattedTime}
            </span>
          ) : (
            <button
              onClick={handleResend}
              className="font-medium text-black hover:underline"
            >
              Resend code
            </button>
          )}
        </div>

        {/* Back */}

        <button className="mx-auto mt-8 flex items-center gap-2 text-slate-500 transition hover:text-black" 
          onClick={() => window.location.href = "/register"}
          >
          <ArrowLeft size={18} />
          Back
        </button>
      </div>
    </main>
  );
}