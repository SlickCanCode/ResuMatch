"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  FileText,
  Target,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Briefcase,
  GraduationCap,
  Code,
  Download,
  Loader2,
} from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";

// Mock resume data
const resumeData = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  summary: "Experienced software engineer with 5+ years of expertise in building scalable web applications using React, Node.js, and cloud technologies.",
  online_profiles: [
    { platform: "LinkedIn", url: "https://www.linkedin.com/in/johndoe" },
  ],
  skills: ["JavaScript", "TypeScript", "React", "Node.js", "Python", "AWS", "Docker", "PostgreSQL", "GraphQL", "Git"],
  experience: [
    {
      title: "Senior Software Engineer",
      company: "Tech Corp",
      period: "2021 - Present",
      highlights: [
        "Led development of microservices architecture serving 1M+ users",
        "Reduced deployment time by 60% through CI/CD improvements",
        "Mentored team of 5 junior developers"
      ]
    },
    {
      title: "Software Engineer",
      company: "StartupXYZ",
      period: "2019 - 2021",
      highlights: [
        "Built real-time data pipeline processing 100K events/second",
        "Implemented OAuth 2.0 authentication system",
        "Improved application performance by 40%"
      ]
    }
  ],
  education: [
    {
      degree: "B.S. Computer Science",
      school: "Stanford University",
      year: "2019"
    }
  ]
};

// Mock analysis data
const analysisData = {
  overallScore: 87,
  atsScore: 92,
  keywordScore: 78,
  strengths: [
    "Strong quantifiable achievements in experience section",
    "Well-structured and easy to read format",
    "Relevant technical skills clearly listed",
    "Good use of action verbs"
  ],
  weaknesses: [
    "Summary could be more impactful with specific metrics",
    "Missing some industry-standard keywords",
    "Could add more recent certifications"
  ],
  missingKeywords: ["Agile", "Scrum", "CI/CD", "Kubernetes", "REST API", "Unit Testing"],
  foundKeywords: ["JavaScript", "React", "Node.js", "AWS", "Docker", "PostgreSQL", "Microservices", "GraphQL"],
  grammarIssues: [
    { text: "Led development of microservices", suggestion: "Consider adding 'the' before 'development'" },
    { text: "Reduced deployment time", suggestion: "Great use of metrics! Keep this pattern" }
  ],
  recommendations: [
    {
      title: "Add Quantifiable Metrics to Summary",
      description: "Include specific numbers like '5+ years of experience' and 'served 1M+ users' in your summary section.",
      impact: "high"
    },
    {
      title: "Include Missing Keywords",
      description: "Add keywords like 'Agile', 'Scrum', and 'REST API' to improve ATS matching.",
      impact: "high"
    },
    {
      title: "Expand Education Section",
      description: "Consider adding relevant coursework, GPA (if above 3.5), or academic achievements.",
      impact: "medium"
    },
    {
      title: "Add Certifications",
      description: "Include any relevant certifications like AWS Certified Developer or similar credentials.",
      impact: "medium"
    }
  ]
};

export default function AnalysisPage() {
  const { data: user } = useCurrentUser();
  const [isAnalyzingJob, setIsAnalyzingJob] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [jobMatchResult, setJobMatchResult] = useState<{
    matchScore: number;
    matchingSkills: string[];
    missingSkills: string[];
    recommendations: string[];
  } | null>(null);

  const handleJobMatch = async () => {
    if (!jobDescription.trim()) return;
    setIsAnalyzingJob(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setJobMatchResult({
      matchScore: 74,
      matchingSkills: ["JavaScript", "React", "Node.js", "AWS", "PostgreSQL"],
      missingSkills: ["Kubernetes", "Terraform", "Go", "Machine Learning"],
      recommendations: [
        "Highlight your experience with cloud technologies more prominently",
        "Add any experience with container orchestration",
        "Consider adding relevant certifications for the missing technologies"
      ]
    });
    setIsAnalyzingJob(false);
  };

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
            Software_Engineer_Resume.pdf
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
                  {user ? `${user.firstName} ${user.lastName}` : "Loading..."}
                </h3>
                <p className="text-sm text-muted-foreground">{user?.email ?? ""}</p>
                <p className="text-sm text-muted-foreground">{resumeData.phone}</p>
                <p className="text-sm text-muted-foreground">{resumeData.location}</p>
              </div>

              {/* Summary */}
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">SUMMARY</h4>
                <p className="text-sm">{resumeData.summary}</p>
              </div>

              {/* Skills */}
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2 flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  SKILLS
                </h4>
                <div className="flex flex-wrap gap-2">
                  {resumeData.skills.map((skill, index) => (
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
                  {resumeData.experience.map((exp, index) => (
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
                {resumeData.education.map((edu, index) => (
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
                    {analysisData.strengths.map((strength, index) => (
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
                    {analysisData.weaknesses.map((weakness, index) => (
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
                    {analysisData.recommendations.map((rec, index) => (
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
                      Found Keywords ({analysisData.foundKeywords.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {analysisData.foundKeywords.map((keyword, index) => (
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
                      Missing Keywords ({analysisData.missingKeywords.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {analysisData.missingKeywords.map((keyword, index) => (
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
                      <span className="font-medium">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span>Industry Keywords</span>
                      <span className="font-medium">72%</span>
                    </div>
                    <Progress value={72} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span>Action Verbs</span>
                      <span className="font-medium">90%</span>
                    </div>
                    <Progress value={90} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span>Soft Skills</span>
                      <span className="font-medium">65%</span>
                    </div>
                    <Progress value={65} className="h-2" />
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

              {jobMatchResult && (
                <>
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-2">Match Score</p>
                        <p className={`text-5xl font-bold ${getScoreColor(jobMatchResult.matchScore)}`}>
                          {jobMatchResult.matchScore}%
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2 text-success">
                          <CheckCircle2 className="w-5 h-5" />
                          Matching Skills
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {jobMatchResult.matchingSkills.map((skill, index) => (
                            <Badge key={index} variant="outline" className="bg-success/10 text-success border-success/20">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2 text-destructive">
                          <AlertCircle className="w-5 h-5" />
                          Missing Skills
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {jobMatchResult.missingSkills.map((skill, index) => (
                            <Badge key={index} variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-accent" />
                        Recommendations for This Job
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {jobMatchResult.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <Sparkles className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
