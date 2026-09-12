"use client";

import Link from "next/link";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAnalysisSummaries } from "@/hooks/useAnalysisSummaries";
import { deleteResumeAnalysis } from "@/lib/resumeApi";
import { DeleteConfirmationDialog } from "@/components/dashboard/delete-confirmation-dialog";
import { formatRelativeTime } from "@/app/utils/formatRelativeTime";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
  Calendar,
  Upload,
  Loader2,
  Grid3X3,
  List,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [analysisToDelete, setAnalysisToDelete] = useState<{ id: string; name: string } | null>(null);
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  const { data: analysisHistory = [], isPending, isError, error, refetch } = useAnalysisSummaries();
  const deleteMutation = useMutation({
    mutationFn: deleteResumeAnalysis,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["analysis-summaries"] });
      await queryClient.invalidateQueries({ queryKey: ["resumes"] });
      setAnalysisToDelete(null);
    },
  });

  const filteredHistory = analysisHistory.filter((item) =>
    item.resumeName.toLowerCase().includes(searchQuery.toLowerCase())
    
  );

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-success";
    if (score >= 70) return "text-warning";
    return "text-destructive";
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 90) return "bg-success/10 text-success";
    if (score >= 70) return "bg-warning/10 text-warning-foreground";
    return "bg-destructive/10 text-destructive";
  };

  const requestDelete = (resumeId: string, name: string) => {
    deleteMutation.reset();
    setAnalysisToDelete({ id: resumeId, name });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Analysis History</h1>
          <p className="text-muted-foreground">
            View and manage your past resume analyses.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/analysis/new">
            <Upload className="w-4 h-4 mr-2" />
            New Analysis
          </Link>
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by file name..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-1 rounded-lg bg-secondary p-1">
                            <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" aria-label="List view" className="hidden md:inline-flex" onClick={() => setViewMode("list")}>
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* History List */}
      {isPending ? (
        <div className="flex min-h-64 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-accent" />
        </div>
      ) : isError ? (
        <Alert variant="destructive">
          <AlertTitle>Unable to load analysis history</AlertTitle>
          <AlertDescription className="break-words">{error.message}</AlertDescription>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => refetch()}>
            Try again
          </Button>
        </Alert>
      ) : filteredHistory.length > 0 ? (
        isMobile || viewMode === "grid" ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredHistory.map((item) => (
              <Card key={item.id} className="min-w-0 transition-shadow hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${getScoreBadgeColor(item.score)}`}>
                      <FileText className={`h-6 w-6 ${getScoreColor(item.score)}`} />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild><Link href={`/dashboard/analysis/${item.resumeId}`}><Eye className="mr-2 h-4 w-4" />View Analysis</Link></DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onSelect={() => requestDelete(item.resumeId, item.resumeName)}>
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <h3 className="mb-1 truncate text-sm font-medium" title={item.resumeName}>{item.resumeName}</h3>
                  <p className="mb-4 text-xs text-muted-foreground">{formatRelativeTime(item.dateTime)}</p>
                  <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
                    <div><p className="text-xs text-muted-foreground">Score</p><p className={`text-xl font-bold ${getScoreColor(item.score)}`}>{item.score}%</p></div>
                    <div><p className="text-xs text-muted-foreground">ATS</p><p className={`text-xl font-bold ${getScoreColor(item.atsScore)}`}>{item.atsScore}%</p></div>
                  </div>
                  <Button variant="outline" size="sm" className="mt-4 w-full" asChild><Link href={`/dashboard/analysis/${item.resumeId}`}><Eye className="mr-1 h-4 w-4" />View Analysis</Link></Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {filteredHistory.length} {filteredHistory.length === 1 ? "Analysis" : "Analyses"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredHistory.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm truncate" title={item.resumeName}>{item.resumeName}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                        <Calendar className="w-3 h-3 shrink-0" />
                        {formatRelativeTime(item.dateTime)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 shrink-0">
                    <div className="hidden sm:flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Score</p>
                        <div className="flex items-center gap-1">
                          <span className={`font-semibold ${getScoreColor(item.score)}`}>
                            {item.score}%
                          </span>
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">ATS</p>
                        <Badge className={getScoreBadgeColor(item.atsScore)}>
                          {item.atsScore}%
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/analysis/${item.resumeId}`}>
                          <Eye className="w-4 h-4 mr-1" />
                          View
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
                            Download Report
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onSelect={() => requestDelete(item.resumeId, item.resumeName)}>
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
              <h3 className="font-semibold text-lg mb-2">{searchQuery ? "No analyses found" : "No analyses yet"}</h3>
              <p className="text-muted-foreground text-sm mb-4">
                {searchQuery 
                  ? "Try adjusting your search query." 
                  : "Upload your resume and get real-time analysis."}
              </p>
              {!searchQuery && (
                <Button asChild>
                  <Link href="/dashboard/resumes">My Resume's</Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      <DeleteConfirmationDialog
        itemName={analysisToDelete?.name ?? "this analysis"}
        itemType="analysis"
        open={analysisToDelete !== null}
        isPending={deleteMutation.isPending}
        error={deleteMutation.error?.message}
        onOpenChange={(open) => {
          if (!open && !deleteMutation.isPending) setAnalysisToDelete(null);
        }}
        onConfirm={() => {
          if (analysisToDelete) deleteMutation.mutate(analysisToDelete.id);
        }}
      />
    </div>
  );
}