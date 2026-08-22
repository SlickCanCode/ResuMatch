"use client";

import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { analyzeResume, getAnalysis } from "@/lib/resumeApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Textarea } from "@/components/ui/textarea";
import { ApiError } from "@/lib/api-client";

export default function AnalysisPage() {
  const params = useParams<{ id: string }>();
  const resumeId = params.id;
  const router = useRouter();
  const queryClient = useQueryClient();
  const [jobDescription, setJobDescription] = useState("");
  const { data: resume, isPending: isResumePending, error: resumeError } = useResume(resumeId);
  const { data: analysisData, isPending: isAnalysisPending, error: analysisError } = useQuery({
    queryKey: ["analysis", resumeId],
    queryFn: () => getAnalysis(resumeId),
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

  if (isResumePending) {
    return <div className="flex min-h-64 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-accent" /></div>;
  }

  if (resumeError || !resume) {
    const message = resumeError instanceof ApiError ? resumeError.message : "This resume could not be found.";
    return (
      <Card className="mx-auto max-w-xl">
        <CardContent className="flex flex-col items-center p-12 text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
            <FileText className="h-8 w-8 text-destructive" />
          </div>
          <p className="text-sm font-semibold uppercase tracking-wider text-destructive">404</p>
          <h1 className="mt-2 text-2xl font-bold">Resume not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">{message}</p>
          <Button className="mt-6" onClick={() => router.push("/dashboard/resumes")}>Back to resumes</Button>
        </CardContent>
      </Card>
    );
  }

  if (isAnalysisPending) {
    return <div className="flex min-h-64 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-accent" /></div>;
  }

  const analysisNotFound = !analysisData && (!analysisError || (analysisError instanceof ApiError && analysisError.status === 404));
  if (analysisNotFound) {
    return (
      <Card className="mx-auto max-w-2xl">
        <CardContent className="p-8 sm:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10">
            <Sparkles className="h-8 w-8 text-accent" />
          </div>
          <div className="mt-5 text-center">
            <h1 className="text-2xl font-bold">No analysis yet</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Your resume is ready. Add a job description to get a tailored, real-time analysis.
            </p>
          </div>
          <div className="mt-8 space-y-2">
            <label htmlFor="job-description" className="text-sm font-medium">Job description</label>
            <Textarea
              id="job-description"
              value={jobDescription}
              onChange={(event) => setJobDescription(event.target.value)}
              placeholder="Paste the job description you want to match against..."
              className="min-h-36 resize-y"
            />
          </div>
          {analysisMutation.isError && (
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>Analysis failed</AlertTitle>
              <AlertDescription>{analysisMutation.error.message}</AlertDescription>
            </Alert>
          )}
          <Button
            className="mt-6 w-full sm:w-auto"
            onClick={() => analysisMutation.mutate()}
            disabled={!jobDescription.trim() || analysisMutation.isPending}
          >
            {analysisMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            {analysisMutation.isPending ? "Starting analysis..." : "Start Analysis"}
            {!analysisMutation.isPending && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (analysisError || !analysisData) {
    return <Alert variant="destructive"><AlertTitle>Unable to load analysis</AlertTitle><AlertDescription>{analysisError?.message ?? "The requested analysis could not be found."}</AlertDescription></Alert>;
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Resume Analysis</h1>
          <p className="text-muted-foreground">
            {resume.fullName} resume analysis
          </p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Panel - Resume Preview */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Resume Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Contact Info */}
              <div>
                <h3 className="font-semibold text-lg">
                  {resume.fullName}
                </h3>
                <p className="text-sm text-muted-foreground">{resume.email}</p>
                <p className="text-sm text-muted-foreground">{resume.phone}</p>
                <p className="text-sm text-muted-foreground">{resume.location}</p>
              </div>

              {/* Summary */}
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">SUMMARY</h4>
                <p className="text-sm">{resume.summary}</p>
              </div>

              {/* Skills */}
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2 flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  SKILLS
                </h4>
                <div className="flex flex-wrap gap-2">
                  {resume.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  EXPERIENCE
                </h4>
                <div className="space-y-4">
                  {resume.experience.map((exp, index) => (
                    <div key={index}>
                      <p className="font-medium text-sm">{exp.title}</p>
                      <p className="text-xs text-muted-foreground">{exp.company} | {exp.period}</p>
                      <ul className="mt-2 space-y-1">
                        {exp.highlights.map((highlight, i) => (
                          <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                            <span className="text-accent mt-1">•</span>
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>


              {/* Education */}
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  EDUCATION
                </h4>
                {resume.education.map((edu, index) => (
                  <div key={index}>
                    <p className="font-medium text-sm">{edu.degree}</p>
                    <p className="text-xs text-muted-foreground">{edu.school}, {edu.year}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Analysis */}
        <div className="lg:col-span-2 space-y-6">
          {/* Score Cards */}
          <div className="grid sm:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Overall Score</p>
                <p className={`text-3xl font-bold ${getScoreColor(analysisData.overallScore)}`}>
                  {analysisData.overallScore}%
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">ATS Score</p>
                <p className={`text-3xl font-bold ${getScoreColor(analysisData.atsScore)}`}>
                  {analysisData.atsScore}%
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Keywords</p>
                <p className={`text-3xl font-bold ${getScoreColor(analysisData.keywordScore)}`}>
                  {analysisData.keywordScore}%
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="analysis" className="space-y-4">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
              <TabsTrigger value="keywords">Keywords</TabsTrigger>
              <TabsTrigger value="job-match">Job Match</TabsTrigger>
            </TabsList>

            <TabsContent value="analysis" className="space-y-4">
              {/* Strengths */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2 text-success">
                    <CheckCircle2 className="w-5 h-5" />
                    Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysisData?.strengths?.map((strength, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-success mt-0.5 shrink-0" />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Weaknesses */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2 text-warning">
                    <AlertCircle className="w-5 h-5" />
                    Areas for Improvement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysisData?.weaknesses?.map((weakness, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <AlertCircle className="w-4 h-4 text-warning mt-0.5 shrink-0" />
                        {weakness}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-accent" />
                    AI Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysisData?.recommendations?.map((rec, index) => (
                      <div key={index} className="p-4 rounded-xl bg-secondary/50">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-medium text-sm">{rec.title}</p>
                            <p className="text-sm text-muted-foreground mt-1">{rec.description}</p>
                          </div>
                          <Badge className={getImpactColor(rec.impact)}>
                            {rec.impact}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="keywords" className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Found Keywords */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2 text-success">
                      <CheckCircle2 className="w-5 h-5" />
                      Valuable Skills ({analysisData?.valuableSkills?.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {analysisData?.valuableSkills?.map((keyword, index) => (
                        <Badge key={index} variant="outline" className="bg-success/10 text-success border-success/20">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Missing Keywords */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2 text-destructive">
                      <AlertCircle className="w-5 h-5" />
                      Needed Skills ({analysisData?.neededSkills?.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {analysisData?.neededSkills?.map((keyword, index) => (
                        <Badge key={index} variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Keyword Coverage */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Keyword Coverage</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span>Technical Skills</span>
                      <span className="font-medium">{analysisData.keywordScore}%</span>
                    </div>
                    <Progress value={analysisData.keywordScore} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span>Industry Keywords</span>
                      <span className="font-medium">{analysisData.atsScore}%</span>
                    </div>
                    <Progress value={analysisData.atsScore} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span>Action Verbs</span>
                      <span className="font-medium">{analysisData.overallScore}%</span>
                    </div>
                    <Progress value={analysisData.overallScore} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span>Soft Skills</span>
                      <span className="font-medium">{analysisData?.valuableSkills?.length}</span>
                    </div>
                    <Progress value={Math.min(100, analysisData?.valuableSkills?.length * 10)} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            
          <TabsContent value="job-match" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Target className="w-5 h-5 text-accent" />
                    Job Description Matching
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Paste a job description to see how well your resume matches the requirements.
                  </p>
                  <Textarea
                    placeholder="Paste the job description here..."
                    className="min-h-[150px]"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                  />
                  <Button 
                    onClick={handleJobMatch} 
                    disabled={!jobDescription.trim() || isAnalyzingJob}
                  >
                    {isAnalyzingJob ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Analyze Match
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
