// Job titles for salary estimation
export const JOB_TITLES = [
  "Software Engineer",
  "Senior Software Engineer",
  "Staff Software Engineer",
  "Principal Engineer",
  "Engineering Manager",
  "Product Manager",
  "Senior Product Manager",
  "Product Director",
  "Data Scientist",
  "Senior Data Scientist",
  "Data Engineer",
  "Machine Learning Engineer",
  "UX Designer",
  "Senior UX Designer",
  "Product Designer",
  "UI Designer",
  "Graphic Designer",
  "Marketing Manager",
  "Digital Marketing Specialist",
  "Content Marketing Manager",
  "Sales Representative",
  "Account Executive",
  "Sales Manager",
  "Business Development Representative",
  "Customer Success Manager",
  "Account Manager",
  "Operations Manager",
  "Project Manager",
  "Program Manager",
  "Scrum Master",
  "HR Manager",
  "Recruiter",
  "Talent Acquisition Specialist",
  "Financial Analyst",
  "Accountant",
  "Controller",
  "CFO",
  "CEO",
  "CTO",
  "COO",
  "VP of Engineering",
  "VP of Product",
  "VP of Sales",
  "DevOps Engineer",
  "Site Reliability Engineer",
  "Cloud Architect",
  "Security Engineer",
  "QA Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Mobile Developer",
  "iOS Developer",
  "Android Developer",
];

// Education levels
export const EDUCATION_LEVELS = [
  { value: "high_school", label: "High School / GED" },
  { value: "associate", label: "Associate Degree" },
  { value: "bachelor", label: "Bachelor's Degree" },
  { value: "master", label: "Master's Degree" },
  { value: "mba", label: "MBA" },
  { value: "phd", label: "PhD / Doctorate" },
  { value: "professional", label: "Professional Degree (MD, JD, etc.)" },
  { value: "bootcamp", label: "Coding Bootcamp / Certificate" },
];

// Locations
export const LOCATIONS = [
  "San Francisco, CA",
  "New York, NY",
  "Los Angeles, CA",
  "Seattle, WA",
  "Austin, TX",
  "Boston, MA",
  "Chicago, IL",
  "Denver, CO",
  "Atlanta, GA",
  "Miami, FL",
  "Portland, OR",
  "San Diego, CA",
  "Dallas, TX",
  "Washington, DC",
  "Remote",
  "London, UK",
  "Berlin, Germany",
  "Toronto, Canada",
  "Singapore",
  "Sydney, Australia",
  "Amsterdam, Netherlands",
  "Paris, France",
  "Dublin, Ireland",
  "Zurich, Switzerland",
  "Bangalore, India",
  "Tokyo, Japan",
];

// Skills
export const SKILLS = [
  "JavaScript",
  "Python",
  "Java",
  "C++",
  "C#",
  "Go",
  "Rust",
  "TypeScript",
  "React",
  "Vue",
  "Angular",
  "Node.js",
  "AWS",
  "Azure",
  "GCP",
  "Docker",
  "Kubernetes",
  "Machine Learning",
  "SQL",
  "NoSQL",
  "GraphQL",
  "REST APIs",
  "Microservices",
  "CI/CD",
  "Terraform",
  "Linux",
  "Data Analysis",
  "TensorFlow",
  "PyTorch",
  "NLP",
  "Computer Vision",
  "Product Strategy",
  "User Research",
  "Agile",
  "Scrum",
  "Leadership",
  "Communication",
  "Project Management",
  "Data Visualization",
  "Tableau",
  "Power BI",
  "Excel",
  "Figma",
  "Sketch",
  "Adobe Creative Suite",
  "SEO",
  "Content Marketing",
  "Social Media",
  "Salesforce",
  "HubSpot",
  "CRM",
  "Negotiation",
  "Financial Modeling",
  "Accounting",
  "Risk Management",
];

// Company sizes
export const COMPANY_SIZES = [
  { value: "startup", label: "Startup (1-50 employees)" },
  { value: "small", label: "Small (51-200 employees)" },
  { value: "medium", label: "Medium (201-1000 employees)" },
  { value: "large", label: "Large (1001-10000 employees)" },
  { value: "enterprise", label: "Enterprise (10000+ employees)" },
];

