import React, { useEffect, useState, useCallback } from 'react';
import { fetchDecision, fetchLocationInfo } from '../services/api.js';
import { DecisionResult, CriticalRoad } from '../types/index.js';
import { DecisionDisplay } from '../components/DecisionDisplay.js';
import { PrintButton } from '../components/PrintButton.js';
import { RssIcon } from '../components/RssIcon.js';
import { GeoConsentModal, checkGeoConsent } from '../components/GeoConsentModal.js';
import { ErrorFallback } from '../components/ErrorFallback.js';
import { ShieldAlert, BarChart3, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Home: React.FC = () => {
  const [decision, setDecision] = useState<DecisionResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showGeoModal, setShowGeoModal] = useState(false);
  const [userRoad, setUserRoad] = useState<CriticalRoad | null>(null);

  const loadDecision = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await fetchDecision();
      setDecision(data);

      // Atualiza classe do body para o tema reativo correspondente (RF-06 / US-03)
      if (data.value === 'SIM') {
        document.body.className = 'theme-alert bg-brand-alert min-h-screen font-sans text-white transition-colors duration-300';
      } else {
        document.body.className = 'theme-neutral bg-brand-blue min-h-screen font-sans text-white transition-colors duration-300';
      }
    } catch {
      setError(true);
      document.body.className = 'theme-fallback bg-brand-gray-light min-h-screen font-sans text-slate-800 transition-colors duration-300';
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDecision();

    // Verifica consentimento prévio de geolocalização IP
    const consent = checkGeoConsent();
    if (!consent.asked) {
      // Abre modal se ainda não foi solicitado
      const timer = setTimeout(() => setShowGeoModal(true), 1200);
      return () => clearTimeout(timer);
    } else if (consent.consent) {
      fetchLocationInfo().then((info) => {
        if (info.nearestCriticalRoad) {
          setUserRoad(info.nearestCriticalRoad as CriticalRoad);
        }
      });
    }
  }, [loadDecision]);

  const handleGeoConsent = async (agreed: boolean) => {
    setShowGeoModal(false);
    if (agreed) {
      const info = await fetchLocationInfo();
      if (info.nearestCriticalRoad) {
        setUserRoad(info.nearestCriticalRoad as CriticalRoad);
      }
    }
  };

  if (error) {
    return <ErrorFallback onRetry={loadDecision} />;
  }

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-brand-blue text-white">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <p className="text-xl font-bold tracking-wide">Avaliando condições do Recife...</p>
        <span className="text-xs text-white/70 mt-2">Consultando maré, chuva e rios</span>
      </main>
    );
  }

  if (!decision) {
    return <ErrorFallback onRetry={loadDecision} />;
  }

  return (
    <main 
      className="min-h-screen flex flex-col justify-between p-4 sm:p-6 md:p-8 relative overflow-hidden"
      role="main"
    >
      {/* Header Minimalista */}
      <header className="w-full max-w-5xl mx-auto flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-lg shadow-sm">
            🌊
          </div>
          <div>
            <h2 className="text-base font-black tracking-tight leading-none text-white">
              Fico em Casa Hoje?
            </h2>
            <span className="text-[10px] uppercase font-bold tracking-widest text-white/70">
              Flood Status Recife
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <RssIcon />
          <Link
            to="/dashboard"
            title="Dashboard Interno de Métricas"
            aria-label="Acessar Dashboard"
            className="p-2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white rounded-full transition-all focus-visible:ring-2 focus-visible:ring-white"
          >
            <BarChart3 className="w-5 h-5" />
          </Link>
        </div>
      </header>

      {/* Conteúdo Central: Decisão em 48px+ */}
      <div className="flex-1 flex items-center justify-center my-auto z-10">
        <DecisionDisplay decision={decision} userRoad={userRoad} />
      </div>

      {/* Footer com Botão de Exportação e Links */}
      <footer className="w-full max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/20 z-10 text-xs text-white/80">
        <div className="flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 opacity-80" />
          <span>Baseado em dados abertos: Open-Meteo, Marinha do Brasil e CEMADEN.</span>
        </div>

        <div className="flex items-center gap-4">
          <PrintButton />
        </div>
      </footer>

      {/* Modal de Consentimento de IP */}
      <GeoConsentModal 
        isOpen={showGeoModal} 
        onConsent={handleGeoConsent} 
      />
    </main>
  );
};
