import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import {
  Briefcase,
  GraduationCap,
  MapPin,
  Building2,
  Clock,
  Layers,
  Wrench,
  User,
  Users,
  RotateCcw,
  Send,
  ChevronDown,
  X,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  JOB_TITLES,
  EDUCATION_LEVELS,
  LOCATIONS,
  SKILLS,
  COMPANY_SIZES,
  EMPLOYMENT_TYPES,
  INDUSTRIES,
  EXPERIENCE_RANGES,
  AGE_RANGES,
  GENDER_OPTIONS,
} from "@/constants/options";

const formSchema = z.object({
  job_title: z.string().min(1, "Job title is required"),
  years_experience: z.number().min(0, "Experience must be 0 or more"),
  education: z.string().min(1, "Education level is required"),
  location: z.string().min(1, "Location is required"),
  skills: z.array(z.string()).min(1, "Select at least one skill").max(10, "Maximum 10 skills"),
  company_size: z.string().min(1, "Company size is required"),
  employment_type: z.string().min(1, "Employment type is required"),
  industry: z.string().min(1, "Industry is required"),
  age: z.string().optional(),
  gender: z.string().optional(),
});

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};

const FormField = ({ label, icon: Icon, error, children, required = false }) => (
  <div className="space-y-1.5">
    <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
      {Icon && <Icon className="w-3.5 h-3.5 text-slate-400" />}
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {error && (
      <motion.p
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xs text-red-500 mt-1"
      >
        {error.message}
      </motion.p>
    )}
  </div>
);

