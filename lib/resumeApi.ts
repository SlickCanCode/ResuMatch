import { AnalysisData, ResumeData } from "@/app/types/resume";
import { apiFetch } from "@/lib/api-client";

export function uploadResume(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    return apiFetch<ResumeData>("api/v1/resumes/upload", {method: "POST", body: formData});
}

export function analyzeResume(id: string, jobDescription: string) {
    return apiFetch<AnalysisData>(`api/v1/resumes/${id}/analyze`, {method:"POST", body: JSON.stringify(jobDescription)})
}