import type { LucideIcon } from "lucide-react";

// ---- Raw backend shapes — align field names with the real Java DTOs ----
export interface StatsResponse {
  analyzedResumes: number;
  analyzedResumesThisWeek: number;
  avgScore: number;
  avgScoreImprovThisWeek: number;
  atsScore: number;
  avgAtsScoreImproveThisWeek: number;
  analysesLeft: number;
}

export interface AnalysisPreviewResponse {
  id: string;
  fileName: string;
  resumeScore: number;
  atsScore: number;
  date: string; // ISO-8601 timestamp
}

// ---- View models the UI actually renders ----
export interface AnalysisPreview {
  id: string;
  name: string;
  score: number;
  atsScore: number;
  date: string;
}

export interface StatCard {
  label: string;
  value: string;
  change: string;
  icon: LucideIcon;
  color: string;
}