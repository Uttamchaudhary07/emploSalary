import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { markets, market_pay: marketPay } = require("../../../data/hosted-survey.json");
const countries = new Map(Object.keys(markets).map((country) => [country.toLowerCase(), country]));
countries.set("united states", "United States of America");
countries.set("united kingdom", "United Kingdom of Great Britain and Northern Ireland");

const roles = new Map(Object.keys(markets.India.roles).map((role) => [role.toLowerCase(), role]));
roles.set("data scientist", "Data Scientist / ML Specialist");
roles.set("machine learning engineer", "Data Scientist / ML Specialist");

function experienceBand(years) {
  if (years < 2) return "0–1 years";
  if (years < 5) return "2–4 years";
  if (years < 10) return "5–9 years";
  return "10+ years";
}

function findBenchmark(country, role, years) {
  const band = experienceBand(years);
  const local = marketPay.filter((row) => row.country === country);
  return local.find((row) => row.role === role && row.experience === band)
    ?? local.find((row) => row.role === role && row.experience === null)
    ?? local.find((row) => row.role === null)
    ?? null;
}

export default function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ detail: "Use POST for salary estimates." });
  }

  const { country, job_title: jobTitle, years_experience: years } = request.body ?? {};
  const countryName = typeof country === "string" ? countries.get(country.trim().toLowerCase()) : undefined;
  const role = typeof jobTitle === "string" ? roles.get(jobTitle.trim().toLowerCase()) : undefined;
  const market = markets[countryName];
  const estimates = market?.roles[role];

  if (!Number.isInteger(years) || years < 0 || years > 60) {
    return response.status(422).json({ detail: "Enter a whole number of years between 0 and 60." });
  }
  if (!estimates) {
    return response.status(422).json({ detail: "This role and country combination is unavailable in the survey model." });
  }

  const experience = Math.min(years, 51);
  const salary = estimates[experience];
  const comparisonYears = [...new Set([0, 1, 3, 5, 10, 15, 20, experience])].sort((a, b) => a - b);
  return response.status(200).json({
    predicted_salary: salary,
    currency: market.currency,
    model_version: countryName === "India" ? "survey-2024-india" : "survey-2024-international",
    experience_difference: Number((salary - estimates[0]).toFixed(2)),
    experience_estimates: comparisonYears.map((year) => ({ years: year, salary: estimates[year] })),
    role_estimates: Object.entries(market.roles).map(([name, values]) => ({ role: name, salary: values[experience] })),
    benchmark_error: market.benchmark_error,
    market_pay: findBenchmark(countryName, role, experience),
  });
}
