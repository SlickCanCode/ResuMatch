"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Upload, 
  FileText, 
  TrendingUp, 
  Clock, 
  ArrowRight,
  BarChart3,
  Target,
  Sparkles
} from "lucide-react";
import { useStats } from "@/hooks/Dashboard/useStats";
import { useRecentAnalyses } from "@/hooks/Dashboard/useRecentAnalyses";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useCurrentUser } from "@/hooks/useCurrentUser";

// const recentAnalyses = [
//   {
//     id: 1,
//     name: "Software_Engineer_Resume.pdf",
//     score: 87,
//     atsScore: 92,
//     date: "2 hours ago",
//   },
//   {
//     id: 2,
//     name: "Product_Manager_CV.pdf",
//     score: 72,
//     atsScore: 78,
//     date: "Yesterday",
//   },
//   {
//     id: 3,
//     name: "Data_Analyst_Resume.pdf",
//     score: 95,
//     atsScore: 98,
//     date: "3 days ago",
//   },
// ];

// const stats = [
//   { 
//     label: "Resumes Analyzed", 
//     value: "12", 
//     change: "+3 this week",
//     icon: FileText,
//     color: "text-accent"
//   },
//   { 
//     label: "Avg. Resume Score", 
//     value: "84%", 
//     change: "+5% improvement",
//     icon: TrendingUp,
//     color: "text-success"
//   },
//   { 
//     label: "Avg. ATS Score", 
//     value: "89%", 
//     change: "+8% from last month",
//     icon: Target,
//     color: "text-chart-2"
//   },
//   { 
//     label: "Analyses This Month", 
//     value: "8", 
//     change: "4 remaining",
//     icon: BarChart3,
//     color: "text-warning"
//   },
// ];

export default function DashboardPage() {
  const {stats, error: statsError, refetch: refetchStats} = useStats();
  const {recentAnalyses, error: recentAnalysesError, refetch: refetchAnalyses} = useRecentAnalyses();
  const { data: user } = useCurrentUser();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            Welcome back{user?.firstName ? `, ${user.firstName}` : ""}
          </h1>
          <p className="text-muted-foreground">
            Here&apos;s an overview of your resume analysis activity.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/analysis/new">
            <Upload className="w-4 h-4 mr-2" />
            Upload Resume
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsError && (
           <Alert variant="destructive">
              <AlertTitle>Api Error</AlertTitle>
              <AlertDescription>
                {statsError}
              </AlertDescription>
              <button onClick={refetchStats} className="underline cursor-pointer">retry</button>
            </Alert>
          )}
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-secondary flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Analyses */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Recent Analyses</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/history">
              View all
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentAnalysesError && (
              <Alert variant="destructive">
                <AlertTitle>Api Error</AlertTitle>
                <AlertDescription>
                  {recentAnalysesError}
                </AlertDescription>
                <button onClick={refetchAnalyses} className="underline cursor-pointer">retry</button>
              </Alert>
            )}
            {!recentAnalysesError && recentAnalyses.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-secondary/30 px-6 py-10 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10">
                  <FileText className="h-7 w-7 text-accent" />
                </div>
                <h3 className="font-semibold">No analyses yet</h3>
                <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                  Upload your resume to get real-time analysis and personalized recommendations.
                </p>
            <Button asChild className="mt-4">
              <Link href="/dashboard/analysis/new">
                Start Analysis
                <Sparkles className="w-4 h-4 ml-2" />
              </Link>
            </Button>
              </div>
            ) : (
              recentAnalyses.map((analysis) => (
                <Link 
                  key={analysis.id} 
                  href={`/dashboard/analysis/${analysis.id}`}
                  className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{analysis.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                        <Clock className="w-3 h-3" />
                        {analysis.date}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Score</p>
                      <p className="font-semibold">{analysis.score}%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">ATS</p>
                      <p className="font-semibold text-success">{analysis.atsScore}%</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </Link>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Job Match Analysis</h4>
                <p className="text-sm text-muted-foreground">
                  Compare your resume against a specific job description.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Track Progress</h4>
                <p className="text-sm text-muted-foreground">
                  See how your resume scores have improved over time.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-warning" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">AI Suggestions</h4>
                <p className="text-sm text-muted-foreground">
                  Get personalized recommendations to improve your resume.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
