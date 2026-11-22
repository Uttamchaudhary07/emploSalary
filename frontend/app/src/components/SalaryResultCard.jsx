import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import TakeHomeCalculator from "@/components/TakeHomeCalculator";
import { formatCurrency, formatCurrencyCompact } from "@/lib/utils";
import {
  Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

const panel = "min-w-0 p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-soft";
const heading = "text-lg font-bold text-slate-900 dark:text-white mb-2";
const note = "text-sm text-slate-500 dark:text-slate-400";

function MarketPayComparison({ benchmark, offer, currency, money, onOfferChange }) {
  const { p25, median, p75, sample_size, role, experience, country } = benchmark;
  const above = offer - median;
  const comparison = above === 0
    ? "Your offer matches the survey median."
    : `Your offer is ${money(Math.abs(above))} ${above > 0 ? "above" : "below"} the survey median.`;
  const cohort = [role || "All mapped tech roles", experience || "All experience levels", country].join(" · ");

  return (
    <section className={panel}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className={heading}>Compare Your Offer</h2>
          <p className={note}>{cohort} · {sample_size.toLocaleString()} survey responses</p>
        </div>
        <label className="grid gap-1 text-sm font-medium">
          Annual offer ({currency})
          <input
            type="number"
            min="0"
            value={offer || ""}
            onChange={(event) => onOfferChange(Math.max(0, Number(event.target.value)))}
            className="w-40 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent px-3 py-2"
          />
        </label>
      </div>
      <dl className="mt-5 grid grid-cols-3 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 divide-x divide-slate-200 dark:divide-slate-700">
        {[
          ["25th percentile", p25], ["Market median", median], ["75th percentile", p75],
        ].map(([label, value]) => (
          <div key={label} className="min-w-0 px-2 py-3 text-center sm:px-3">
            <dt className={note}>{label}</dt>
            <dd className="mt-1 text-sm font-semibold sm:text-base">{money(value)}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-sm font-medium">{offer > 0 && comparison}</p>
      <p className={note}>The offer field starts with the model estimate. Half of reported pay values fall between the 25th and 75th percentiles.</p>
    </section>
  );
}

export default function SalaryResultCard({ result, onNewEstimate }) {
  const {
    predicted_salary, currency, experience_estimates = [],
    role_estimates = [], benchmark_error, market_pay,
  } = result;
  const [offer, setOffer] = useState(Math.max(0, Math.round(predicted_salary)));
  const money = (value) => formatCurrency(value, currency);
  const compactMoney = (value) => currency === "INR"
    ? formatCurrencyCompact(value)
    : new Intl.NumberFormat("en-US", { style: "currency", currency, notation: "compact" }).format(value);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative p-8 rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-violet-700 text-white overflow-hidden"
      >
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-brand-200" />
          <span className="text-sm font-medium text-brand-100">Estimated Annual Total Compensation</span>
        </div>
        <div className="text-5xl sm:text-6xl font-bold mb-4">
          {formatCurrency(predicted_salary, currency)}
        </div>
        <p className="text-sm text-brand-100">2024 Stack Overflow Developer Survey · {currency}</p>
        {benchmark_error && (
          <details className="mt-3 text-sm text-brand-100">
            <summary className="cursor-pointer">Model accuracy</summary>
            <p className="mt-1">Average absolute error of {money(benchmark_error.mean_absolute_error)} across {benchmark_error.test_rows.toLocaleString()} held-out responses in this market.</p>
          </details>
        )}
      </motion.div>

      {market_pay && (
        <MarketPayComparison benchmark={market_pay} offer={offer} currency={currency} money={money} onOfferChange={setOffer} />
      )}

      {role_estimates.length > 1 && (
        <section className={panel}>
          <h2 className={heading}>Similar Roles Comparison</h2>
          <p className={note}>Model estimates with your country and years of experience held fixed.</p>
          <div className="mt-4" style={{ height: Math.max(210, role_estimates.length * 34) }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={role_estimates} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis type="number" tickFormatter={compactMoney} />
                <YAxis type="category" dataKey="role" width={124} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value) => [money(value), "Estimated compensation"]} />
                <Bar dataKey="salary" fill="#3b82f6" radius={[0, 5, 5, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      {experience_estimates.length > 0 && (
        <section className={panel}>
          <h2 className={heading}>Compensation by Experience</h2>
          <p className={note}>Model estimates for the same role and country at different experience levels.</p>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={experience_estimates}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis type="number" dataKey="years" domain={[0, "dataMax"]} tickFormatter={(years) => `${years} yr`} />
                <YAxis tickFormatter={compactMoney} width={60} />
                <Tooltip formatter={(value) => [money(value), "Estimated compensation"]} labelFormatter={(years) => `${years} years`} />
                <Line dataKey="salary" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      {currency === "INR" && (
        <TakeHomeCalculator ctc={offer} onCtcChange={setOffer} />
      )}

      <button
        onClick={onNewEstimate}
        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-2xl shadow-lg shadow-brand-500/25"
      >
        <ArrowRight className="w-5 h-5" />
        New Estimate
      </button>
    </div>
  );
}
