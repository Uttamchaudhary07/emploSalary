import axios from "axios";
import { API_BASE_URL } from "@/constants/options";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle different error types
    if (error.code === "ECONNABORTED") {
      return Promise.reject({
        type: "TIMEOUT",
        message: "Request timed out. Please try again.",
      });
    }

    if (!error.response) {
      return Promise.reject({
        type: "NETWORK",
        message: "Network error. Please check your connection.",
      });
    }

    const { status, data } = error.response;

    switch (status) {
      case 400:
        return Promise.reject({
          type: "VALIDATION",
          message: data.detail || "Invalid request. Please check your input.",
          errors: data.errors || {},
        });
      case 401:
        return Promise.reject({
          type: "AUTH",
          message: "Authentication required. Please log in.",
        });
      case 403:
        return Promise.reject({
          type: "FORBIDDEN",
          message: "You don't have permission to perform this action.",
        });
      case 404:
        return Promise.reject({
          type: "NOT_FOUND",
          message: "The requested resource was not found.",
        });
      case 422: {
        const fieldErrors = Array.isArray(data.errors) ? data.errors : [];
        const firstFieldMessage = fieldErrors[0]?.msg?.replace(/^Value error,\s*/, "");
        return Promise.reject({
          type: "VALIDATION",
          message: firstFieldMessage || data.detail || "Validation error. Please check your input.",
          errors: fieldErrors,
        });
      }
      case 429:
        return Promise.reject({
          type: "RATE_LIMIT",
          message: "Too many requests. Please try again later.",
        });
      case 500:
      case 502:
      case 503:
      case 504:
        return Promise.reject({
          type: "SERVER",
          message: "Server error. Please try again later.",
        });
      default:
        return Promise.reject({
          type: "UNKNOWN",
          message: data.detail || "An unexpected error occurred.",
        });
    }
  }
);

// Salary estimation API
export const salaryApi = {
  // Predict salary based on form data
  predict: async (data) => {
    const response = await apiClient.post("/api/v1/salary/predict", data);
    return response.data;
  },

  // Get salary breakdown by factors
  getBreakdown: async (data) => {
    const response = await apiClient.post("/api/v1/salary/breakdown", data);
    return response.data;
  },

  // Get market trends
  getMarketTrends: async (params) => {
    const response = await apiClient.get("/api/v1/salary/trends", { params });
    return response.data;
  },

  // Get salary comparison
  getComparison: async (data) => {
    const response = await apiClient.post("/api/v1/salary/compare", data);
    return response.data;
  },

  // Get available options (job titles, locations, etc.)
  getOptions: async () => {
    const response = await apiClient.get("/api/v1/salary/options");
    return response.data;
  },
};

// Statistics API
export const statsApi = {
  // Get global statistics
  getGlobalStats: async () => {
    const response = await apiClient.get("/api/v1/stats/global");
    return response.data;
  },

  // Get industry statistics
  getIndustryStats: async (industry) => {
    const response = await apiClient.get(`/api/v1/stats/industry/${industry}`);
    return response.data;
  },

  // Get location statistics
  getLocationStats: async (location) => {
    const response = await apiClient.get(`/api/v1/stats/location/${encodeURIComponent(location)}`);
    return response.data;
  },
};

// Contact API
export const contactApi = {
  // Send contact form
  sendMessage: async (data) => {
    const response = await apiClient.post("/api/v1/contact", data);
    return response.data;
  },
};

// Health check
export const healthApi = {
  check: async () => {
    const response = await apiClient.get("/health");
    return response.data;
  },
};

