import { AnalysisData, AnalysisSummary, JobMatchResponse, ResumeData, ResumePreview } from "@/app/types/resume";
import { formatRelativeTime } from "@/app/utils/formatRelativeTime";
import { apiFetch } from "@/lib/api-client";

export function uploadResume(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    return apiFetch<ResumeData>("/api/v1/resumes/upload", {method: "POST", body: formData});
}

export function analyzeResume(id: string, jobDescription: string) {
    return apiFetch<AnalysisData>(`/api/v1/resumes/${id}/analyze`, {method:"POST", body: JSON.stringify({"jobDescription": jobDescription})})
}

export function deleteResume(id: string) {
    return apiFetch<void>(`/api/v1/resumes/${id}`, {method: "DELETE"})
}

export function deleteResumeAnalysis(id: string) {
    return apiFetch<void>(`/api/v1/resumes/${id}/analyses`, {method: "DELETE"})
}

export function analyzeJobMatch(id: string, jobLink: string) {
    return apiFetch<JobMatchResponse>(`/api/v1/resumes/${id}/analyze/job-match`, {method: "POST", body: JSON.stringify({"jobLink": jobLink})})
}

export function getAnalysis(id: string) {
    return apiFetch<AnalysisData>(`/api/v1/resumes/${id}/analyses`);
}

export function getResume(id: string) {
    return apiFetch<ResumeData>(`/api/v1/resumes/${id}`);
}

export function getAllResume() {
    type ResumePreviewResponse = Partial<ResumePreview> & {
        resumeId?: string;
        fileName?: string;
    };

    return apiFetch<ResumePreviewResponse[] | { resumes?: ResumePreviewResponse[] }>("/api/v1/resumes").then((response) => {
        const items = (Array.isArray(response) ? response : response.resumes ?? [])
            .sort((first, second) => {
                const firstDate = Date.parse(first.uploadDate ?? "");
                const secondDate = Date.parse(second.uploadDate ?? "");
                if (Number.isNaN(firstDate)) return 1;
                if (Number.isNaN(secondDate)) return -1;
                return secondDate - firstDate;
            });

        return items.map((item) => ({
            id: item.id ?? item.resumeId ?? `${item.name ?? item.fileName ?? "resume"}-${item.uploadDate ?? "unknown"}`,
            name: item.name ?? item.fileName ?? "Untitled resume",
            uploadDate: formatRelativeTime(item.uploadDate ?? ""),
            latestScore: item.latestScore ?? null,
            analysisCount: item.analysisCount ?? 0,
        }));
    });
}

export function getAllAnalysis() {

    return apiFetch<AnalysisSummary[] | { analyses?: AnalysisSummary[] }>("/api/v1/resumes/analyses").then((response) => {
        const items = Array.isArray(response) ? response : response.analyses ?? [];

        return items.map((item) => ({
            id: item.id ??"",
            resumeId: item.resumeId ?? "",
            resumeName: item.fileName ?? "Untitled resume",
            dateTime: item.date ?? item.date ?? "",
            score: item.resumeScore ?? 0,
            atsScore: item.atsScore ?? 0,
        }));
    });
}