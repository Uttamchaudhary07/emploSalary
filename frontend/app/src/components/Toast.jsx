import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, XCircle, Info, X } from "lucide-react";

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const styles = {
  success: "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-300",
  error: "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300",
  warning: "bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-300",
  info: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300",
};

const iconColors = {
  success: "text-emerald-500",
  error: "text-red-500",
  warning: "text-amber-500",
  info: "text-blue-500",
};

export default function Toast({ toasts, removeToast }) {
  return (
    <div className="fixed top-20 right-4 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const Icon = icons[toast.type] || Info;
          const styleClass = styles[toast.type] || styles.info;
          const iconColor = iconColors[toast.type] || iconColors.info;

          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg ${styleClass}`}
            >
              <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${iconColor}`} />
              <div className="flex-1 min-w-0">
                {toast.title && (
                  <p className="font-semibold text-sm">{toast.title}</p>
                )}
                {toast.message && (
                  <p className="text-sm mt-0.5 opacity-90">{toast.message}</p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

// Hook for managing toasts
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { id, duration: 5000, ...toast };
    setToasts((prev) => [...prev, newToast]);

    if (newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
}
