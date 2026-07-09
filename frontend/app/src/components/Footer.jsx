import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Wallet, Github, Linkedin, Mail, ArrowUpRight } from "lucide-react";
import { SOCIAL_LINKS } from "@/constants/options";

const socialIconMap = { Github, Linkedin, Mail };

const footerLinks = {
  product: [
    { name: "Salary Estimator", href: "/estimator" },
    { name: "Features", href: "/features" },
    { name: "Market Trends", href: "/features#trends" },
    { name: "API Access", href: "#" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Careers", href: "#" },
    { name: "Blog", href: "#" },
  ],
  resources: [
    { name: "Documentation", href: "#" },
    { name: "Salary Guide", href: "#" },
    { name: "Negotiation Tips", href: "#" },
    { name: "FAQ", href: "/features#faq" },
  ],
  legal: [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Cookie Policy", href: "#" },
    { name: "GDPR", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="relative bg-slate-900 text-slate-300 overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-800/50 to-slate-900 pointer-events-none" />

      {/* Animated mesh gradient */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative section-container pt-16 pb-8">
        <div className="section-inner">
          {/* Top section */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 lg:gap-12 mb-12">
            {/* Brand */}
            <div className="col-span-2">
              <Link to="/" className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white tracking-tight">
                  Salary<span className="text-brand-400">Scope</span>
                </span>
              </Link>
              <p className="text-sm text-slate-400 mb-6 max-w-xs">
                AI-powered salary predictions to help you understand your true market value and negotiate with confidence.
              </p>
              <div className="flex items-center gap-3">
                {SOCIAL_LINKS.map((social) => {
                  const Icon = socialIconMap[social.icon];
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target={social.href.startsWith("http") ? "_blank" : undefined}
                      rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors"
                      aria-label={social.name}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Links */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                  {category}
                </h3>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-sm text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1 group"
                      >
                        {link.name}
                        {link.href.startsWith("#") && (
                          <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-slate-800 pt-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-slate-500">
                &copy; {new Date().getFullYear()} SalaryScope. All rights reserved.
              </p>
              <div className="flex items-center gap-6">
                <a href="#" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
                  Privacy
                </a>
                <a href="#" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
                  Terms
                </a>
                <a href="#" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
                  Cookies
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
