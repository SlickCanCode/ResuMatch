"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, Loader2, X, ArrowRight, Code, Briefcase, GraduationCap, Clock3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { analyzeResume, uploadResume } from "@/lib/resumeApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";

export default function NewAnalysisPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isWaitingToUpload, setIsWaitingToUpload] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const uploadMutation = useMutation({ mutationFn: uploadResume });
  const analysisMutation = useMutation({
    mutationFn: ({ resumeId, description }: { resumeId: string; description: string }) =>
      analyzeResume(resumeId, description),
  });
  const resume = uploadMutation.data;

  useEffect(() => {
    if (!file || resume || uploadMutation.isPending || uploadMutation.isError) return;

    setIsWaitingToUpload(true);
    const timer = window.setTimeout(() => {
      setIsWaitingToUpload(false);
      uploadMutation.mutate(file);
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [file, resume, uploadMutation.isPending]);

  useEffect(() => {
    if (resume) {
      queryClient.setQueryData(["resume", resume.resumeId], resume);
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
    }
  }, [queryClient, resume]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type === "application/pdf" || droppedFile.name.endsWith(".docx"))) {
      setFile(droppedFile);
      uploadMutation.reset();
      setJobDescription("");
      setFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      uploadMutation.reset();
      setJobDescription("");
      setFile(selectedFile);
    }
  };

  const handleAnalyze = async () => {
    if (!resume || !jobDescription.trim()) return;

    analysisMutation.mutate(
      { resumeId: resume.resumeId, description: jobDescription.trim() },
      {
        onSuccess: (analysis) => {
          queryClient.setQueryData(["analysis", resume.resumeId], analysis);
          queryClient.invalidateQueries({ queryKey: ["analysis-summaries"] });
          router.push(`/dashboard/analysis/${resume.resumeId}`);
        },
      },
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Upload Resume</h1>
        <p className="text-muted-foreground">
          Upload your resume to get AI-powered analysis and recommendations.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Resume File</CardTitle>
        </CardHeader>
        <CardContent>
          {uploadMutation.isError && (
                   <Alert variant="destructive" className="mb-2.5">
                      <AlertTitle>Api Error</AlertTitle>
                      <AlertDescription>
                        {uploadMutation.error.message}
                      </AlertDescription>
                    </Alert>
                  )}
          {!file || uploadMutation.isError ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`
                border-2 border-dashed rounded-2xl p-12 text-center transition-colors
                ${isDragging ? "border-accent bg-accent/5" : "border-border hover:border-muted-foreground/50"}
              `}
            >
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-2">Drop your resume here</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  or click to browse from your computer
                </p>
                <label htmlFor="file-upload">
                  <Button variant="outline" asChild>
                    <span className="cursor-pointer">Browse Files</span>
                  </Button>
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <p className="text-xs text-muted-foreground mt-4">
                  Supported formats: PDF, DOCX (Max 10MB)
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center">
                  <FileText className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setFile(null);
                  setIsWaitingToUpload(false);
                  uploadMutation.reset();
                  setJobDescription("");
                }}
                disabled={Boolean(resume) || uploadMutation.isPending}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
          {isWaitingToUpload && (
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-accent/20 bg-accent/5 p-4 text-sm">
              <Clock3 className="h-5 w-5 shrink-0 text-accent" />
              <div>
                <p className="font-medium">Reviewing your file</p>
                <p className="text-muted-foreground">Upload starts in a few seconds. You can still replace it.</p>
              </div>
              <Loader2 className="ml-auto h-4 w-4 shrink-0 animate-spin text-accent" />
            </div>
          )}
          {uploadMutation.isPending && (
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-border bg-secondary/40 p-4 text-sm">
              <Loader2 className="h-5 w-5 shrink-0 animate-spin text-accent" />
              <div>
                <p className="font-medium">Uploading and reading your resume</p>
                <p className="text-muted-foreground">Your file is locked while we process it.</p>
              </div>
            </div>
          )}
          {resume && (
             <Card className="mt-2.5">
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
                  {resume.fullName ? `${resume.fullName}` : "Loading..."}
                </h3>
                <p className="text-sm text-muted-foreground">{resume?.email ?? ""}</p>
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
          )}
          {resume && (
            <div className="mt-6 space-y-2">
              <label htmlFor="job-description" className="text-sm font-medium">Job description</label>
              <Textarea
                id="job-description"
                value={jobDescription}
                onChange={(event) => setJobDescription(event.target.value)}
                placeholder="Paste the job description you want to match against..."
                className="min-h-32 resize-y"
              />
              <p className="text-xs text-muted-foreground">Add the role requirements to unlock your personalized analysis.</p>
            </div>
          )}
          {analysisMutation.isError && (
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>Analysis failed</AlertTitle>
              <AlertDescription>{analysisMutation.error.message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          size="lg"
          onClick={handleAnalyze}
          disabled={!resume || !jobDescription.trim() || analysisMutation.isPending}
        >
          {analysisMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              Start Analysis
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
