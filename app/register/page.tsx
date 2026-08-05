"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { FileText, Eye, EyeOff, Check } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    console.log("Submitting...");
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    console.log("Form Data:", data);
    setIsLoading(true);
    // Connect to backend API to authenticate user 
    try {
    const response = await fetch("http://localhost:8080/api/v1/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
     const result = await response.json();
    console.log("Response:", result);
    if (response.status === 201) {
      const email = result.email;
      router.push(
        `/verify-email?email=${encodeURIComponent(email)}&purpose=register`
      );

    } else{
      setError(result.message[0] || "Signup failed. Please try again.");
    }
  } catch (error) {
    console.error("Error:", error);
    setError("Failed to connect to server, pls check your internet connection.");
  }
  setIsLoading(false);
  };

  
  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Visual */}
      <div className="hidden lg:flex flex-1 bg-primary items-center justify-center p-12">
        <div className="max-w-md text-primary-foreground space-y-8">
          <h2 className="text-3xl font-bold">Start optimizing your resume today</h2>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-primary-foreground/20 flex items-center justify-center mt-0.5">
                <Check className="w-3 h-3" />
              </div>
              <span>AI-powered resume analysis in seconds</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-primary-foreground/20 flex items-center justify-center mt-0.5">
                <Check className="w-3 h-3" />
              </div>
              <span>ATS compatibility scoring and optimization</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-primary-foreground/20 flex items-center justify-center mt-0.5">
                <Check className="w-3 h-3" />
              </div>
              <span>Job description matching and keyword analysis</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-primary-foreground/20 flex items-center justify-center mt-0.5">
                <Check className="w-3 h-3" />
              </div>
              <span>Personalized improvement recommendations</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Link href="/" className="inline-flex items-center gap-2 mb-8">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-xl">ResuMatch</span>
            </Link>
            <h1 className="text-2xl font-bold mb-2">Create your account</h1>
            <p className="text-muted-foreground">
              Get started with your free account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
           <Alert variant="destructive">
              <AlertTitle>Signup Failed</AlertTitle>
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          )}
              <div className="space-y-2 flex-1 md:flex gap-2">
                <div className="flex-1 space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="John"
                  required
                  className="h-11"
                />
                </div>
                <div className="flex-1 space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="doe"
                  required
                  className="h-11"
                />
                </div>
              </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  required
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Must be at least 6 characters
              </p>
            </div>

            <Button type="submit" className="w-full h-11 cursor-pointer" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create account"}
            </Button>

             {/* " && shows second value if first value is truthy" */}
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="flex justify-center">
            <Button variant="outline" className="h-11 w-full max-w-xs cursor-pointer" onClick={() => window.location.href = "http://localhost:8080/oauth2/authorization/google"}>
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-accent hover:underline font-medium">
              Sign in
            </Link>
          </p>

          <p className="text-center text-xs text-muted-foreground">
            By creating an account, you agree to our{" "}
            <Link href="#" className="underline hover:text-foreground">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="underline hover:text-foreground">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
