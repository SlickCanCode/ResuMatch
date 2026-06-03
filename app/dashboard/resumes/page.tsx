"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FileText,
  Search,
  MoreHorizontal,
  Eye,
  Download,
  Trash2,
  Upload,
  Grid3X3,
  List,
  BarChart3,
} from "lucide-react";

const resumes = [
  {
    id: 1,
    fileName: "Software_Engineer_Resume.pdf",
    uploadDate: "May 5, 2026",
    lastAnalyzed: "2 hours ago",
    latestScore: 87,
    analysisCount: 5,
  },
  {
    id: 2,
    fileName: "Product_Manager_CV.pdf",
    uploadDate: "May 3, 2026",
    lastAnalyzed: "Yesterday",
    latestScore: 72,
    analysisCount: 3,
  },
  {
    id: 3,
    fileName: "Data_Analyst_Resume.pdf",
    uploadDate: "May 1, 2026",
    lastAnalyzed: "3 days ago",
    latestScore: 95,
    analysisCount: 4,
  },
  {
    id: 4,
    fileName: "UX_Designer_Portfolio.pdf",
    uploadDate: "Apr 28, 2026",
    lastAnalyzed: "1 week ago",
    latestScore: 68,
    analysisCount: 2,
  },
];

export default function ResumesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredResumes = resumes.filter((resume) =>
    resume.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-success";
    if (score >= 70) return "text-warning";
    return "text-destructive";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return "bg-success/10";
    if (score >= 70) return "bg-warning/10";
    return "bg-destructive/10";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Resumes</h1>
          <p className="text-muted-foreground">
            Manage and analyze your uploaded resumes.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/analysis/new">
            <Upload className="w-4 h-4 mr-2" />
            Upload Resume
          </Link>
        </Button>
      </div>

      {/* Search and View Toggle */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search resumes..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumes Grid/List */}
      {filteredResumes.length > 0 ? (
        viewMode === "grid" ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResumes.map((resume) => (
              <Card key={resume.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getScoreBgColor(resume.latestScore)}`}>
                      <FileText className={`w-6 h-6 ${getScoreColor(resume.latestScore)}`} />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/analysis/${resume.id}`}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Analysis
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <h3 className="font-medium text-sm mb-1 truncate">{resume.fileName}</h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    Uploaded {resume.uploadDate}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div>
                      <p className="text-xs text-muted-foreground">Latest Score</p>
                      <p className={`text-xl font-bold ${getScoreColor(resume.latestScore)}`}>
                        {resume.latestScore}%
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Analyses</p>
                      <p className="text-xl font-bold">{resume.analysisCount}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <Link href={`/dashboard/analysis/${resume.id}`}>
                        <BarChart3 className="w-4 h-4 mr-1" />
                        Analyze
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {filteredResumes.length} {filteredResumes.length === 1 ? "Resume" : "Resumes"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredResumes.map((resume) => (
                  <div
                    key={resume.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getScoreBgColor(resume.latestScore)}`}>
                        <FileText className={`w-5 h-5 ${getScoreColor(resume.latestScore)}`} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{resume.fileName}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Uploaded {resume.uploadDate} • Last analyzed {resume.lastAnalyzed}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="hidden sm:flex items-center gap-4">
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Score</p>
                          <p className={`font-semibold ${getScoreColor(resume.latestScore)}`}>
                            {resume.latestScore}%
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Analyses</p>
                          <p className="font-semibold">{resume.analysisCount}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/dashboard/analysis/${resume.id}`}>
                            <BarChart3 className="w-4 h-4 mr-1" />
                            Analyze
                          </Link>
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )
      ) : (
        <Card>
          <CardContent className="p-12">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">No resumes found</h3>
              <p className="text-muted-foreground text-sm mb-4">
                {searchQuery
                  ? "Try adjusting your search query."
                  : "Upload your first resume to get started."}
              </p>
              {!searchQuery && (
                <Button asChild>
                  <Link href="/dashboard/analysis/new">Upload Resume</Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
