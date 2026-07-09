import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  TrendingUp,
  MapPin,
  Zap,
  Route,
  BarChart3,
  Shield,
  Clock,
  Globe,
  Lock,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    title: "AI-Powered Predictions",
    description:
      "Our advanced machine learning algorithms analyze over 500,000 real salary data points to provide highly accurate estimates tailored to your unique profile. The model considers 50+ factors including job title, experience, location, skills, education, company size, and industry trends.",
    icon: Brain,
    gradient: "from-violet-500 to-purple-600",
    bgColor: "bg-violet-50 dark:bg-violet-900/20",
    iconColor: "text-violet-600",
    highlights: [
      "Neural network-based predictions",
      "Continuously learning model",
      "92% accuracy rate",
      "Personalized to your profile",
    ],
    preview: {
      metric: "92%",
      metricLabel: "Model accuracy",
      bars: [
        { label: "Job title", value: 95 },
        { label: "Experience", value: 88 },
        { label: "Location", value: 82 },
        { label: "Skills", value: 74 },
      ],
    },
  },
  {
    title: "Real-Time Market Data",
    description:
      "Access the most current salary information refreshed weekly from thousands of companies worldwide. Our data pipeline processes job postings, compensation surveys, and market reports to keep you ahead of trends.",
    icon: TrendingUp,
    gradient: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    iconColor: "text-blue-600",
    highlights: [
      "Weekly data refresh",
      "Global market coverage",
      "Trend analysis & forecasting",
      "Industry-specific insights",
    ],
    preview: {
      metric: "Weekly",
      metricLabel: "Data refresh rate",
      bars: [
        { label: "Job postings", value: 90 },
        { label: "Compensation surveys", value: 78 },
        { label: "Market reports", value: 65 },
      ],
    },
  },
  {
    title: "Location Intelligence",
    description:
      "Get precise location-adjusted salary estimates that account for cost of living, local demand-supply dynamics, and regional market conditions. Compare salaries across 150+ cities worldwide.",
    icon: MapPin,
    gradient: "from-emerald-500 to-teal-500",
    bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
    iconColor: "text-emerald-600",
    highlights: [
      "150+ cities covered",
      "Cost of living adjustment",
      "Local market analysis",
      "Remote work premiums",
    ],
    preview: {
      metric: "150+",
      metricLabel: "Cities covered",
      bars: [
        { label: "San Francisco", value: 96 },
        { label: "New York", value: 91 },
        { label: "Austin", value: 73 },
        { label: "Remote", value: 68 },
      ],
    },
  },
  {
    title: "Skill-Based Analysis",
    description:
      "Understand exactly how each of your skills impacts your earning potential. Our skill premium analysis shows you which technologies and competencies command the highest salaries in today's market.",
    icon: Zap,
    gradient: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
    iconColor: "text-amber-600",
    highlights: [
      "50+ skills tracked",
      "Skill premium breakdown",
      "Learning recommendations",
      "Market demand scoring",
    ],
    preview: {
      metric: "50+",
      metricLabel: "Skills tracked",
      bars: [
        { label: "Machine learning", value: 94 },
        { label: "Cloud (AWS/GCP)", value: 87 },
        { label: "React", value: 76 },
        { label: "SQL", value: 70 },
      ],
    },
  },
  {
    title: "Career Path Insights",
    description:
      "Visualize your earning potential across different career trajectories. See how promotions, skill development, and role changes could impact your salary over time.",
    icon: Route,
    gradient: "from-rose-500 to-pink-500",
    bgColor: "bg-rose-50 dark:bg-rose-900/20",
    iconColor: "text-rose-600",
    highlights: [
      "Multi-path projections",
      "Promotion impact analysis",
      "Skill growth scenarios",
      "5-year forecasts",
    ],
    preview: {
      metric: "5-Year",
      metricLabel: "Growth projection",
      bars: [
        { label: "Senior Engineer", value: 100 },
        { label: "Staff Engineer", value: 85 },
        { label: "Principal Engineer", value: 60 },
        { label: "Engineering Manager", value: 45 },
      ],
    },
  },
  {
    title: "Industry Benchmarks",
    description:
      "Compare your estimated compensation against industry standards. See how your salary stacks up against peers in your role, location, and experience level.",
    icon: BarChart3,
    gradient: "from-indigo-500 to-blue-600",
    bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
    iconColor: "text-indigo-600",
    highlights: [
      "Percentile rankings",
      "Peer comparisons",
      "Industry reports",
      "Company-size adjustments",
    ],
    preview: {
      metric: "Top 12%",
      metricLabel: "Percentile rank",
      bars: [
        { label: "Your estimate", value: 88 },
        { label: "Industry median", value: 65 },
        { label: "Company-size avg", value: 70 },
      ],
    },
  },
];

