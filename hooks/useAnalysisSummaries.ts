import { useQuery } from "@tanstack/react-query";
import { getAllAnalysis } from "@/lib/resumeApi";

export const analysisSummariesQueryKey = ["analysis-summaries"] as const;

export function useAnalysisSummaries() {
  return useQuery({
    queryKey: analysisSummariesQueryKey,
    queryFn: getAllAnalysis,
  });
}