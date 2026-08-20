"use client";

import { useCallback, useEffect, useState } from "react";
import { FileText, TrendingUp, Target, BarChart3 } from "lucide-react";
import { getStats } from "@/lib/dashboardApi";
import { ApiError } from "@/lib/api-client";
import type { StatCard } from "@/app/types/dashboard";

interface UseStatsResult {
  stats: StatCard[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useStats(): UseStatsResult {
  const [stats, setStats] = useState<StatCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getStats();

      setStats([
              {
                label: "Resumes Analyzed",
                value: String(res.analyzedResumes),
                change:
                  res.analyzedResumesThisWeek === 0
                    ? ""
                    : `+${res.analyzedResumesThisWeek} this week`,
                icon: FileText,
                color: "text-accent",
              },
              {
                label: "Avg. Resume Score",
                value: `${res.avgScore}%`,
                change:
                  res.avgScoreImprovThisWeek === 0
                    ? ""
                    : `${res.avgScoreImprovThisWeek > 0 ? "+" : ""}${res.avgScoreImprovThisWeek}% improvement`,
                icon: TrendingUp,
                color: "text-success",
              },
              {
                label: "Avg. ATS Score",
                value: `${res.atsScore}%`,
                change:
                  res.avgAtsScoreImproveThisWeek === 0
                    ? ""
                    : `${res.avgAtsScoreImproveThisWeek > 0 ? "+" : ""}${res.avgAtsScoreImproveThisWeek}% from last week`,
                icon: Target,
                color: "text-chart-2",
              },
              {
                label: "Analyses This Month",
                value: `${res.analysesLeft}`,
                change:
                  "",
                icon: BarChart3,
                color: "text-warning",
              },
            ]);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load stats");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, isLoading, error, refetch: fetchStats };
}