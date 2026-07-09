import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, MessageSquare, Send, MapPin, Clock, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import Toast from "@/components/Toast";

export default function Contact() {
  const { toasts, addToast, removeToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
    addToast({
      type: "success",
      title: "Message Sent",
      message: "We'll get back to you within 24 hours.",
    });
  };

  return (
    <main className="pt-16 min-h-screen">
      <Toast toasts={toasts} removeToast={removeToast} />

      {/* Hero */}
      <section className="relative py-20 overflow-hidden mesh-gradient">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-[10%] w-72 h-72 bg-brand-400/10 rounded-full blur-3xl" />
        </div>

        <div className="relative section-container">
          <div className="section-inner text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-brand-50 dark:bg-brand-900/20 text-sm font-medium text-brand-600 dark:text-brand-400 mb-4">
                Contact Us
              </span>
              <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
                Get in{" "}
                <span className="gradient-text">Touch</span>
              </h1>
              <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
                Have a question, feedback, or partnership inquiry? We'd love to hear from you.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 pb-24">
        <div className="section-container">
          <div className="section-inner">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-6"
              >
                <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-soft">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center mb-4">
                    <Mail className="w-5 h-5 text-brand-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Email</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    hello@salaryscope.com
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-soft">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center mb-4">
                    <Clock className="w-5 h-5 text-brand-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Response Time</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Within 24 hours
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-soft">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center mb-4">
                    <MapPin className="w-5 h-5 text-brand-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Location</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    San Francisco, CA
                  </p>
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="lg:col-span-2"
              >
                {isSubmitted ? (
                  <div className="p-8 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-soft text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                      className="w-16 h-16 mx-auto rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mb-4"
                    >
                      <CheckCircle className="w-8 h-8 text-emerald-600" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400">
                      Thank you for reaching out. We'll get back to you within 24 hours.
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-soft space-y-6"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900 focus:border-brand-400"
                          placeholder="Your name"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900 focus:border-brand-400"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Subject
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900 focus:border-brand-400"
                        placeholder="What's this about?"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Message
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900 focus:border-brand-400 resize-none"
                        placeholder="Tell us more..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 text-white font-semibold rounded-2xl transition-all duration-200 shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                          />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
