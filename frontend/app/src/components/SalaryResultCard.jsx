import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Gift,
  Award,
  Building2,
  MapPin,
  Briefcase,
  GraduationCap,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { formatCurrency, formatCurrencyCompact } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const COLORS = ["#3b82f6", "#8b5cf6", "#06b6d4", "#10b981"];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700">
        <p className="text-sm font-medium text-slate-900 dark:text-white">{label}</p>
        <p className="text-sm text-brand-600">
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

export default function SalaryResultCard({ result, onNewEstimate }) {
  if (!result) return null;

  const {
    predicted_salary,
    salary_range,
    confidence,
    breakdown,
    factors,
    similar_roles,
    market_trend,
  } = result;

  const compensationData = [
    { name: "Base Salary", value: breakdown?.base_salary || predicted_salary * 0.8 },
    { name: "Bonus", value: breakdown?.bonus || predicted_salary * 0.1 },
    { name: "Equity", value: breakdown?.equity || predicted_salary * 0.05 },
    { name: "Benefits", value: breakdown?.benefits_value || predicted_salary * 0.05 },
  ];

  const roleComparisonData = similar_roles?.map((role) => ({
    name: role.title,
    salary: role.salary,
  })) || [];

  const factorData = factors?.map((f) => ({
    factor: f.factor,
    contribution: f.contribution,
    fullMark: Math.max(...(factors?.map((f2) => f2.contribution) || [100])),
  })) || [];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header - Main Salary Display */}
      <motion.div
        variants={itemVariants}
        className="relative p-8 rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-violet-700 text-white overflow-hidden"
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-400 rounded-full blur-3xl" />
        </div>

        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-brand-200" />
            <span className="text-sm font-medium text-brand-100">Predicted Annual Salary</span>
          </div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            className="text-5xl sm:text-6xl font-bold mb-4"
          >
            {formatCurrency(predicted_salary)}
          </motion.div>

          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm">
              {market_trend?.direction === "up" ? (
                <TrendingUp className="w-4 h-4 text-emerald-300" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-300" />
              )}
              <span className="text-sm font-medium">
                {market_trend?.direction === "up" ? "+" : ""}
                {market_trend?.percentage}% this year
              </span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm">
              <span className="text-sm font-medium">
                {(confidence * 100).toFixed(0)}% confidence
              </span>
            </div>
          </div>

          {/* Salary Range */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-brand-100">
              <span>Range: {formatCurrency(salary_range?.low)} - {formatCurrency(salary_range?.high)}</span>
            </div>
            <div className="relative h-3 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1, delay: 0.5 }}
                className="absolute inset-y-0 left-0 rounded-full"
              >
                <div className="h-full w-full bg-gradient-to-r from-emerald-400 via-brand-300 to-violet-400 rounded-full" />
              </motion.div>
              {/* Position marker */}
              {salary_range?.low && salary_range?.high && (
                <motion.div
                  initial={{ left: "0%" }}
                  animate={{
                    left: `${((predicted_salary - salary_range.low) / (salary_range.high - salary_range.low)) * 100}%`,
                  }}
                  transition={{ duration: 1, delay: 0.7 }}
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg border-2 border-brand-400"
                />
              )}
            </div>
            <div className="flex justify-between text-xs text-brand-200">
              <span>Low: {formatCurrency(salary_range?.low)}</span>
              <span>Mid: {formatCurrency(predicted_salary)}</span>
              <span>High: {formatCurrency(salary_range?.high)}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Compensation Breakdown & Factors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <motion.div
          variants={itemVariants}
          className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-soft"
        >
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
            Compensation Breakdown
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={compensationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {compensationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 20px -2px rgb(0 0 0 / 0.08)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {compensationData.map((item, index) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm text-slate-600 dark:text-slate-400">{item.name}</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white ml-auto">
                  {formatCurrency(item.value)}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Radar Chart */}
        <motion.div
          variants={itemVariants}
          className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-soft"
        >
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
            Salary Factors
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={factorData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis
                  dataKey="factor"
                  tick={{ fontSize: 12, fill: "#64748b" }}
                />
                <PolarRadiusAxis tick={false} axisLine={false} />
                <Radar
                  name="Contribution"
                  dataKey="contribution"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
                <Tooltip
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 20px -2px rgb(0 0 0 / 0.08)",
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Similar Roles Comparison */}
      {roleComparisonData.length > 0 && (
        <motion.div
          variants={itemVariants}
          className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-soft"
        >
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
            Similar Roles Comparison
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roleComparisonData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  tickFormatter={(value) => formatCurrencyCompact(value)}
                  tick={{ fontSize: 12, fill: "#64748b" }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  width={120}
                />
                <Tooltip
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 20px -2px rgb(0 0 0 / 0.08)",
                  }}
                />
                <Bar dataKey="salary" fill="#3b82f6" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {/* Factors Detail */}
      <motion.div
        variants={itemVariants}
        className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-soft"
      >
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
          Impact Factors
        </h3>
        <div className="space-y-3">
          {factors?.map((factor, index) => (
            <div key={factor.factor} className="flex items-center gap-4">
              <div className="w-24 text-sm text-slate-500 dark:text-slate-400 flex-shrink-0">
                {factor.factor}
              </div>
              <div className="flex-1 h-6 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(factor.contribution / Math.max(...factors.map((f) => f.contribution))) * 100}%` }}
                  transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                  className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600"
                />
              </div>
              <div className="w-24 text-sm font-medium text-slate-700 dark:text-slate-300 text-right">
                {formatCurrency(factor.contribution)}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4 pt-4">
        <button
          onClick={onNewEstimate}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-2xl transition-all duration-200 shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:-translate-y-0.5 active:translate-y-0"
        >
          <ArrowRight className="w-5 h-5" />
          New Estimate
        </button>
        <button
          onClick={() => window.print()}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200"
        >
          Print Results
        </button>
      </motion.div>
    </motion.div>
  );
}
