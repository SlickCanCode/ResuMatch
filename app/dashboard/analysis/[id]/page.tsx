"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Target,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Briefcase,
  GraduationCap,
  Code,
  Download,
  Loader2,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useResume } from "@/hooks/useResume";
import {
  analyzeJobMatch,
  analyzeResume,
  getAnalysis,
} from "@/lib/resumeApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Textarea } from "@/components/ui/textarea";
import { ApiError } from "@/lib/api-client";
import { generateResumeAnalysisPdf } from "@/lib/pdf/pdf-downloader";


export default function AnalysisPage() {
  const params = useParams<{ id: string }>();
  const resumeId = params.id;
  const router = useRouter();
  const queryClient = useQueryClient();

  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzingJob, setIsAnalyzingJob] = useState(false);
  const [analysisStage, setAnalysisStage] = useState("Analyzing...");
  const [isPreviewVisible, setIsPreviewVisible] = useState(true);
  const [isExporting, setIsExporting] = useState(false);


  const handleExport = async () => {
  if (!resume || !analysisData) return;

  try {
    setIsExporting(true);

    generateResumeAnalysisPdf(
      resume,
      analysisData,
      analyzeJob.data
    );
  } catch (error) {
    console.error("Failed to generate PDF:", error);
  } finally {
    setIsExporting(false);
  }
};

  const {
    data: resume,
    isPending: isResumePending,
    error: resumeError,
  } = useResume(resumeId);

  const {
    data: analysisData,
    isPending: isAnalysisPending,
    error: analysisError,
  } = useQuery({
    queryKey: ["analysis", resumeId],
    queryFn: () => getAnalysis(resumeId),
    retry: false,
    enabled: Boolean(resumeId),
  });

  const analysisMutation = useMutation({
    mutationFn: () => analyzeResume(resumeId, jobDescription.trim()),
    onSuccess: (analysis) => {
      queryClient.setQueryData(["analysis", resumeId], analysis);
      queryClient.invalidateQueries({ queryKey: ["analysis-summaries"] });
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      router.push(`/dashboard/analysis/${resumeId}`);
    },
  });

  const analyzeJob = useMutation({
    mutationFn: () => analyzeJobMatch(resumeId, jobDescription.trim()),
    onSettled: () => setIsAnalyzingJob(false),
  });

  const handleJobMatch = (e: React.MouseEvent) => {
    e.preventDefault();

    if (!jobDescription.trim()) return;

    setIsAnalyzingJob(true);
    analyzeJob.mutate();
  };

  useEffect(() => {
    if (!analysisMutation.isPending) {
      setAnalysisStage("Analyzing...");
      return;
    }

    const stages = [
      [1000, "Matching job description with resume"],
      [2000, "Getting related skills"],
      [3000, "Analyzing strengths and weaknesses"],
      [4000, "AI recommending actions"],
    ] as const;

    const timers = stages.map(([delay, message]) =>
      window.setTimeout(() => setAnalysisStage(message), delay)
    );

    return () => timers.forEach(window.clearTimeout);
  }, [analysisMutation.isPending]);

  if (isResumePending) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-accent" />
      </div>
    );
  }

  if (resumeError || !resume) {
    const message =
      resumeError instanceof ApiError
        ? resumeError.message
        : "This resume could not be found.";

    return (
      <Card className="mx-auto max-w-xl min-w-0">
        <CardContent className="flex flex-col items-center p-12 text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
            <FileText className="h-8 w-8 text-destructive" />
          </div>

          <p className="text-sm font-semibold uppercase tracking-wider text-destructive">
            404
          </p>

          <h1 className="mt-2 text-2xl font-bold">Resume not found</h1>

          <p className="mt-2 text-sm text-muted-foreground break-words">
            {message}
          </p>

          <Button
            className="mt-6"
            onClick={() => router.push("/dashboard/resumes")}
          >
            Back to resumes
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isAnalysisPending) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-accent" />
      </div>
    );
  }

  const analysisNotFound =
    !analysisData &&
    (!analysisError ||
      (analysisError instanceof ApiError && analysisError.status === 404));

  if (analysisNotFound) {
    return (
      <Card className="mx-auto max-w-2xl min-w-0">
        <CardContent className="p-8 sm:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10">
            <Sparkles className="h-8 w-8 text-accent" />
          </div>

          <div className="mt-5 text-center">
            <h1 className="text-2xl font-bold">No analysis yet</h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Your resume is ready. Add your job field or description to get a tailored,
              real-time analysis.
            </p>
          </div>

          <div className="mt-8 space-y-2">
            <label
              htmlFor="job-description"
              className="text-sm font-medium"
            >
              Job description
            </label>

            <Textarea
              id="job-description"
              value={jobDescription}
              onChange={(event) => setJobDescription(event.target.value)}
              placeholder="Paste the job description you want to match against..."
              className="min-h-36 w-full min-w-0 max-w-full resize-y"
            />
          </div>

          {analysisMutation.isError && (
            <Alert variant="destructive" className="mt-4 min-w-0">
              <AlertTitle>Analysis failed</AlertTitle>
              <AlertDescription className="break-words">
                {analysisMutation.error.message}
              </AlertDescription>
            </Alert>
          )}

          <Button
            className="mt-6 w-full sm:w-auto"
            onClick={() => analysisMutation.mutate()}
            disabled={!jobDescription.trim() || analysisMutation.isPending}
          >
            {analysisMutation.isPending ?(
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {analysisStage}
            </>
          ) : (
            <>
              Start Analysis
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (analysisError || !analysisData) {
    return (
      <Alert variant="destructive" className="min-w-0">
        <AlertTitle>Unable to load analysis</AlertTitle>
        <AlertDescription className="break-words">
          {analysisError?.message ??
            "The requested analysis could not be found."}
        </AlertDescription>
      </Alert>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-success";
    if (score >= 70) return "text-warning";
    return "text-destructive";
  };

  const getImpactColor = (impact: string) => {
    if (impact === "high") return "bg-destructive/10 text-destructive";
    if (impact === "medium") return "bg-warning/10 text-warning-foreground";
    return "bg-muted text-muted-foreground";
  };

  return (
    <div className="min-w-0 space-y-6">
      {/* Page Header */}
      <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold">Resume Analysis</h1>

          <p className="break-words text-muted-foreground">
            {resume.fullName} resume analysis
          </p>
        </div>

        <Button
          variant="outline"
          onClick={handleExport}
          disabled={isExporting}
        >
          {isExporting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}

          {isExporting ? "Generating PDF..." : "Export Report"}
        </Button>
      </div>

      {/* Main Layout */}
      <div className="grid min-w-0 gap-6 lg:grid-cols-3">
        {/* Left Panel - Resume Preview */}
        <div className="min-w-0 space-y-6 lg:col-span-1">
          <Card className="min-w-0">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <CardTitle className="flex min-w-0 items-center gap-2 text-lg">
                <FileText className="h-5 w-5 shrink-0" />
                <span className="truncate">Resume Preview</span>
              </CardTitle>

              <Button
                type="button"
                variant="outline"
                size="sm"
                aria-expanded={isPreviewVisible}
                onClick={() =>
                  setIsPreviewVisible((visible) => !visible)
                }
                className={
                  isPreviewVisible
                    ? "shrink-0 bg-accent text-accent-foreground hover:bg-accent/90"
                    : "shrink-0"
                }
              >
                {isPreviewVisible ? "Hide" : "Show"}
              </Button>
            </CardHeader>

            {isPreviewVisible && (
              <CardContent className="min-w-0 space-y-6">
                {/* Contact Info */}
                <div className="min-w-0">
                  <h3 className="font-semibold text-lg break-words">
                    {resume.fullName}
                  </h3>

                  <p className="break-words text-sm text-muted-foreground">
                    {resume.email}
                  </p>

                  <p className="break-words text-sm text-muted-foreground">
                    {resume.phone}
                  </p>

                  <p className="break-words text-sm text-muted-foreground">
                    {resume.location}
                  </p>
                </div>

                {/* Summary */}
                <div className="min-w-0">
                  <h4 className="mb-2 text-sm font-medium text-muted-foreground">
                    SUMMARY
                  </h4>

                  <p className="break-words text-sm">
                    {resume.summary}
                  </p>
                </div>

                {/* Skills */}
                <div className="min-w-0">
                  <h4 className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Code className="h-4 w-4 shrink-0" />
                    SKILLS
                  </h4>

                  <div className="flex min-w-0 flex-wrap gap-2">
                    {resume.skills.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="max-w-full text-xs"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Experience */}
                <div className="min-w-0">
                  <h4 className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Briefcase className="h-4 w-4 shrink-0" />
                    EXPERIENCE
                  </h4>

                  <div className="min-w-0 space-y-4">
                    {resume.experience.map((exp, index) => (
                      <div key={index} className="min-w-0">
                        <p className="break-words text-sm font-medium">
                          {exp.title}
                        </p>

                        <p className="break-words text-xs text-muted-foreground">
                          {exp.company} | {exp.period}
                        </p>

                        <ul className="mt-2 space-y-1">
                          {exp.highlights.map((highlight, i) => (
                            <li
                              key={i}
                              className="flex min-w-0 items-start gap-2 text-xs text-muted-foreground"
                            >
                              <span className="mt-1 shrink-0 text-accent">
                                •
                              </span>

                              <span className="min-w-0 break-words">
                                {highlight}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Education */}
                <div className="min-w-0">
                  <h4 className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <GraduationCap className="h-4 w-4 shrink-0" />
                    EDUCATION
                  </h4>

                  {resume.education.map((edu, index) => (
                    <div key={index} className="min-w-0">
                      <p className="break-words text-sm font-medium">
                        {edu.degree}
                      </p>

                      <p className="break-words text-xs text-muted-foreground">
                        {edu.school}, {edu.year}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        </div>

        {/* Right Panel - Analysis */}
        <div className="min-w-0 space-y-6 lg:col-span-2">
          {/* Score Cards */}
          <div className="grid min-w-0 gap-4 sm:grid-cols-3">
            <Card className="min-w-0">
              <CardContent className="p-4 text-center">
                <p className="mb-1 text-xs text-muted-foreground">
                  Overall Score
                </p>

                <p
                  className={`text-3xl font-bold ${getScoreColor(
                    analysisData.overallScore
                  )}`}
                >
                  {analysisData.overallScore}%
                </p>
              </CardContent>
            </Card>

            <Card className="min-w-0">
              <CardContent className="p-4 text-center">
                <p className="mb-1 text-xs text-muted-foreground">
                  ATS Score
                </p>

                <p
                  className={`text-3xl font-bold ${getScoreColor(
                    analysisData.atsScore
                  )}`}
                >
                  {analysisData.atsScore}%
                </p>
              </CardContent>
            </Card>

            <Card className="min-w-0">
              <CardContent className="p-4 text-center">
                <p className="mb-1 text-xs text-muted-foreground">
                  Keywords
                </p>

                <p
                  className={`text-3xl font-bold ${getScoreColor(
                    analysisData.keywordScore
                  )}`}
                >
                  {analysisData.keywordScore}%
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs
            defaultValue="analysis"
            className="min-w-0 space-y-4"
          >
            <TabsList className="flex w-full max-w-full justify-start overflow-x-auto">
              <TabsTrigger value="analysis" className="shrink-0">
                AI Analysis
              </TabsTrigger>

              <TabsTrigger value="skills" className="shrink-0">
                Skills
              </TabsTrigger>

              <TabsTrigger value="job-match" className="shrink-0">
                Job Match
              </TabsTrigger>
            </TabsList>

            {/* AI Analysis */}
            <TabsContent
              value="analysis"
              className="min-w-0 space-y-4"
            >
              {/* Strengths */}
              <Card className="min-w-0">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />
                    Strengths
                  </CardTitle>
                </CardHeader>

                <CardContent className="min-w-0">
                  <ul className="space-y-2">
                    {analysisData?.strengths?.map(
                      (strength, index) => (
                        <li
                          key={index}
                          className="flex min-w-0 items-start gap-2 text-sm"
                        >
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />

                          <span className="min-w-0 break-words">
                            {strength}
                          </span>
                        </li>
                      )
                    )}
                  </ul>
                </CardContent>
              </Card>

              {/* Weaknesses */}
              <Card className="min-w-0">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base text-warning">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    Areas for Improvement
                  </CardTitle>
                </CardHeader>

                <CardContent className="min-w-0">
                  <ul className="space-y-2">
                    {analysisData?.weaknesses?.map(
                      (weakness, index) => (
                        <li
                          key={index}
                          className="flex min-w-0 items-start gap-2 text-sm"
                        >
                          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />

                          <span className="min-w-0 break-words">
                            {weakness}
                          </span>
                        </li>
                      )
                    )}
                  </ul>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card className="min-w-0">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Sparkles className="h-5 w-5 shrink-0 text-accent" />
                    AI Recommendations
                  </CardTitle>
                </CardHeader>

                <CardContent className="min-w-0">
                  <div className="space-y-4">
                    {analysisData?.recommendations?.map(
                      (rec, index) => (
                        <div
                          key={index}
                          className="min-w-0 rounded-xl bg-secondary/50 p-4"
                        >
                          <div className="flex min-w-0 items-start justify-between gap-4">
                            <div className="min-w-0">
                              <p className="break-words text-sm font-medium">
                                {rec.title}
                              </p>

                              <p className="mt-1 break-words text-sm text-muted-foreground">
                                {rec.description}
                              </p>
                            </div>

                            <Badge
                              className={`shrink-0 ${getImpactColor(
                                rec.impact
                              )}`}
                            >
                              {rec.impact}
                            </Badge>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Skills */}
            <TabsContent
              value="skills"
              className="min-w-0 space-y-4"
            >
              <div className="grid min-w-0 gap-4 sm:grid-cols-2">
                {/* Existing Skills */}
                <Card className="min-w-0">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex min-w-0 items-center gap-2 text-base text-success">
                      <CheckCircle2 className="h-5 w-5 shrink-0" />

                      <span className="break-words">
                        Existing Skills (
                        {analysisData?.existingSkills?.length})
                      </span>
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="min-w-0">
                    <div className="flex min-w-0 flex-wrap gap-2">
                      {analysisData?.existingSkills?.map(
                        (keyword, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="max-w-full break-words bg-success/10 text-success border-success/20"
                          >
                            {keyword}
                          </Badge>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Skills To Develop */}
                <Card className="min-w-0">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex min-w-0 items-center gap-2 text-base text-destructive">
                      <AlertCircle className="h-5 w-5 shrink-0" />

                      <span className="break-words">
                        Skills To Develop (
                        {analysisData?.skillsToDevelop?.length})
                      </span>
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="min-w-0">
                    <div className="flex min-w-0 flex-wrap gap-2">
                      {analysisData?.skillsToDevelop?.map(
                        (keyword, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="max-w-full break-words bg-destructive/10 text-destructive border-destructive/20"
                          >
                            {keyword}
                          </Badge>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Keyword Coverage */}
              <Card className="min-w-0">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">
                    Keyword Coverage
                  </CardTitle>
                </CardHeader>

                <CardContent className="min-w-0 space-y-4">
                  <div className="min-w-0">
                    <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                      <span>Technical Skills</span>
                      <span className="shrink-0 font-medium">
                        {analysisData.keywordScore}%
                      </span>
                    </div>

                    <Progress
                      value={analysisData.keywordScore}
                      className="h-2"
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                      <span>Industry Keywords</span>
                      <span className="shrink-0 font-medium">
                        {analysisData.atsScore}%
                      </span>
                    </div>

                    <Progress
                      value={analysisData.atsScore}
                      className="h-2"
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                      <span>Soft Skills</span>

                      <span className="shrink-0 font-medium">
                        {analysisData?.existingSkills?.length}
                      </span>
                    </div>

                    <Progress
                      value={Math.min(
                        100,
                        analysisData?.existingSkills?.length * 10
                      )}
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Job Match */}
            <TabsContent
              value="job-match"
              className="min-w-0 space-y-4"
            >
              <Card className="min-w-0">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Target className="h-5 w-5 shrink-0 text-accent" />
                    Job Link Matching
                  </CardTitle>
                </CardHeader>

                <CardContent className="min-w-0 space-y-4">
                  <p className="break-words text-sm text-muted-foreground">
                    Paste a Job Link to see how well your resume
                    matches the job requirements.
                  </p>

                  <Textarea
                    placeholder="Paste the job link here..."
                    className="min-h-[150px] w-full min-w-0 max-w-full resize-y"
                    onChange={(e) =>
                      setJobDescription(e.target.value)
                    }
                  />

                  <Button
                    onClick={handleJobMatch}
                    disabled={
                      !jobDescription.trim() || isAnalyzingJob
                    }
                  >
                    {isAnalyzingJob ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Matching job description...
                      </>
                    ) : (
                      <>
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Analyze Match
                      </>
                    )}
                  </Button>

                  {analyzeJob.isError && (
                    <Alert
                      variant="destructive"
                      className="min-w-0"
                    >
                      <AlertTitle>Job match failed</AlertTitle>

                      <AlertDescription className="break-words">
                        {analyzeJob.error.message}
                      </AlertDescription>
                    </Alert>
                  )}

                  {analyzeJob.data && (
                    <div className="grid min-w-0 gap-4 sm:grid-cols-3">
                      {/* Match Score */}
                      <Card className="min-w-0">
                        <CardContent className="p-4 text-center">
                          <p className="text-xs text-muted-foreground">
                            Match score
                          </p>

                          <p className={`mt-1 text-3xl font-bold ${getScoreColor(
                    analyzeJob.data.matchScore
                  )}`}>
                            {analyzeJob.data.matchScore}%
                          </p>
                        </CardContent>
                      </Card>

                      {/* Found Skills */}
                      <Card className="min-w-0">
                        <CardContent className="min-w-0 p-4">
                          <p className="mb-2 text-sm font-medium text-success">
                            Found skills
                          </p>

                          <div className="flex min-w-0 flex-wrap gap-2">
                            {analyzeJob.data.foundSkills.map(
                              (skill) => (
                                <Badge
                                  key={skill}
                                  variant="secondary"
                                  className="max-w-full break-words"
                                >
                                  {skill}
                                </Badge>
                              )
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Missing Skills */}
                      <Card className="min-w-0">
                        <CardContent className="min-w-0 p-4">
                          <p className="mb-2 text-sm font-medium text-destructive">
                            Missing skills
                          </p>

                          <div className="flex min-w-0 flex-wrap gap-2">
                            {analyzeJob.data.missingSkills.map(
                              (skill) => (
                                <Badge
                                  key={skill}
                                  variant="outline"
                                  className="max-w-full break-words"
                                >
                                  {skill}
                                </Badge>
                              )
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      {/* AI Recommendations */}
                      <Card className="min-w-0 sm:col-span-3">
                        <CardHeader className="pb-3">
                          <CardTitle className="flex items-center gap-2 text-base">
                            <Sparkles className="h-5 w-5 shrink-0 text-accent" />
                            AI Recommendations for This Job
                          </CardTitle>
                        </CardHeader>

                        <CardContent className="min-w-0">
                          <ul className="space-y-2">
                            {analyzeJob.data.aiSuggestions.map(
                              (suggestion, index) => (
                                <li
                                  key={index}
                                  className="flex min-w-0 items-start gap-2 text-sm"
                                >
                                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-accent" />

                                  <span className="min-w-0 break-words">
                                    {suggestion}
                                  </span>
                                </li>
                              )
                            )}
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}