export default function PredictionForm({ onSubmit, isLoading }) {
  const [skillInput, setSkillInput] = useState("");
  const [filteredSkills, setFilteredSkills] = useState([]);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      job_title: "",
      years_experience: 0,
      education: "",
      location: "",
      skills: [],
      company_size: "",
      employment_type: "full_time",
      industry: "",
      age: "",
      gender: "",
    },
  });

  const selectedSkills = watch("skills") || [];

  const handleSkillInput = (value) => {
    setSkillInput(value);
    if (value.trim()) {
      const filtered = SKILLS.filter(
        (s) =>
          s.toLowerCase().includes(value.toLowerCase()) &&
          !selectedSkills.includes(s)
      ).slice(0, 5);
      setFilteredSkills(filtered);
    } else {
      setFilteredSkills([]);
    }
  };

  const addSkill = (skill) => {
    if (!selectedSkills.includes(skill) && selectedSkills.length < 10) {
      setValue("skills", [...selectedSkills, skill]);
    }
    setSkillInput("");
    setFilteredSkills([]);
  };

  const removeSkill = (skill) => {
    setValue(
      "skills",
      selectedSkills.filter((s) => s !== skill)
    );
  };

  const handleFormSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <motion.form
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-6"
    >
      {/* Required Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Job Title */}
        <motion.div variants={itemVariants}>
          <FormField label="Job Title" icon={Briefcase} error={errors.job_title} required>
            <div className="relative">
              <select
                {...register("job_title")}
                className={cn(
                  "w-full px-4 py-3 bg-white dark:bg-slate-800 border rounded-xl text-sm appearance-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900",
                  errors.job_title
                    ? "border-red-300 focus:border-red-400"
                    : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 focus:border-brand-400"
                )}
              >
                <option value="">Select job title</option>
                {JOB_TITLES.map((title) => (
                  <option key={title} value={title}>
                    {title}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </FormField>
        </motion.div>

        {/* Years of Experience */}
        <motion.div variants={itemVariants}>
          <FormField label="Years of Experience" icon={Clock} error={errors.years_experience} required>
            <div className="relative">
              <select
                {...register("years_experience", { valueAsNumber: true })}
                className={cn(
                  "w-full px-4 py-3 bg-white dark:bg-slate-800 border rounded-xl text-sm appearance-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900",
                  errors.years_experience
                    ? "border-red-300 focus:border-red-400"
                    : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 focus:border-brand-400"
                )}
              >
                <option value="">Select experience</option>
                {EXPERIENCE_RANGES.map((exp) => (
                  <option key={exp.value} value={exp.value}>
                    {exp.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </FormField>
        </motion.div>

        {/* Education */}
        <motion.div variants={itemVariants}>
          <FormField label="Education Level" icon={GraduationCap} error={errors.education} required>
            <div className="relative">
              <select
                {...register("education")}
                className={cn(
                  "w-full px-4 py-3 bg-white dark:bg-slate-800 border rounded-xl text-sm appearance-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900",
                  errors.education
                    ? "border-red-300 focus:border-red-400"
                    : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 focus:border-brand-400"
                )}
              >
                <option value="">Select education</option>
                {EDUCATION_LEVELS.map((edu) => (
                  <option key={edu.value} value={edu.value}>
                    {edu.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </FormField>
        </motion.div>

        {/* Location */}
        <motion.div variants={itemVariants}>
          <FormField label="Location" icon={MapPin} error={errors.location} required>
            <div className="relative">
              <select
                {...register("location")}
                className={cn(
                  "w-full px-4 py-3 bg-white dark:bg-slate-800 border rounded-xl text-sm appearance-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900",
                  errors.location
                    ? "border-red-300 focus:border-red-400"
                    : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 focus:border-brand-400"
                )}
              >
                <option value="">Select location</option>
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </FormField>
        </motion.div>

        {/* Company Size */}
        <motion.div variants={itemVariants}>
          <FormField label="Company Size" icon={Building2} error={errors.company_size} required>
            <div className="relative">
              <select
                {...register("company_size")}
                className={cn(
                  "w-full px-4 py-3 bg-white dark:bg-slate-800 border rounded-xl text-sm appearance-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900",
                  errors.company_size
                    ? "border-red-300 focus:border-red-400"
                    : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 focus:border-brand-400"
                )}
              >
                <option value="">Select company size</option>
                {COMPANY_SIZES.map((size) => (
                  <option key={size.value} value={size.value}>
                    {size.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </FormField>
        </motion.div>

        {/* Employment Type */}
        <motion.div variants={itemVariants}>
          <FormField label="Employment Type" icon={Layers} error={errors.employment_type} required>
            <div className="relative">
              <select
                {...register("employment_type")}
                className={cn(
                  "w-full px-4 py-3 bg-white dark:bg-slate-800 border rounded-xl text-sm appearance-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900",
                  errors.employment_type
                    ? "border-red-300 focus:border-red-400"
                    : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 focus:border-brand-400"
                )}
              >
                <option value="">Select employment type</option>
                {EMPLOYMENT_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </FormField>
        </motion.div>

        {/* Industry */}
        <motion.div variants={itemVariants} className="md:col-span-2">
          <FormField label="Industry" icon={Layers} error={errors.industry} required>
            <div className="relative">
              <select
                {...register("industry")}
                className={cn(
                  "w-full px-4 py-3 bg-white dark:bg-slate-800 border rounded-xl text-sm appearance-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900",
                  errors.industry
                    ? "border-red-300 focus:border-red-400"
                    : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 focus:border-brand-400"
                )}
              >
                <option value="">Select industry</option>
                {INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </FormField>
        </motion.div>

        {/* Skills */}
        <motion.div variants={itemVariants} className="md:col-span-2">
          <FormField label="Skills" icon={Wrench} error={errors.skills} required>
            <div className="relative">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => handleSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && skillInput.trim()) {
                    e.preventDefault();
                    const exact = SKILLS.find(
                      (s) => s.toLowerCase() === skillInput.toLowerCase()
                    );
                    addSkill(exact || skillInput.trim());
                  }
                }}
                placeholder="Type a skill and press Enter (max 10)"
                className={cn(
                  "w-full px-4 py-3 bg-white dark:bg-slate-800 border rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900",
                  errors.skills
                    ? "border-red-300 focus:border-red-400"
                    : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 focus:border-brand-400"
                )}
              />
              {filteredSkills.length > 0 && (
                <div className="absolute z-10 left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg overflow-hidden">
                  {filteredSkills.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => addSkill(skill)}
                      className="w-full px-4 py-2.5 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Selected Skills */}
            {selectedSkills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedSkills.map((skill) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 text-xs font-medium"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-1 hover:text-brand-900 dark:hover:text-brand-100 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </motion.span>
                ))}
              </div>
            )}
          </FormField>
        </motion.div>
      </div>

      {/* Optional Fields */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center gap-2 mb-4">
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Optional</span>
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField label="Age Range" icon={User}>
            <div className="relative">
              <select
                {...register("age")}
                className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm appearance-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900 focus:border-brand-400 hover:border-slate-300 dark:hover:border-slate-600"
              >
                <option value="">Select age range</option>
                {AGE_RANGES.map((age) => (
                  <option key={age.value} value={age.value}>
                    {age.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </FormField>

          <FormField label="Gender" icon={Users}>
            <div className="relative">
              <select
                {...register("gender")}
                className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm appearance-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900 focus:border-brand-400 hover:border-slate-300 dark:hover:border-slate-600"
              >
                <option value="">Select gender</option>
                {GENDER_OPTIONS.map((g) => (
                  <option key={g.value} value={g.value}>
                    {g.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </FormField>
        </div>
      </motion.div>

      {/* Submit Buttons */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 text-white font-semibold rounded-2xl transition-all duration-200 shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:-translate-y-0.5 active:translate-y-0 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
              />
              Processing...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Get Salary Estimate
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => reset()}
          disabled={isLoading}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RotateCcw className="w-4 h-4" />
          Reset Form
        </button>
      </motion.div>
    </motion.form>
  );
}
