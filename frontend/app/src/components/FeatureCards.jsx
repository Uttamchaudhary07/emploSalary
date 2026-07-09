import { motion } from "framer-motion";
import { Brain, TrendingUp, MapPin, Zap, Route, BarChart3, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const iconMap = {
  Brain,
  TrendingUp,
  MapPin,
  Zap,
  Route,
  BarChart3,
};

const features = [
  {
    title: "AI-Powered Predictions",
    description:
      "Our machine learning model analyzes thousands of data points to deliver accurate salary estimates tailored to your profile.",
    icon: "Brain",
    gradient: "from-violet-500 to-purple-600",
    bgGradient: "from-violet-500/10 to-purple-600/10",
    iconColor: "text-violet-600",
  },
  {
    title: "Real-Time Market Data",
    description:
      "Access up-to-date salary information from companies across the globe, refreshed weekly with the latest market trends.",
    icon: "TrendingUp",
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-500/10 to-cyan-500/10",
    iconColor: "text-blue-600",
  },
  {
    title: "Location Intelligence",
    description:
      "Get location-adjusted estimates that account for cost of living, local demand, and regional market conditions.",
    icon: "MapPin",
    gradient: "from-emerald-500 to-teal-500",
    bgGradient: "from-emerald-500/10 to-teal-500/10",
    iconColor: "text-emerald-600",
  },
  {
    title: "Skill-Based Analysis",
    description:
      "See how your specific skills impact your earning potential with detailed skill premium breakdowns.",
    icon: "Zap",
    gradient: "from-amber-500 to-orange-500",
    bgGradient: "from-amber-500/10 to-orange-500/10",
    iconColor: "text-amber-600",
  },
  {
    title: "Career Path Insights",
    description:
      "Explore how your salary could grow with different career paths, promotions, and skill development.",
    icon: "Route",
    gradient: "from-rose-500 to-pink-500",
    bgGradient: "from-rose-500/10 to-pink-500/10",
    iconColor: "text-rose-600",
  },
  {
    title: "Industry Benchmarks",
    description:
      "Compare your estimated salary against industry standards and see where you stand in the market.",
    icon: "BarChart3",
    gradient: "from-indigo-500 to-blue-600",
    bgGradient: "from-indigo-500/10 to-blue-600/10",
    iconColor: "text-indigo-600",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export default function FeatureCards() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/50 to-transparent dark:via-slate-800/20 pointer-events-none" />

      <div className="relative section-container">
        <div className="section-inner">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-brand-50 dark:bg-brand-900/20 text-sm font-medium text-brand-600 dark:text-brand-400 mb-4">
              Features
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
              Everything You Need to{" "}
              <span className="gradient-text">Know Your Value</span>
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              Comprehensive salary intelligence powered by cutting-edge AI and real market data.
            </p>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature) => {
              const Icon = iconMap[feature.icon];
              return (
                <motion.div
                  key={feature.title}
                  variants={itemVariants}
                  className="group relative p-6 lg:p-8 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-soft hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Icon */}
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${feature.bgGradient} mb-5`}
                  >
                    <Icon className={`w-6 h-6 ${feature.iconColor}`} />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                    {feature.description}
                  </p>

                  {/* Learn more link */}
                  <Link
                    to="/features"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 dark:text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    Learn more
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  {/* Hover gradient border effect */}
                  <div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300 pointer-events-none`}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
