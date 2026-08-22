"use client";

import { useCallback, useEffect, useState } from "react";
import { getRecentAnalyses } from "@/lib/dashboardApi";
import { ApiError } from "@/lib/api-client";
import { formatRelativeTime } from "@/app/utils/formatRelativeTime";
import type { AnalysisPreview } from "@/app/types/dashboard";

interface UseRecentAnalysesResult {
  recentAnalyses: AnalysisPreview[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useRecentAnalyses(): UseRecentAnalysesResult {
  const [recentAnalyses, setRecentAnalyses] = useState<AnalysisPreview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalyses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getRecentAnalyses();
      setRecentAnalyses(
        res.map((a) => ({
          id: a.id,
          resumeId: a.resumeId,
          name: a.fileName,
          score: a.resumeScore,
          atsScore: a.atsScore,
          date: formatRelativeTime(a.date),
        }))
      );
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load recent analyses");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalyses();
  }, [fetchAnalyses]);

  return { recentAnalyses, isLoading, error, refetch: fetchAnalyses };
}