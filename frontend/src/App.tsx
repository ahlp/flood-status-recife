import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home.js";
import { RSSView } from "./pages/RSSView.js";
import { Dashboard } from "./pages/Dashboard.js";
import { History } from "./pages/History.js";

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rss" element={<RSSView />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/historico" element={<History />} />
        {/* Fallback para qualquer outra rota */}
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};
