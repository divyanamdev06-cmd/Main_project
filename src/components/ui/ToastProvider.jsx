import { createContext, useCallback, useContext, useMemo, useState } from "react";

const ToastContext = createContext(null);

function Toast({ toast, onClose }) {
  const base =
    "w-full max-w-sm rounded-xl border shadow-lg px-4 py-3 bg-white text-gray-900";
  const border =
    toast.type === "success"
      ? "border-green-200"
      : toast.type === "error"
        ? "border-red-200"
        : "border-gray-200";
  const titleColor =
    toast.type === "success"
      ? "text-green-700"
      : toast.type === "error"
        ? "text-red-700"
        : "text-gray-700";

  return (
    <div className={`${base} ${border}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {toast.title ? (
            <div className={`text-sm font-semibold ${titleColor}`}>
              {toast.title}
            </div>
          ) : null}
          <div className="text-sm text-gray-700 break-words">{toast.message}</div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 text-gray-500 hover:text-gray-900"
          aria-label="Close"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ type = "info", title = "", message = "", durationMs = 3500 }) => {
      const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const next = { id, type, title, message };
      setToasts((prev) => [next, ...prev].slice(0, 3));
      window.setTimeout(() => remove(id), durationMs);
      return id;
    },
    [remove]
  );

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed top-4 right-4 left-4 sm:left-auto z-50 flex flex-col gap-3 items-end">
        {toasts.map((t) => (
          <Toast key={t.id} toast={t} onClose={() => remove(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

