import { 
  Target, 
  Sparkles, 
  FileSearch, 
  BarChart3, 
  Zap, 
  Shield 
} from "lucide-react";

const features = [
  {
    icon: Target,
    title: "ATS Optimization",
    description: "Ensure your resume passes Applicant Tracking Systems with our advanced compatibility analysis."
  },
  {
    icon: Sparkles,
    title: "AI-Powered Insights",
    description: "Get intelligent suggestions powered by machine learning to improve your resume content."
  },
  {
    icon: FileSearch,
    title: "Keyword Analysis",
    description: "Identify missing keywords and optimize your resume for specific job descriptions."
  },
  {
    icon: BarChart3,
    title: "Detailed Scoring",
    description: "Receive comprehensive scores across multiple dimensions including format, content, and impact."
  },
  {
    icon: Zap,
    title: "Instant Feedback",
    description: "Get real-time analysis results within seconds of uploading your resume."
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your resume data is encrypted and never shared. Delete your data anytime."
  }
];

export function Features() {
  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-balance">
            Everything you need to land your dream job
          </h2>
          <p className="text-muted-foreground text-lg">
            Our AI analyzes every aspect of your resume to help you stand out from the competition.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-card rounded-2xl border border-border p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
