import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Shield, Zap } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden mesh-gradient">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating orbs */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-[10%] w-72 h-72 bg-brand-400/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            scale: [1, 0.95, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 right-[10%] w-96 h-96 bg-violet-400/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, -15, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-cyan-400/8 rounded-full blur-3xl"
        />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative section-container pt-32 pb-20">
        <div className="section-inner text-center max-w-5xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 dark:bg-brand-900/20 border border-brand-200/50 dark:border-brand-700/30 mb-8"
          >
            <Sparkles className="w-4 h-4 text-brand-500" />
            <span className="text-sm font-medium text-brand-700 dark:text-brand-300">
              AI-Powered Salary Intelligence
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 text-balance"
          >
            Know Your{" "}
            <span className="gradient-text">Worth</span>
            <br />
            <span className="text-slate-400 font-light">in the Market</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Get accurate salary estimates powered by machine learning. Make informed career decisions and negotiate with confidence.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link
              to="/estimator"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-2xl transition-all duration-200 shadow-xl shadow-brand-500/25 hover:shadow-brand-500/40 hover:-translate-y-0.5 active:translate-y-0"
            >
              Get Your Estimate
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/features"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
            >
              Learn More
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-8 text-sm text-slate-400"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span>Private & Secure</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Instant Results</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-500" />
              <span>AI-Powered</span>
            </div>
          </motion.div>

          {/* Stats Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
          >
            {[
              { value: "500K+", label: "Estimates Generated" },
              { value: "92%", label: "Accuracy Rate" },
              { value: "150+", label: "Cities Covered" },
              { value: "2.5M", label: "Data Points" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                className="p-4 rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/30"
              >
                <div className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}
