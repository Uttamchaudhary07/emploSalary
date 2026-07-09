import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Shield, Zap, BarChart3, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import Hero from "@/components/Hero";
import FeatureCards from "@/components/FeatureCards";
import StatisticsCards from "@/components/StatisticsCards";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";

export default function Home() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main>
      <Hero />
      <FeatureCards />
      <StatisticsCards />

      {/* How It Works Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 to-white dark:from-slate-800/20 dark:to-slate-900 pointer-events-none" />

        <div className="relative section-container">
          <div className="section-inner">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-brand-50 dark:bg-brand-900/20 text-sm font-medium text-brand-600 dark:text-brand-400 mb-4">
                How It Works
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
                Three Simple{" "}
                <span className="gradient-text">Steps</span>
              </h2>
              <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                Get your personalized salary estimate in under 60 seconds.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Enter Your Details",
                  description:
                    "Fill in your job title, experience, location, skills, and other relevant information about your profile.",
                  icon: Sparkles,
                  color: "from-blue-500 to-cyan-500",
                },
                {
                  step: "02",
                  title: "AI Analysis",
                  description:
                    "Our machine learning model processes your data against millions of real salary data points.",
                  icon: BarChart3,
                  color: "from-violet-500 to-purple-600",
                },
                {
                  step: "03",
                  title: "Get Your Estimate",
                  description:
                    "Receive a detailed salary breakdown with confidence intervals, market trends, and actionable insights.",
                  icon: Zap,
                  color: "from-emerald-500 to-teal-500",
                },
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                    className="relative"
                  >
                    {/* Connector line */}
                    {index < 2 && (
                      <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-slate-200 to-transparent dark:from-slate-700" />
                    )}

                    <div className="relative p-8 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-soft hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
                      <div className="flex items-center justify-between mb-6">
                        <div
                          className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} text-white`}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className="text-4xl font-bold text-slate-100 dark:text-slate-700">
                          {item.step}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                        {item.title}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <Testimonials />
      <FAQ />
      <CTA />
    </main>
  );
}
