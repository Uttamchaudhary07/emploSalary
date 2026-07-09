import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Download, Share2, TrendingUp } from "lucide-react";
import SalaryResultCard from "@/components/SalaryResultCard";
import TakeHomeCalculator from "@/components/TakeHomeCalculator";
import { formatCurrency } from "@/lib/utils";

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const { result, formData } = location.state || {};

  useEffect(() => {
    window.scrollTo(0, 0);

    // Redirect if no result data
    if (!result) {
      navigate("/estimator");
    }
  }, [result, navigate]);

  if (!result) return null;

  return (
    <main className="pt-16 min-h-screen">
      {/* Header */}
      <section className="relative py-12 overflow-hidden mesh-gradient">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-[10%] w-72 h-72 bg-brand-400/10 rounded-full blur-3xl" />
        </div>

        <div className="relative section-container">
          <div className="section-inner">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Back button */}
              <button
                onClick={() => navigate("/estimator")}
                className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Estimator
              </button>

              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                    Your Salary{" "}
                    <span className="gradient-text">Estimate</span>
                  </h1>
                  <p className="text-slate-500 dark:text-slate-400 mt-2">
                    Based on your profile as a {formData?.job_title} in {formData?.location}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: "My Salary Estimate",
                          text: `My estimated salary is ${formatCurrency(result.predicted_salary)}`,
                        });
                      }
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Result Content */}
      <section className="py-12 pb-24">
        <div className="section-container">
          <div className="section-inner max-w-4xl mx-auto">
            <SalaryResultCard
              result={result}
              onNewEstimate={() => navigate("/estimator")}
            />

            <div className="mt-6">
              <TakeHomeCalculator defaultCTC={result.predicted_salary} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
