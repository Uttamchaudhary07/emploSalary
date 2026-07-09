import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Wallet } from "lucide-react";
import { NAV_LINKS } from "@/constants/options";
import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-soft border-b border-slate-200/50 dark:border-slate-700/50"
            : "bg-transparent"
        }`}
      >
        <nav className="section-container">
          <div className="section-inner flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-500/25 group-hover:shadow-brand-500/40 transition-shadow duration-300">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                Salary<span className="text-brand-600">Scope</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(link.path)
                      ? "text-brand-600 dark:text-brand-400"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {link.name}
                  {isActive(link.path) && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 bg-brand-50 dark:bg-brand-900/20 rounded-lg border border-brand-200/50 dark:border-brand-700/30"
                      style={{ zIndex: -1 }}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden md:flex items-center gap-3">
              <ThemeToggle />

              <Link
                to="/estimator"
                className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:-translate-y-0.5 active:translate-y-0"
              >
                Get Estimate
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center gap-1">
              <ThemeToggle />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/20 dark:bg-black/40 backdrop-blur-sm md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-72 max-w-[85vw] bg-white dark:bg-slate-900 shadow-2xl md:hidden"
          >
            <div className="flex flex-col h-full p-6">
              <div className="flex items-center justify-between mb-8">
                <Link to="/" className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-lg font-bold text-slate-900 dark:text-white">
                    Salary<span className="text-brand-600">Scope</span>
                  </span>
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col gap-1 flex-1">
                {NAV_LINKS.map((link, index) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 + 0.1 }}
                  >
                    <Link
                      to={link.path}
                      className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isActive(link.path)
                          ? "bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400"
                          : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Link
                  to="/estimator"
                  className="flex items-center justify-center w-full px-5 py-3 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-brand-500/25"
                >
                  Get Your Estimate
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
