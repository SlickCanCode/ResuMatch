import { apiFetch } from "@/lib/api-client";
import type { StatsResponse, AnalysisPreviewResponse } from "@/app/types/dashboard";

export function getStats() {
  return apiFetch<StatsResponse>("/api/v1/dashboard/me/stats");
}

export function getRecentAnalyses() {
  return apiFetch<AnalysisPreviewResponse[]>("/api/v1/dashboard/me/recent-analyses");
}
