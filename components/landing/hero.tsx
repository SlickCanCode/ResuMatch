"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Upload, Check } from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { fadeUp, stagger } from "@/lib/motion";

/** Counts up to `value` once it scrolls into view. Runs only once. */
function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => Math.round(latest));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(motionValue, value, {
      duration: 1,
      delay: 0.4,
      ease: [0.16, 1, 0.3, 1],
    });
    return controls.stop;
  }, [isInView, value, motionValue]);

  useEffect(() => {
    return rounded.on("change", (v) => setDisplay(v));
  }, [rounded]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

export function Hero() {
  const { data: user } = useCurrentUser();

  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            className="space-y-8"
            variants={stagger(0.12)}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance"
            >
              Optimize Your Resume with <span className="text-accent">AI</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              Get instant feedback on your resume with our AI-powered analyzer.
              Improve your ATS score, identify missing keywords, and land more interviews.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-base" asChild>
                <Link href={user ? "/dashboard" : "/register"}>
                  {user ? "Go to Dashboard" : "Start Free Analysis"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-base" asChild>
                <Link href="#how-it-works">See How It Works</Link>
              </Button>
            </motion.div>

            <motion.div variants={fadeUp} className="flex items-center gap-6 pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="w-4 h-4 text-success" />
                Free to start
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="w-4 h-4 text-success" />
                No credit card required
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              className="bg-card rounded-2xl border border-border shadow-xl p-6 space-y-4"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
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
                  <span className="text-2xl font-bold text-accent">
                    <AnimatedNumber value={87} suffix="%" />
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-xl">
                  <span className="text-sm font-medium">ATS Compatibility</span>
                  <span className="text-2xl font-bold text-success">
                    <AnimatedNumber value={92} suffix="%" />
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-xl">
                  <span className="text-sm font-medium">Keywords Found</span>
                  <span className="text-2xl font-bold">
                    <AnimatedNumber value={24} suffix="/30" />
                  </span>
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
            </motion.div>

            <motion.div
              className="absolute -z-10 top-8 -right-4 w-full h-full bg-accent/10 rounded-2xl"
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}