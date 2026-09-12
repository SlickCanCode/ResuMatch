"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { fadeUp, stagger } from "@/lib/motion";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Software Engineer at Google",
    content: "ResumeAI helped me identify key skills I was missing. After optimizing my resume, I got callbacks from 5 top tech companies within a week.",
    rating: 5
  },
  {
    name: "Michael Rodriguez",
    role: "Product Manager at Meta",
    content: "The ATS compatibility score was a game-changer. I had no idea my formatting was causing issues. Now my resume passes every system.",
    rating: 5
  },
  {
    name: "Emily Watson",
    role: "Marketing Director",
    content: "I was skeptical at first, but the AI suggestions were incredibly insightful. My resume went from generic to compelling in just one session.",
    rating: 5
  }
];

const starVariants = {
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 400, damping: 15 }
  },
};

export function Testimonials() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-balance">
            Already Trusted by job seekers
          </h2>
          <p className="text-muted-foreground text-lg">
            See what our users have to say about their experience with ResuMatch.
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-6"
          variants={stagger(0.12)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={fadeUp}
              className="bg-card rounded-2xl border border-border p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <motion.div
                className="flex gap-1 mb-4"
                variants={stagger(0.06)}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <motion.div key={i} variants={starVariants}>
                    <Star className="w-4 h-4 fill-warning text-warning" />
                  </motion.div>
                ))}
              </motion.div>
              <p className="text-foreground mb-6 leading-relaxed">
                &quot;{testimonial.content}&quot;
              </p>
              <div>
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}