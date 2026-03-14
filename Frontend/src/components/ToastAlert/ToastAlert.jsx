import { useEffect, useState } from "react";
import "../../styles/toast.css";

const ToastAlert = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handler = (e) => {
      const { type, message } = e.detail || {};
      const id = Date.now() + Math.random();
      const toast = {
        id,
        type: type || "info",
        message: message || "",
        leaving: false,
      };
      setToasts((t) => [toast, ...t]);

      // Start fade-out shortly before removal
      const D = 3000;
      setTimeout(() => {
        setToasts((current) =>
          current.map((it) => (it.id === id ? { ...it, leaving: true } : it)),
        );
      }, D - 500);

      // Remove after animation
      setTimeout(() => {
        setToasts((current) => current.filter((it) => it.id !== id));
      }, D);
    };

    window.addEventListener("tifin-toast", handler);
    return () => window.removeEventListener("tifin-toast", handler);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`toast ${t.type === "success" ? "toast-success" : "toast-error"} ${t.leaving ? "toast-leaving" : ""}`}
          role="status"
        >
          <div className="toast-message">{t.message}</div>
        </div>
      ))}
    </div>
  );
};

export default ToastAlert;
