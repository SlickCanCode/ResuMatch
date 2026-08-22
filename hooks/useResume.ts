import { getResume } from "@/lib/resumeApi";
import { useQuery } from "@tanstack/react-query";

export function useResume(resumeId: string) {
    return useQuery({
  queryKey: ["resume", resumeId],
  queryFn: () => getResume(resumeId),
});
}