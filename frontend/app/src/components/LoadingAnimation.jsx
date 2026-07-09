import { motion } from "framer-motion";

export default function LoadingAnimation() {
  const steps = [
    "Analyzing your profile...",
    "Comparing market data...",
    "Calculating salary range...",
    "Generating insights...",
  ];

  return (
    <div className="flex flex-col items-center justify-center py-16">
      {/* Animated circles */}
      <div className="relative w-24 h-24 mb-8">
        {/* Outer ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border-2 border-slate-100 dark:border-slate-700"
        >
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-brand-500" />
        </motion.div>

        {/* Middle ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-3 rounded-full border-2 border-slate-100 dark:border-slate-700"
        >
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-violet-500" />
        </motion.div>

        {/* Inner ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="absolute inset-6 rounded-full border-2 border-slate-100 dark:border-slate-700"
        >
          <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-500" />
        </motion.div>

        {/* Center dot */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-brand-400 to-brand-600" />
        </motion.div>
      </div>

      {/* Progress steps */}
      <div className="space-y-3 w-full max-w-xs">
        {steps.map((step, index) => (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: -20 }}
            animate={{
              opacity: [0, 1, 1, 0.5],
              x: 0,
            }}
            transition={{
              duration: 2,
              delay: index * 0.8,
              repeat: Infinity,
              repeatDelay: steps.length * 0.8 - 2,
            }}
            className="flex items-center gap-3"
          >
            <motion.div
              animate={{
                backgroundColor: ["#e2e8f0", "#3b82f6", "#3b82f6", "#e2e8f0"],
              }}
              transition={{
                duration: 2,
                delay: index * 0.8,
                repeat: Infinity,
                repeatDelay: steps.length * 0.8 - 2,
              }}
              className="w-2 h-2 rounded-full"
            />
            <span className="text-sm text-slate-500 dark:text-slate-400">{step}</span>
          </motion.div>
        ))}
      </div>

      {/* Loading bar */}
      <div className="mt-8 w-64 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
        <motion.div
          animate={{
            width: ["0%", "30%", "60%", "100%"],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="h-full bg-gradient-to-r from-brand-500 via-violet-500 to-brand-500 rounded-full"
        />
      </div>
    </div>
  );
}
