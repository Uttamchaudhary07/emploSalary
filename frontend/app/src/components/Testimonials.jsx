import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { TESTIMONIALS } from "@/constants/options";

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  const paginate = (newDirection) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) nextIndex = TESTIMONIALS.length - 1;
      if (nextIndex >= TESTIMONIALS.length) nextIndex = 0;
      return nextIndex;
    });
  };

  const current = TESTIMONIALS[currentIndex];

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-50/30 to-transparent dark:via-brand-900/5 pointer-events-none" />

      <div className="relative section-container">
        <div className="section-inner max-w-4xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-brand-50 dark:bg-brand-900/20 text-sm font-medium text-brand-600 dark:text-brand-400 mb-4">
              Testimonials
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
              Loved by{" "}
              <span className="gradient-text">Professionals</span>
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              See what others are saying about their experience with SalaryScope.
            </p>
          </motion.div>

          {/* Testimonial Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="relative bg-white dark:bg-slate-800 rounded-3xl shadow-large border border-slate-100 dark:border-slate-700 p-8 lg:p-12 overflow-hidden">
              {/* Quote decoration */}
              <div className="absolute top-6 right-8 text-brand-100 dark:text-brand-900/30">
                <Quote className="w-24 h-24" />
              </div>

              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                  className="relative"
                >
                  {/* Stars */}
                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < current.rating
                            ? "text-amber-400 fill-amber-400"
                            : "text-slate-200 dark:text-slate-700"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-xl lg:text-2xl text-slate-700 dark:text-slate-200 leading-relaxed mb-8 font-medium">
                    "{current.content}"
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold text-sm">
                      {current.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {current.name}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        {current.role} at {current.company}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  {TESTIMONIALS.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setDirection(index > currentIndex ? 1 : -1);
                        setCurrentIndex(index);
                      }}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentIndex
                          ? "w-8 bg-brand-500"
                          : "bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600"
                      }`}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => paginate(-1)}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => paginate(1)}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    aria-label="Next testimonial"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
