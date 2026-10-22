import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App.js";
import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Registra o service worker para suporte PWA offline
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch((error) => {
      console.warn("[FEH] Falha ao registrar service worker:", error);
    });
  });
}