// Employment types
export const EMPLOYMENT_TYPES = [
  { value: "full_time", label: "Full-Time" },
  { value: "part_time", label: "Part-Time" },
  { value: "contract", label: "Contract" },
  { value: "freelance", label: "Freelance" },
  { value: "internship", label: "Internship" },
];

// Industries
export const INDUSTRIES = [
  "Technology / Software",
  "Finance / Banking",
  "Healthcare / Biotech",
  "E-commerce / Retail",
  "Consulting",
  "Manufacturing",
  "Education",
  "Media / Entertainment",
  "Real Estate",
  "Transportation / Logistics",
  "Energy / Utilities",
  "Government / Public Sector",
  "Non-profit",
  "Telecommunications",
  "Hospitality / Travel",
  "Agriculture",
  "Construction",
  "Legal",
  "Marketing / Advertising",
  "Gaming",
];

// Experience ranges
export const EXPERIENCE_RANGES = [
  { value: 0, label: "0 years (Entry Level)" },
  { value: 1, label: "1 year" },
  { value: 2, label: "2 years" },
  { value: 3, label: "3 years" },
  { value: 4, label: "4 years" },
  { value: 5, label: "5 years" },
  { value: 6, label: "6 years" },
  { value: 7, label: "7 years" },
  { value: 8, label: "8 years" },
  { value: 9, label: "9 years" },
  { value: 10, label: "10 years" },
  { value: 12, label: "12 years" },
  { value: 15, label: "15 years" },
  { value: 20, label: "20+ years" },
  { value: 25, label: "25+ years" },
  { value: 30, label: "30+ years" },
];

// Age ranges
export const AGE_RANGES = [
  { value: "18-24", label: "18-24" },
  { value: "25-34", label: "25-34" },
  { value: "35-44", label: "35-44" },
  { value: "45-54", label: "45-54" },
  { value: "55-64", label: "55-64" },
  { value: "65+", label: "65+" },
];

// Gender options
export const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "non_binary", label: "Non-Binary" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
];

