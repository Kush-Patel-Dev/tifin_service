import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import "./styles/global.css";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext";

const root = createRoot(document.getElementById("root"));

function renderApp() {
  try {
    root.render(
      <StrictMode>
        <BrowserRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
      </StrictMode>,
    );
  } catch (err) {
    console.error("App render error:", err);
    renderError(err);
  }
}

function renderError(err) {
  const el = document.getElementById("root");
  if (!el) return;
  el.innerHTML = `
    <div style="font-family:Arial,sans-serif;color:#fff;background:#0f172a;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;">
      <div style="max-width:900px;text-align:left;">
        <h2 style="color:#f59e0b;margin-bottom:8px;">Application Error</h2>
        <p style="color:#e5e7eb;margin-top:0;">An error occurred while loading the application. Open the browser console for details.</p>
        <pre style="background:#071027;color:#fff;padding:12px;border-radius:8px;overflow:auto;max-height:300px;">${String(err)}</pre>
      </div>
    </div>
  `;
}

// Global error handlers to show a readable message instead of a blank page
window.addEventListener("error", (e) => {
  console.error("Unhandled error:", e.error || e.message || e);
  renderError(e.error || e.message || "Unhandled error");
});

window.addEventListener("unhandledrejection", (e) => {
  console.error("Unhandled rejection:", e.reason || e);
  renderError(e.reason || "Unhandled promise rejection");
});

renderApp();
