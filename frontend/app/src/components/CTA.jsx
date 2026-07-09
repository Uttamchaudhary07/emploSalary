import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CTA() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600 via-brand-700 to-violet-700" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgNjBWMHoiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PHBhdGggZD0iTTYwIDB2NjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />

        {/* Animated orbs */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-400/20 rounded-full blur-3xl"
        />
      </div>

      <div className="relative section-container">
        <div className="section-inner text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
              <Sparkles className="w-7 h-7 text-white" />
            </div>

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight">
              Ready to Discover Your{" "}
              <span className="text-brand-200">Market Value?</span>
            </h2>

            {/* Subtitle */}
            <p className="text-lg text-brand-100 mb-10 max-w-xl mx-auto leading-relaxed">
              Join over 500,000 professionals who have used our AI-powered tool to understand their worth and negotiate better salaries.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/estimator"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-700 font-semibold rounded-2xl transition-all duration-200 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0"
              >
                Get Your Free Estimate
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/features"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-200"
              >
                Explore Features
              </Link>
            </div>

            {/* Trust text */}
            <p className="mt-8 text-sm text-brand-200/80">
              Free to use. No credit card required. Results in seconds.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
