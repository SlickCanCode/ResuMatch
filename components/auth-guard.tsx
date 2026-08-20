"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { ApiError } from "@/lib/api-client";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: user, isPending, error } = useCurrentUser();
  const isUnauthorized =
    error instanceof ApiError && (error.status === 401 || error.status === 403);

  useEffect(() => {
    if (!isPending && (!user || isUnauthorized)) {
      router.replace("/login");
    }
  }, [isPending, isUnauthorized, router, user]);

  if (isPending || !user || isUnauthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Checking your session...</p>
      </div>
    );
  }

  return children;
}
