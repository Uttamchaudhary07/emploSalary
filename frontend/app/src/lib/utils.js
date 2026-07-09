import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}

// Indian salaries are conventionally expressed in Lakhs (1,00,000) and
// Crores (1,00,00,000) rather than raw thousands, e.g. "₹12.5L" not "₹1,250k".
export function formatCurrencyCompact(value) {
  const amount = value ?? 0;
  if (Math.abs(amount) >= 1_00_00_000) {
    return `₹${(amount / 1_00_00_000).toFixed(2)}Cr`;
  }
  if (Math.abs(amount) >= 1_00_000) {
    return `₹${(amount / 1_00_000).toFixed(1)}L`;
  }
  return formatCurrency(amount);
}

export function formatNumber(value) {
  return new Intl.NumberFormat("en-IN").format(value);
}

export function formatPercentage(value) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
}

export function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

export function generateId(prefix = "id") {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function debounce(fn, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export function throttle(fn, limit) {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export function isInViewport(element, offset = 0) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= -offset &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offset &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

export function getInitials(name) {
  if (!name) return "";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function kebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
}
