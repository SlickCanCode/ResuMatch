"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { scaleIn, stagger } from "@/lib/motion";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for trying out ResumeAI",
    features: [
      "15 resume analyses per month",
      "Advanced ATS compatibility check",
      "Skill upgrade suggestions",
    ],
    cta: "Get Started",
    popular: false
  },
  // {
  //   name: "Pro",
  //   price: "$12",
  //   period: "per month",
  //   description: "Best for active job seekers",
  //   features: [
  //     "Unlimited resume analyses",
  //     "Advanced ATS optimization",
  //     "Job description matching",
  //     "Grammar & style suggestions",
  //     "Priority support",
  //     "Export detailed reports"
  //   ],
  //   cta: "Start Free Trial",
  //   popular: true
  // },
  // {
  //   name: "Team",
  //   price: "$49",
  //   period: "per month",
  //   description: "For career coaches & recruiters",
  //   features: [
  //     "Everything in Pro",
  //     "Up to 10 team members",
  //     "Bulk resume analysis",
  //     "Custom branding",
  //     "API access",
  //     "Dedicated account manager"
  //   ],
  //   cta: "Contact Sales",
  //   popular: false
  // }
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-balance">
            Try it for free!
          </h2>
          <p className="text-muted-foreground text-lg">
            Try the beta version now without charges
          </p>
        </motion.div>

        <motion.div
          className="flex justify-center gap-6 max-w-5xl mx-auto"
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              variants={scaleIn}
              whileHover={{ y: -4 }}
              className={`relative bg-card rounded-2xl border p-6 ${
                plan.popular
                  ? "border-accent shadow-lg scale-105"
                  : "border-border"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-accent text-accent-foreground text-xs font-medium rounded-full">
                  Most Popular
                </div>
              )}
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-1">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-success mt-0.5 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full"
                variant={plan.popular ? "default" : "outline"}
                asChild
              >
                <Link href="/register">{plan.cta}</Link>
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}