import React from 'react';
import { RefreshCw } from 'lucide-react';

interface ErrorFallbackProps {
  onRetry?: () => void;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({ onRetry }) => {
  const handleReload = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <main 
      className="min-h-screen w-full flex items-center justify-center p-4 bg-[#f5f5f5] text-slate-800"
      role="main"
    >
      <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-sm border border-slate-200 text-center">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 tracking-tight">
          Informação Indisponível
        </h1>

        <p 
          className="text-base sm:text-lg text-slate-700 leading-relaxed mb-8"
          aria-live="polite"
        >
          Não foi possível obter dados hoje. Por favor, tente novamente amanhã.
        </p>

        <button
          onClick={handleReload}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-900 active:bg-black text-white font-semibold text-base rounded-xl shadow transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-slate-950"
        >
          <RefreshCw className="w-5 h-5" />
          <span>Tentar Novamente</span>
        </button>
      </div>
    </main>
  );
};
