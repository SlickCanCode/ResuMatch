"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { ApiError } from "@/lib/api-client";
import { Skeleton } from "@/components/ui/skeleton";

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
      <div className="min-h-screen bg-muted/30 p-4 lg:p-6">
        <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl gap-6">
          <Skeleton className="hidden w-64 shrink-0 rounded-xl md:block" />
          <div className="flex flex-1 flex-col gap-6">
            <Skeleton className="h-16 w-full rounded-xl" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-80 max-w-full" />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="h-28 rounded-xl" />
                ))}
              </div>
              <Skeleton className="h-72 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
