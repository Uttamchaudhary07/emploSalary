import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { TrendingUp, Users, Building2, Globe, DollarSign, BarChart3 } from "lucide-react";
import CountUp from "react-countup";

const stats = [
  {
    label: "Avg. Software Engineer Salary",
    value: 1250000,
    prefix: "₹",
    suffix: "",
    indianGrouping: true,
    icon: DollarSign,
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    iconColor: "text-blue-600",
  },
  {
    label: "Active Users",
    value: 524891,
    prefix: "",
    suffix: "+",
    icon: Users,
    color: "from-violet-500 to-purple-600",
    bgColor: "bg-violet-50 dark:bg-violet-900/20",
    iconColor: "text-violet-600",
  },
  {
    label: "Companies in Database",
    value: 15000,
    prefix: "",
    suffix: "+",
    icon: Building2,
    color: "from-emerald-500 to-teal-500",
    bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
    iconColor: "text-emerald-600",
  },
  {
    label: "Cities Covered",
    value: 150,
    prefix: "",
    suffix: "+",
    icon: Globe,
    color: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
    iconColor: "text-amber-600",
  },
  {
    label: "Salary Growth (YoY)",
    value: 4.2,
    prefix: "",
    suffix: "%",
    icon: TrendingUp,
    color: "from-rose-500 to-pink-500",
    bgColor: "bg-rose-50 dark:bg-rose-900/20",
    iconColor: "text-rose-600",
    decimals: 1,
  },
  {
    label: "Data Points Analyzed",
    value: 2.5,
    prefix: "",
    suffix: "M+",
    icon: BarChart3,
    color: "from-indigo-500 to-blue-600",
    bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
    iconColor: "text-indigo-600",
    decimals: 1,
  },
];

function AnimatedCounter({ value, prefix, suffix, decimals = 0, indianGrouping = false, inView }) {
  return (
    <span className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
      {prefix}
      {inView ? (
        <CountUp
          end={value}
          duration={2.5}
          separator=","
          decimals={decimals}
          suffix={suffix}
          formattingFn={
            indianGrouping
              ? (n) => `${new Intl.NumberFormat("en-IN").format(Math.round(n))}${suffix}`
              : undefined
          }
        />
      ) : (
        `0${suffix}`
      )}
    </span>
  );
}

export default function StatisticsCards() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/80 to-white dark:from-slate-800/30 dark:to-slate-900 pointer-events-none" />

      <div className="relative section-container">
        <div className="section-inner">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-brand-50 dark:bg-brand-900/20 text-sm font-medium text-brand-600 dark:text-brand-400 mb-4">
              Market Intelligence
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
              Backed by{" "}
              <span className="gradient-text">Real Data</span>
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              Our estimates are powered by millions of real-world data points from across the globe.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-soft hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl ${stat.bgColor}`}>
                      <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                    </div>
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${stat.color}`} />
                  </div>

                  <AnimatedCounter
                    value={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    decimals={stat.decimals}
                    indianGrouping={stat.indianGrouping}
                    inView={isInView}
                  />
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
