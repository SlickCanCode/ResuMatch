"use client";

import Link from "next/link";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useResumes } from "@/hooks/useResumes";
import { deleteResume } from "@/lib/resumeApi";
import { DeleteConfirmationDialog } from "@/components/dashboard/delete-confirmation-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
  Loader2,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function ResumesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [resumeToDelete, setResumeToDelete] = useState<{ id: string; name: string } | null>(null);
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  const { data: resumes = [], isPending, isError, error, refetch } = useResumes();
  const deleteMutation = useMutation({
    mutationFn: deleteResume,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["resumes"] });
      await queryClient.invalidateQueries({ queryKey: ["analysis-summaries"] });
      setResumeToDelete(null);
    },
  });

  const filteredResumes = resumes.filter((resume) =>
    resume.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getScoreColor = (score: number | null) => {
    if (score === null) return "text-muted-foreground";
    if (score >= 90) return "text-success";
    if (score >= 70) return "text-warning";
    return "text-destructive";
  };

  const getScoreBgColor = (score: number | null) => {
    if (score === null) return "bg-secondary";
    if (score >= 90) return "bg-success/10";
    if (score >= 70) return "bg-warning/10";
    return "bg-destructive/10";
  };

  const scoreLabel = (score: number | null) => score === null ? "Not analyzed" : `${score}%`;

  const requestDelete = (id: string, name: string) => {
    deleteMutation.reset();
    setResumeToDelete({ id, name });
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

      {isPending ? (
        <div className="flex min-h-64 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-accent" />
        </div>
      ) : isError ? (
        <Alert variant="destructive">
          <AlertTitle>Unable to load resumes</AlertTitle>
          <AlertDescription className="break-words">{error.message}</AlertDescription>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => refetch()}>
            Try again
          </Button>
        </Alert>
      ) : (
      <>
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
                className="hidden md:inline-flex"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumes Grid/List */}
      {filteredResumes.length > 0 ? (
        isMobile || viewMode === "grid" ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResumes.map((resume) => (
              <Card key={resume.id} className="min-w-0 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center ${getScoreBgColor(resume.latestScore)}`}>
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
                         <DropdownMenuItem className="text-destructive" onSelect={() => requestDelete(resume.id, resume.name)}>
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                    <h3 className="font-medium text-sm mb-1 truncate" title={resume.name}>{resume.name}</h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    Uploaded {resume.uploadDate}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div>
                      <p className="text-xs text-muted-foreground">Latest Score</p>
                      <p className={`text-xl font-bold ${getScoreColor(resume.latestScore)}`}>
                        {scoreLabel(resume.latestScore)}
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
                        View Analysis
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
                    className="flex items-center justify-between gap-4 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center ${getScoreBgColor(resume.latestScore)}`}>
                        <FileText className={`w-5 h-5 ${getScoreColor(resume.latestScore)}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm truncate" title={resume.name}>{resume.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Uploaded {resume.uploadDate}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 shrink-0">
                      <div className="hidden sm:flex items-center gap-4">
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Score</p>
                          <p className={`font-semibold ${getScoreColor(resume.latestScore)}`}>
                            {scoreLabel(resume.latestScore)}
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
                            View Analysis
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
                            <DropdownMenuItem className="text-destructive" onSelect={() => requestDelete(resume.id, resume.name)}>
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
                <h3 className="font-semibold text-lg mb-2">{searchQuery ? "No resumes found" : "No resumes yet"}</h3>
              <p className="text-muted-foreground text-sm mb-4">
                {searchQuery
                  ? "Try adjusting your search query."
                  : "Upload your resume and get real-time analysis."}
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
      </>
      )}
      <DeleteConfirmationDialog
        itemName={resumeToDelete?.name ?? "this resume"}
        itemType="resume"
        open={resumeToDelete !== null}
        isPending={deleteMutation.isPending}
        error={deleteMutation.error?.message}
        onOpenChange={(open) => {
          if (!open && !deleteMutation.isPending) setResumeToDelete(null);
        }}
        onConfirm={() => {
          if (resumeToDelete) deleteMutation.mutate(resumeToDelete.id);
        }}
      />
    </div>
  );
}