// Mock API responses for development/demo
export const mockApi = {
  predict: async (data) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Generate realistic mock salary (annual, INR) based on input
    const baseSalaries = {
      "Software Engineer": 900000,
      "Senior Software Engineer": 1800000,
      "Staff Software Engineer": 3000000,
      "Principal Engineer": 4500000,
      "Engineering Manager": 3200000,
      "Product Manager": 2200000,
      "Senior Product Manager": 3500000,
      "Data Scientist": 1600000,
      "UX Designer": 1000000,
      "Marketing Manager": 1200000,
      "Sales Manager": 1100000,
      "HR Manager": 900000,
      "Financial Analyst": 700000,
      "DevOps Engineer": 1400000,
      "Full Stack Developer": 1200000,
    };

    const jobTitle = data.job_title || "Software Engineer";
    const baseSalary = baseSalaries[jobTitle] || 850000;

    // Adjust for experience
    const expMultiplier = 1 + (data.years_experience || 0) * 0.05;

    // Adjust for education
    const eduMultipliers = {
      high_school: 0.85,
      associate: 0.9,
      bachelor: 1.0,
      master: 1.12,
      mba: 1.18,
      phd: 1.2,
      professional: 1.25,
      bootcamp: 0.95,
    };
    const eduMultiplier = eduMultipliers[data.education] || 1.0;

    // Adjust for location
    const locationMultipliers = {
      "San Francisco, CA": 1.45,
      "New York, NY": 1.38,
      "Seattle, WA": 1.35,
      "Los Angeles, CA": 1.25,
      "Boston, MA": 1.28,
      "Austin, TX": 1.15,
      "Bangalore, India": 1.1,
      "Remote": 1.05,
      "London, UK": 0.95,
      "Toronto, Canada": 0.82,
    };
    const locMultiplier = locationMultipliers[data.location] || 1.0;

    // Adjust for company size
    const sizeMultipliers = {
      startup: 0.95,
      small: 0.92,
      medium: 1.0,
      large: 1.08,
      enterprise: 1.15,
    };
    const sizeMultiplier = sizeMultipliers[data.company_size] || 1.0;

    // Adjust for skills
    const skillPremium = (data.skills?.length || 0) * 0.02;

    const predictedSalary = Math.round(
      baseSalary * expMultiplier * eduMultiplier * locMultiplier * sizeMultiplier * (1 + skillPremium)
    );

    const salaryRange = {
      low: Math.round(predictedSalary * 0.85),
      mid: predictedSalary,
      high: Math.round(predictedSalary * 1.2),
    };

    return {
      predicted_salary: predictedSalary,
      salary_range: salaryRange,
      confidence: 0.87,
      currency: "INR",
      breakdown: {
        base_salary: predictedSalary,
        bonus: Math.round(predictedSalary * 0.1),
        equity: Math.round(predictedSalary * 0.05),
        benefits_value: Math.round(predictedSalary * 0.15),
      },
      factors: [
        { factor: "Job Title", impact: "High", contribution: Math.round(baseSalary * 0.4) },
        { factor: "Experience", impact: "High", contribution: Math.round(predictedSalary * 0.25) },
        { factor: "Location", impact: "Medium", contribution: Math.round(predictedSalary * 0.2) },
        { factor: "Education", impact: "Medium", contribution: Math.round(predictedSalary * 0.1) },
        { factor: "Skills", impact: "Low", contribution: Math.round(predictedSalary * 0.05) },
      ],
      similar_roles: [
        { title: `${jobTitle} I`, salary: Math.round(predictedSalary * 0.75) },
        { title: `${jobTitle} II`, salary: Math.round(predictedSalary * 0.9) },
        { title: `Senior ${jobTitle}`, salary: Math.round(predictedSalary * 1.2) },
        { title: `Lead ${jobTitle}`, salary: Math.round(predictedSalary * 1.35) },
      ],
      market_trend: {
        direction: "up",
        percentage: 4.2,
      },
      metadata: {
        model_version: "2.1.0",
        prediction_date: new Date().toISOString(),
        data_freshness: "2024-12",
      },
    };
  },

  getMarketTrends: async () => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return {
      trends: [
        { month: "Jan 2024", avg_salary: 1180000 },
        { month: "Feb 2024", avg_salary: 1195000 },
        { month: "Mar 2024", avg_salary: 1200000 },
        { month: "Apr 2024", avg_salary: 1210000 },
        { month: "May 2024", avg_salary: 1225000 },
        { month: "Jun 2024", avg_salary: 1240000 },
        { month: "Jul 2024", avg_salary: 1250000 },
        { month: "Aug 2024", avg_salary: 1265000 },
        { month: "Sep 2024", avg_salary: 1270000 },
        { month: "Oct 2024", avg_salary: 1285000 },
        { month: "Nov 2024", avg_salary: 1300000 },
        { month: "Dec 2024", avg_salary: 1310000 },
      ],
    };
  },

  getGlobalStats: async () => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return {
      total_estimates: 524891,
      avg_salary: 1285000,
      median_salary: 1150000,
      top_paying_role: "Principal Engineer",
      top_paying_location: "Bengaluru, India",
      salary_growth_yoy: 4.2,
    };
  },
};

export default apiClient;
