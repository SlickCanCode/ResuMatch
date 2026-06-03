"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Upload, Sparkles, Check } from "lucide-react";

export function Hero() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-full text-sm text-muted-foreground">
              <Sparkles className="w-4 h-4 text-accent" />
              AI-Powered Resume Analysis
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
              Optimize Your Resume with{" "}
              <span className="text-accent">AI</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              Get instant feedback on your resume with our AI-powered analyzer. 
              Improve your ATS score, identify missing keywords, and land more interviews.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-base" asChild>
                <Link href="/register">
                  Start Free Analysis
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-base" asChild>
                <Link href="#how-it-works">See How It Works</Link>
              </Button>
            </div>

            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="w-4 h-4 text-success" />
                Free to start
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="w-4 h-4 text-success" />
                No credit card required
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-card rounded-2xl border border-border shadow-xl p-6 space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b border-border">
                <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center">
                  <Upload className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-sm">Upload Resume</p>
                  <p className="text-xs text-muted-foreground">PDF, DOCX supported</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-xl">
                  <span className="text-sm font-medium">Resume Score</span>
                  <span className="text-2xl font-bold text-accent">87%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-xl">
                  <span className="text-sm font-medium">ATS Compatibility</span>
                  <span className="text-2xl font-bold text-success">92%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-xl">
                  <span className="text-sm font-medium">Keywords Found</span>
                  <span className="text-2xl font-bold">24/30</span>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2">Top Suggestions</p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-warning mt-2" />
                    <span className="text-muted-foreground">Add more quantifiable achievements</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-warning mt-2" />
                    <span className="text-muted-foreground">Include relevant industry keywords</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -z-10 top-8 -right-4 w-full h-full bg-accent/10 rounded-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
