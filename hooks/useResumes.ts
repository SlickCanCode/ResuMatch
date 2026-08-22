import { useQuery } from "@tanstack/react-query";
import { getAllResume } from "@/lib/resumeApi";

export const resumesQueryKey = ["resumes"] as const;

export function useResumes() {
  return useQuery({
    queryKey: resumesQueryKey,
    queryFn: getAllResume,
  });
}