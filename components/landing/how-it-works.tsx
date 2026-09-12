"use client";

import { motion } from "framer-motion";
import { Upload, Cpu, FileCheck, Rocket } from "lucide-react";
import { fadeUp, stagger } from "@/lib/motion";

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Upload Your Resume",
    description: "Simply drag and drop your resume in PDF or DOCX format. Our system accepts most common file types."
  },
  {
    icon: Cpu,
    step: "02",
    title: "AI Analysis",
    description: "Our advanced AI engine scans your resume, analyzing content, formatting, keywords, and ATS compatibility."
  },
  {
    icon: FileCheck,
    step: "03",
    title: "Get Detailed Report",
    description: "Receive a comprehensive report with scores, suggestions, and actionable insights to improve your resume."
  },
  {
    icon: Rocket,
    step: "04",
    title: "Apply with Confidence",
    description: "Use our recommendations to optimize your resume and increase your chances of landing interviews."
  }
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-balance">
            How ResuMatch Works
          </h2>
          <p className="text-muted-foreground text-lg">
            Four simple steps to transform your resume into a job-winning document.
          </p>
        </motion.div>

        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={stagger(0.15)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {steps.map((step, index) => (
            <motion.div key={index} variants={fadeUp} className="relative">
              <div className="text-6xl font-bold text-secondary mb-4">
                {step.step}
              </div>
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-4">
                <step.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {step.description}
              </p>
              {index < steps.length - 1 && (
                <motion.div
                  className="hidden lg:block absolute top-12 left-full w-full h-px bg-border -translate-x-1/2 origin-left"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.15, ease: [0.16, 1, 0.3, 1] }}
                />
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}