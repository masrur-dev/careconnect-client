"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Check, Info, TriangleAlert, X } from "lucide-react";

const ToastContext = createContext(null);

const toastStyles = {
  info: { className: "alert-info", Icon: Info },
  success: { className: "alert-success", Icon: Check },
  error: { className: "alert-error", Icon: TriangleAlert },
  warning: { className: "alert-warning", Icon: TriangleAlert },
};

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }

  return context;
}

export default function ToastProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const nextId = useRef(0);
  const timers = useRef(new Map());

  const dismiss = useCallback((id) => {
    const timer = timers.current.get(id);
    if (timer) clearTimeout(timer);
    timers.current.delete(id);
    setNotifications((current) => current.filter((item) => item.id !== id));
  }, []);

  const notify = useCallback((type, message) => {
    const id = ++nextId.current;
    setNotifications((current) => [...current, { id, type, message }]);
    timers.current.set(id, setTimeout(() => dismiss(id), 4200));
    return id;
  }, [dismiss]);

  useEffect(() => () => {
    timers.current.forEach(clearTimeout);
    timers.current.clear();
  }, []);

  const toast = useMemo(() => ({
    info: (message) => notify("info", message),
    success: (message) => notify("success", message),
    error: (message) => notify("error", message),
    warning: (message) => notify("warning", message),
  }), [notify]);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toast toast-end toast-bottom z-[100]" aria-live="polite" aria-label="Notifications">
        {notifications.map(({ id, type, message }) => {
          const { className, Icon } = toastStyles[type] || toastStyles.info;

          return (
            <div key={id} role={type === "error" ? "alert" : "status"} className={`alert ${className} toast-enter shadow-lg`}>
              <Icon size={18} aria-hidden="true" />
              <span>{message}</span>
              <button type="button" className="btn btn-ghost btn-xs btn-circle ml-auto" onClick={() => dismiss(id)} aria-label="Dismiss notification">
                <X size={15} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
