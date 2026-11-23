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
    const region = data.location.split(",").pop().trim();
    const usState = /^(AZ|CA|CO|DC|FL|GA|IL|MA|NY|OR|TX|WA)$/;
    const country = usState.test(region) ? "United States" : region === "UK" ? "United Kingdom" : region;
    const response = await apiClient.post("/api/v1/salary/predict", {
      job_title: data.job_title,
      years_experience: data.years_experience,
      country,
    }, {
      baseURL: ["localhost", "127.0.0.1", "[::1]"].includes(window.location.hostname) ? API_BASE_URL : "",
    });
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
