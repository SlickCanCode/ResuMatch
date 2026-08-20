"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import type { User } from "@/app/types/user";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: () => apiFetch<User>("/api/v1/users/me"),
    retry: false,
  });
}
