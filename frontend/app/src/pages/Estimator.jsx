import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Calculator, ArrowRight, Info } from "lucide-react";
import PredictionForm from "@/components/PredictionForm";
import LoadingAnimation from "@/components/LoadingAnimation";
import { mockApi, salaryApi } from "@/services/api";
import { useToast } from "@/hooks/useToast";
import Toast from "@/components/Toast";

export default function Estimator() {
  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    try {
      // Try real API first, fall back to mock
      let result;
      try {
        result = await salaryApi.predict(formData);
      } catch {
        result = await mockApi.predict(formData);
      }

      addToast({
        type: "success",
        title: "Estimate Complete",
        message: "Your salary prediction is ready!",
      });

      // Navigate to results with state
      navigate("/result", { state: { result, formData } });
    } catch (error) {
      addToast({
        type: "error",
        title: "Error",
        message: error.message || "Failed to generate estimate. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="pt-16 min-h-screen">
      <Toast toasts={toasts} removeToast={removeToast} />

      {/* Header */}
      <section className="relative py-16 overflow-hidden mesh-gradient">
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
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-900/20 mb-6">
                <Calculator className="w-7 h-7 text-brand-600" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
                Salary{" "}
                <span className="gradient-text">Estimator</span>
              </h1>
              <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
                Fill in your details below and our AI will generate a personalized salary estimate based on real market data.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16">
        <div className="section-container">
          <div className="section-inner max-w-3xl mx-auto">
            {isLoading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-soft"
              >
                <LoadingAnimation />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="p-6 sm:p-8 lg:p-10 rounded-3xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-soft"
              >
                {/* Info banner */}
                <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 mb-8">
                  <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
                      How to get the best results
                    </p>
                    <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
                      Provide as much detail as possible. The more information you share, the more accurate your estimate will be.
                    </p>
                  </div>
                </div>

                <PredictionForm onSubmit={handleSubmit} isLoading={isLoading} />
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