const additionalFeatures = [
  { icon: Shield, title: "Private & Secure", description: "Your data is encrypted and never shared" },
  { icon: Clock, title: "Instant Results", description: "Get estimates in under 30 seconds" },
  { icon: Globe, title: "Global Coverage", description: "Salary data from 150+ cities worldwide" },
  { icon: Lock, title: "No Registration", description: "Use without creating an account" },
];

export default function Features() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="pt-16">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden mesh-gradient">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-[10%] w-72 h-72 bg-brand-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-[10%] w-96 h-96 bg-violet-400/10 rounded-full blur-3xl" />
        </div>

        <div className="relative section-container">
          <div className="section-inner text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-brand-50 dark:bg-brand-900/20 text-sm font-medium text-brand-600 dark:text-brand-400 mb-4">
                Features
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
                Everything You Need to{" "}
                <span className="gradient-text">Know Your Worth</span>
              </h1>
              <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
                Comprehensive salary intelligence powered by cutting-edge AI and the most extensive compensation database in the industry.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Detailed Features */}
      <section className="py-24">
        <div className="section-container">
          <div className="section-inner space-y-24">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                  className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} items-center gap-12 lg:gap-16`}
                >
                  {/* Content */}
                  <div className="flex-1">
                    <div
                      className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${feature.bgColor} mb-6`}
                    >
                      <Icon className={`w-7 h-7 ${feature.iconColor}`} />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4">
                      {feature.title}
                    </h2>
                    <p className="text-base text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                      {feature.description}
                    </p>
                    <ul className="space-y-3">
                      {feature.highlights.map((highlight) => (
                        <li key={highlight} className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-full bg-gradient-to-br ${feature.gradient} flex items-center justify-center flex-shrink-0`}
                          >
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-sm text-slate-600 dark:text-slate-300">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Visual */}
                  <div className="flex-1 w-full">
                    <div className="relative p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-soft">
                      <div
                        className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.gradient} opacity-[0.03] pointer-events-none`}
                      />
                      <div className="relative space-y-5">
                        {/* Header */}
                        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-700">
                          <div
                            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center`}
                          >
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-slate-900 dark:text-white">
                              {feature.title}
                            </div>
                            <div className="text-xs text-slate-400 dark:text-slate-500">Live preview</div>
                          </div>
                        </div>

                        {/* Headline metric */}
                        <div>
                          <div
                            className={`text-3xl font-bold bg-gradient-to-br ${feature.gradient} bg-clip-text text-transparent`}
                          >
                            {feature.preview.metric}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {feature.preview.metricLabel}
                          </div>
                        </div>

                        {/* Bars */}
                        <div className="space-y-2.5">
                          {feature.preview.bars.map((bar) => (
                            <div key={bar.label}>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                                  {bar.label}
                                </span>
                                <span className="text-xs text-slate-400 dark:text-slate-500">{bar.value}%</span>
                              </div>
                              <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full bg-gradient-to-r ${feature.gradient}`}
                                  style={{ width: `${bar.value}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-24 bg-slate-50/50 dark:bg-slate-800/20">
        <div className="section-container">
          <div className="section-inner">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                And There's More
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Additional features that make SalaryScope the best choice.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {additionalFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-soft"
                  >
                    <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-brand-600" />
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {feature.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="section-inner text-center"
          >
            <div className="p-12 rounded-3xl bg-gradient-to-br from-brand-600 to-brand-700 text-white">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-brand-100 mb-8 max-w-xl mx-auto">
                Experience the most accurate salary estimation tool trusted by professionals worldwide.
              </p>
              <Link
                to="/estimator"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-700 font-semibold rounded-2xl hover:bg-brand-50 transition-colors shadow-lg"
              >
                Try It Now
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