// API endpoints
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// Navigation links
export const NAV_LINKS = [
  { name: "Home", path: "/" },
  { name: "Features", path: "/features" },
  { name: "Estimator", path: "/estimator" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

// Social links
export const SOCIAL_LINKS = [
  { name: "GitHub", href: "https://github.com/Uttamchaudhary07", icon: "Github" },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/uttamchaudhary07/", icon: "Linkedin" },
  { name: "Email", href: "mailto:uttamchaudhary020@gmail.com", icon: "Mail" },
];

// Feature cards data
export const FEATURES = [
  {
    title: "AI-Powered Predictions",
    description:
      "Our machine learning model analyzes thousands of data points to deliver accurate salary estimates tailored to your profile.",
    icon: "Brain",
    color: "from-violet-500 to-purple-600",
  },
  {
    title: "Real-Time Market Data",
    description:
      "Access up-to-date salary information from companies across the globe, refreshed weekly with the latest market trends.",
    icon: "TrendingUp",
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Location Intelligence",
    description:
      "Get location-adjusted estimates that account for cost of living, local demand, and regional market conditions.",
    icon: "MapPin",
    color: "from-emerald-500 to-teal-500",
  },
  {
    title: "Skill-Based Analysis",
    description:
      "See how your specific skills impact your earning potential with detailed skill premium breakdowns.",
    icon: "Zap",
    color: "from-amber-500 to-orange-500",
  },
  {
    title: "Career Path Insights",
    description:
      "Explore how your salary could grow with different career paths, promotions, and skill development.",
    icon: "Route",
    color: "from-rose-500 to-pink-500",
  },
  {
    title: "Industry Benchmarks",
    description:
      "Compare your estimated salary against industry standards and see where you stand in the market.",
    icon: "BarChart3",
    color: "from-indigo-500 to-blue-600",
  },
];

// Testimonials
export const TESTIMONIALS = [
  {
    name: "Sarah Chen",
    role: "Senior Product Manager",
    company: "TechCorp",
    content:
      "This tool gave me the confidence to negotiate a 25% raise. The prediction was spot-on with my final offer!",
    avatar: "SC",
    rating: 5,
  },
  {
    name: "Michael Rodriguez",
    role: "Software Engineer",
    company: "StartupXYZ",
    content:
      "Incredibly accurate estimates. I used this before my interview and knew exactly what to ask for.",
    avatar: "MR",
    rating: 5,
  },
  {
    name: "Emily Watson",
    role: "Data Scientist",
    company: "DataDriven Inc",
    content:
      "The skill-based analysis helped me identify which technologies to learn to maximize my earning potential.",
    avatar: "EW",
    rating: 5,
  },
  {
    name: "James Park",
    role: "UX Designer",
    company: "Creative Studio",
    content:
      "Clean interface, fast results, and surprisingly accurate. My go-to tool before any salary discussion.",
    avatar: "JP",
    rating: 5,
  },
  {
    name: "Lisa Thompson",
    role: "Engineering Manager",
    company: "GlobalTech",
    content:
      "I recommend this to all my team members. It helps them understand their market value objectively.",
    avatar: "LT",
    rating: 5,
  },
  {
    name: "David Kim",
    role: "DevOps Engineer",
    company: "CloudFirst",
    content:
      "The location adjustment feature is brilliant. It perfectly accounted for my move from SF to Austin.",
    avatar: "DK",
    rating: 5,
  },
];

// FAQ data
export const FAQ_DATA = [
  {
    question: "How accurate are the salary predictions?",
    answer:
      "Our predictions are based on a machine learning model trained on over 500,000 real salary data points. On average, our estimates are within 8-12% of actual salaries. Accuracy improves when you provide more detailed information about your skills and experience.",
  },
  {
    question: "Where does the salary data come from?",
    answer:
      "We aggregate data from multiple sources including job postings, salary surveys, government data, and user-contributed information. All data is anonymized and updated weekly to ensure accuracy.",
  },
  {
    question: "Is my personal information kept private?",
    answer:
      "Absolutely. We take privacy seriously. Your personal information is never shared with third parties. We only use the data you provide to generate your salary estimate and improve our models.",
  },
  {
    question: "Can I use this for negotiation purposes?",
    answer:
      "Yes! Many of our users successfully use our estimates as a benchmark during salary negotiations. We recommend also researching the specific company and role for additional context.",
  },
  {
    question: "How often is the data updated?",
    answer:
      "Our salary data is refreshed weekly with the latest market information. Major updates to the model are released monthly to incorporate new trends and patterns.",
  },
  {
    question: "Does this work for all countries?",
    answer:
      "Currently, our model provides the most accurate predictions for the US, Canada, UK, and major European tech hubs. We're continuously expanding our coverage to more regions.",
  },
  {
    question: "What's the difference between base salary and total compensation?",
    answer:
      "Base salary is your fixed annual pay. Total compensation includes base salary plus bonuses, stock options, benefits, and other perks. Our detailed breakdown shows all components when data is available.",
  },
  {
    question: "Can I compare multiple roles or locations?",
    answer:
      "Yes! You can run multiple estimates with different parameters to compare how factors like location, company size, and skills affect your potential salary.",
  },
];

// Statistics for the landing page
export const STATS = [
  { label: "Salary Estimates", value: 500000, suffix: "+" },
  { label: "Data Points", value: 2.5, suffix: "M+", decimals: 1 },
  { label: "Accuracy Rate", value: 92, suffix: "%" },
  { label: "Cities Covered", value: 150, suffix: "+" },
];

// Chart colors
export const CHART_COLORS = {
  primary: "#3b82f6",
  secondary: "#8b5cf6",
  accent: "#06b6d4",
  success: "#22c55e",
  warning: "#f59e0b",
  danger: "#ef4444",
  purple: "#a855f7",
  pink: "#ec4899",
  teal: "#14b8a6",
  orange: "#f97316",
};
