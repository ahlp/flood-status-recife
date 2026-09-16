import React from 'react';
import { DecisionResult, CriticalRoad } from '../types/index.js';
import { AlertTriangle, CheckCircle, Waves, CloudRain, MapPin } from 'lucide-react';

interface DecisionDisplayProps {
  decision: DecisionResult;
  userRoad?: CriticalRoad | null;
}

export const DecisionDisplay: React.FC<DecisionDisplayProps> = ({ decision, userRoad }) => {
  const isStayHome = decision.value === 'SIM';

  return (
    <div id="decision-container" className="w-full max-w-2xl mx-auto text-center px-4 py-8 select-none">
      {/* Badge de Horário / Fonte */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-white/20 backdrop-blur-md text-white mb-6 shadow-sm">
        <span>Recife & Região Metropolitana</span>
        <span>•</span>
        <span>Atualizado 05h30</span>
      </div>

      {/* Decision Box Centralizado em 48px+ */}
      <div className="my-6">
        <h1 
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white drop-shadow-md flex items-center justify-center gap-4 animate-fade-in"
          style={{ minHeight: '1.2em' }}
        >
          {isStayHome ? (
            <>
              <AlertTriangle className="w-12 h-12 md:w-16 md:h-16 inline-block text-amber-300 stroke-[2.5]" />
              <span>SIM!</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-12 h-12 md:w-16 md:h-16 inline-block text-emerald-300 stroke-[2.5]" />
              <span>NÃO!</span>
            </>
          )}
        </h1>
        <p className="text-xl sm:text-2xl md:text-3xl font-bold uppercase tracking-wide text-white/90 mt-2">
          {isStayHome ? 'Fica em casa hoje' : 'Pode sair com segurança'}
        </p>
      </div>

      {/* Justificativa Contextual Curta (<= 90 caracteres) */}
      <div className="mt-8 mb-6">
        <p 
          className="text-lg sm:text-xl font-medium text-white/95 max-w-xl mx-auto leading-relaxed px-4 py-2 bg-black/10 rounded-xl backdrop-blur-sm shadow-inner"
          title={decision.justification}
        >
          {decision.justification || 'Justificativa indisponível.'}
        </p>
      </div>

      {/* Fatores Críticos em Destaque */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 max-w-lg mx-auto text-left">
        <div className="bg-white/15 backdrop-blur-md p-3 rounded-xl border border-white/20 text-white">
          <div className="flex items-center gap-1.5 text-xs text-white/80 font-medium mb-1">
            <Waves className="w-3.5 h-3.5" />
            <span>Pico da Maré</span>
          </div>
          <div className="text-lg font-bold">
            {decision.factors?.tide?.peakHeight?.toFixed(1) || '2.2'}m
          </div>
          <div className="text-xs text-white/70">
            às {decision.factors?.tide?.peakTime || '07:30'}
          </div>
        </div>

        <div className="bg-white/15 backdrop-blur-md p-3 rounded-xl border border-white/20 text-white">
          <div className="flex items-center gap-1.5 text-xs text-white/80 font-medium mb-1">
            <CloudRain className="w-3.5 h-3.5" />
            <span>Chuva Matinal</span>
          </div>
          <div className="text-lg font-bold">
            {Math.round((decision.factors?.rainfall?.rainPast6h || 0) + (decision.factors?.rainfall?.rainForecastMorning || 0))}mm
          </div>
          <div className="text-xs text-white/70">
            Probab. {decision.factors?.rainfall?.rainProbability || 60}%
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-white/15 backdrop-blur-md p-3 rounded-xl border border-white/20 text-white">
          <div className="flex items-center gap-1.5 text-xs text-white/80 font-medium mb-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Índice de Risco</span>
          </div>
          <div className="text-lg font-bold">
            {decision.riskScore}%
          </div>
          <div className="text-xs text-white/70">
            Corte: 65%
          </div>
        </div>
      </div>

      {/* Via Crítica Próxima (Se consentido via Geolocalização IP) */}
      {userRoad && (
        <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-black/20 backdrop-blur-md text-white rounded-lg text-sm border border-white/20 animate-fade-in">
          <MapPin className="w-4 h-4 text-amber-300 flex-shrink-0" />
          <span>
            Via crítica próxima: <strong>{userRoad.name}</strong> ({userRoad.neighborhood})
          </span>
        </div>
      )}

      {/* Aviso sutil se for fallback estático */}
      {decision.isFallback && (
        <div className="mt-4 text-xs text-white/70">
          ⚠️ Exibindo dados de contingência estáticos.
        </div>
      )}
    </div>
  );
};
