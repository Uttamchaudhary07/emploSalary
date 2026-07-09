import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import { FAQ_DATA } from "@/constants/options";

function FAQItem({ question, answer, isOpen, onClick }) {
  return (
    <div className="border-b border-slate-100 dark:border-slate-700 last:border-0">
      <button
        onClick={onClick}
        className="flex items-center justify-between w-full py-5 text-left group"
        aria-expanded={isOpen}
      >
        <span className="text-base font-medium text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors pr-4">
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-brand-500 transition-colors" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const handleClick = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="relative py-24 overflow-hidden">
      <div className="relative section-container">
        <div className="section-inner max-w-3xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-brand-50 dark:bg-brand-900/20 text-sm font-medium text-brand-600 dark:text-brand-400 mb-4">
              FAQ
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
              Frequently Asked{" "}
              <span className="gradient-text">Questions</span>
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              Everything you need to know about our salary estimation tool.
            </p>
          </motion.div>

          {/* FAQ List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-soft divide-y divide-slate-100 dark:divide-slate-700 px-6"
          >
            {FAQ_DATA.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onClick={() => handleClick(index)}
              />
            ))}
          </motion.div>

          {/* Still have questions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12 text-center"
          >
            <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-brand-50 dark:bg-brand-900/20 border border-brand-100 dark:border-brand-800">
              <HelpCircle className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Still have questions?{" "}
                <a href="/contact" className="font-semibold text-brand-600 dark:text-brand-400 hover:underline">
                  Contact our team
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
