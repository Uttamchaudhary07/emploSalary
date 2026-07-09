import { useEffect } from "react";
import { motion } from "framer-motion";
import { Target, Eye, Heart, Users, Award, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const values = [
  {
    icon: Target,
    title: "Accuracy First",
    description:
      "We prioritize precision in every prediction. Our models are continuously trained and validated against real-world compensation data.",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    iconColor: "text-blue-600",
  },
  {
    icon: Eye,
    title: "Transparency",
    description:
      "We believe in showing our work. Every estimate includes a detailed breakdown of factors and how they influence your salary prediction.",
    color: "from-violet-500 to-purple-600",
    bgColor: "bg-violet-50 dark:bg-violet-900/20",
    iconColor: "text-violet-600",
  },
  {
    icon: Heart,
    title: "User Privacy",
    description:
      "Your data belongs to you. We never sell personal information and use industry-leading security practices to protect your data.",
    color: "from-rose-500 to-pink-500",
    bgColor: "bg-rose-50 dark:bg-rose-900/20",
    iconColor: "text-rose-600",
  },
  {
    icon: Users,
    title: "Accessibility",
    description:
      "Salary information should be free and accessible to everyone. Our core tools are available at no cost.",
    color: "from-emerald-500 to-teal-500",
    bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
    iconColor: "text-emerald-600",
  },
];

const team = [
  {
    name: "Uttam Chaudhary",
    initials: "UC",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    name: "Tanya Singh",
    initials: "TS",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    name: "Uchadadia Krushil Mukeshbhai",
    initials: "UM",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    name: "Tanisha Rajesh Vernekar",
    initials: "TV",
    gradient: "from-rose-500 to-pink-500",
  },
  {
    name: "V Deepak",
    initials: "VD",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    name: "Thangedukunta Hebbar Sreeram",
    initials: "TS",
    gradient: "from-indigo-500 to-blue-600",
  },
];

export default function About() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="pt-16">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden mesh-gradient">
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
              <span className="inline-block px-4 py-1.5 rounded-full bg-brand-50 dark:bg-brand-900/20 text-sm font-medium text-brand-600 dark:text-brand-400 mb-4">
                About Us
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
                Empowering Professionals with{" "}
                <span className="gradient-text">Salary Intelligence</span>
              </h1>
              <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
                We believe everyone deserves to know their market value. Our mission is to democratize salary information and help professionals make informed career decisions.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24">
        <div className="section-container">
          <div className="section-inner">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto text-center"
            >
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
                SalaryScope was founded on a simple belief: salary transparency empowers workers. When you know your market value, you can negotiate better, plan your career strategically, and make informed decisions about your professional future.
              </p>
              <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
                We combine cutting-edge machine learning with comprehensive market data to deliver accurate, personalized salary estimates that help professionals understand their true worth.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-slate-50/50 dark:bg-slate-800/20">
        <div className="section-container">
          <div className="section-inner">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                Our Values
              </h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
                The principles that guide everything we do.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="p-8 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-soft"
                  >
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${value.bgColor} mb-4`}>
                      <Icon className={`w-6 h-6 ${value.iconColor}`} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                      {value.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      {value.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-slate-50/50 dark:bg-slate-800/20">
        <div className="section-container">
          <div className="section-inner">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                Meet the Team
              </h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
                The passionate people behind SalaryScope.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {team.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-soft text-center"
                >
                  <div
                    className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${member.gradient} flex items-center justify-center text-white text-xl font-bold mb-4`}
                  >
                    {member.initials}
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    {member.name}
                  </h3>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="section-inner text-center"
          >
            <div className="p-12 rounded-3xl bg-gradient-to-br from-brand-600 to-brand-700 text-white">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Discover Your Worth?
              </h2>
              <p className="text-brand-100 mb-8 max-w-xl mx-auto">
                Join the 500,000+ professionals who have used SalaryScope to understand their market value.
              </p>
              <Link
                to="/estimator"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-700 font-semibold rounded-2xl hover:bg-brand-50 transition-colors shadow-lg"
              >
                Get Your Estimate
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
