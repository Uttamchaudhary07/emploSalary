import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="pt-16 min-h-screen flex items-center justify-center">
      <div className="section-container">
        <div className="section-inner text-center max-w-lg mx-auto py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* 404 Illustration */}
            <div className="relative w-48 h-48 mx-auto mb-8">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-100 to-violet-100 dark:from-brand-900/20 dark:to-violet-900/20" />
              <div className="absolute inset-4 rounded-full bg-gradient-to-br from-brand-200 to-violet-200 dark:from-brand-800/20 dark:to-violet-800/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl font-bold gradient-text">404</span>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Page Not Found
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
              The page you're looking for doesn't exist or has been moved. Check the URL or navigate back to safety.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-brand-500/25"
              >
                <Home className="w-4 h-4" />
                Go Home
              </Link>
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </button>
            </div>

            {/* Quick Links */}
            <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800">
              <p className="text-sm text-slate-400 mb-4">Popular pages</p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {[
                  { name: "Salary Estimator", path: "/estimator" },
                  { name: "Features", path: "/features" },
                  { name: "About", path: "/about" },
                  { name: "Contact", path: "/contact" },
                ].map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
