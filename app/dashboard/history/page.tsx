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
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus,
  Upload,
} from "lucide-react";

const analysisHistory = [
  {
    id: 1,
    fileName: "Software_Engineer_Resume.pdf",
    date: "May 5, 2026",
    time: "2:30 PM",
    overallScore: 87,
    atsScore: 92,
    previousScore: 82,
    status: "completed",
  },
  {
    id: 2,
    fileName: "Product_Manager_CV.pdf",
    date: "May 3, 2026",
    time: "10:15 AM",
    overallScore: 72,
    atsScore: 78,
    previousScore: 72,
    status: "completed",
  },
  {
    id: 3,
    fileName: "Data_Analyst_Resume.pdf",
    date: "May 1, 2026",
    time: "4:45 PM",
    overallScore: 95,
    atsScore: 98,
    previousScore: 88,
    status: "completed",
  },
  {
    id: 4,
    fileName: "UX_Designer_Portfolio.pdf",
    date: "Apr 28, 2026",
    time: "9:00 AM",
    overallScore: 68,
    atsScore: 65,
    previousScore: 75,
    status: "completed",
  },
  {
    id: 5,
    fileName: "Marketing_Manager_Resume.pdf",
    date: "Apr 25, 2026",
    time: "3:20 PM",
    overallScore: 81,
    atsScore: 85,
    previousScore: null,
    status: "completed",
  },
  {
    id: 6,
    fileName: "Frontend_Developer_CV.pdf",
    date: "Apr 20, 2026",
    time: "11:30 AM",
    overallScore: 89,
    atsScore: 91,
    previousScore: 85,
    status: "completed",
  },
];

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredHistory = analysisHistory.filter((item) =>
    item.fileName.toLowerCase().includes(searchQuery.toLowerCase())
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

  const getTrendIcon = (current: number, previous: number | null) => {
    if (previous === null) return <Minus className="w-4 h-4 text-muted-foreground" />;
    if (current > previous) return <TrendingUp className="w-4 h-4 text-success" />;
    if (current < previous) return <TrendingDown className="w-4 h-4 text-destructive" />;
    return <Minus className="w-4 h-4 text-muted-foreground" />;
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
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by file name..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* History List */}
      {filteredHistory.length > 0 ? (
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
                  className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{item.fileName}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                        <Calendar className="w-3 h-3" />
                        {item.date} at {item.time}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="hidden sm:flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Score</p>
                        <div className="flex items-center gap-1">
                          <span className={`font-semibold ${getScoreColor(item.overallScore)}`}>
                            {item.overallScore}%
                          </span>
                          {getTrendIcon(item.overallScore, item.previousScore)}
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
                        <Link href={`/dashboard/analysis/${item.id}`}>
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
      ) : (
        <Card>
          <CardContent className="p-12">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">No analyses found</h3>
              <p className="text-muted-foreground text-sm mb-4">
                {searchQuery 
                  ? "Try adjusting your search query." 
                  : "Upload a resume to get started with your first analysis."}
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
