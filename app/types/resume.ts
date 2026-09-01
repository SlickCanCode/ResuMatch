export interface ResumeData {
  resumeId: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  summary: string;

  onlineProfiles: {
    platform: string;
    url: string;
  }[];

  skills: string[];

  experience: {
    title: string;
    company: string;
    period: string;
    highlights: string[];
  }[];

  education: {
    degree: string;
    school: string;
    year: string;
  }[];
}

export interface AnalysisData {
  analysisId: string,
  overallScore: number;
  atsScore: number;
  keywordScore: number;

  strengths: string[];
  weaknesses: string[];

  existingSkills: string[];
  skillsToDevelop: string[];

  grammarIssues: {
    text: string;
    suggestion: string;
  }[];

  recommendations: {
    title: string;
    description: string;
    impact: "high" | "medium" | "low";
  }[];
}

export interface ResumePreview {
  id: string;
  name: string;
  uploadDate: string;
  latestScore: number | null;
  analysisCount: number;
}

export interface AnalysisSummary{
  id: string;
  resumeName: string;
  dateTime: string;
  score: number;
  atsScore: number;
}

export interface JobMatchResponse{
  matchScore: number;
  foundSkills: string[];
  missingSkills: string[];
  aiSuggestions: string[];
}