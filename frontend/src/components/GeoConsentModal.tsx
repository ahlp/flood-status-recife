import React, { useEffect, useRef } from 'react';
import { MapPin, X } from 'lucide-react';

interface GeoConsentModalProps {
  isOpen: boolean;
  onConsent: (agreed: boolean) => void;
}

const STORAGE_KEY = 'feh_geo_consent';
const EXPIRY_DAYS = 30;

export function checkGeoConsent(): { asked: boolean; consent: boolean } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { asked: false, consent: false };

    const parsed = JSON.parse(raw);
    if (parsed.expiresAt && Date.now() < parsed.expiresAt) {
      return { asked: true, consent: !!parsed.consent };
    }
    localStorage.removeItem(STORAGE_KEY);
    return { asked: false, consent: false };
  } catch {
    return { asked: false, consent: false };
  }
}

export function saveGeoConsent(consent: boolean): void {
  try {
    const data = {
      consent,
      expiresAt: Date.now() + EXPIRY_DAYS * 24 * 60 * 60 * 1000
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Silently ignore storage errors
  }
}

export const GeoConsentModal: React.FC<GeoConsentModalProps> = ({ isOpen, onConsent }) => {
  const confirmBtnRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Foco automático no botão principal "Sim" (US-1 / US-4)
    confirmBtnRef.current?.focus();

    // Bloqueia rolagem do body enquanto modal aberto (US-4)
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Gerenciador da tecla ESC
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleChoice(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChoice = (agreed: boolean) => {
    saveGeoConsent(agreed);
    onConsent(agreed);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="geo-modal-title"
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-100 text-slate-800 text-left relative transform transition-all"
      >
        <button
          onClick={() => handleChoice(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center flex-shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h2 id="geo-modal-title" className="text-lg font-bold text-slate-900 leading-tight">
              Personalizar Alerta
            </h2>
            <p className="text-xs text-slate-500">Localização aproximada via IP</p>
          </div>
        </div>

        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          Deseja que exibamos vias críticas próximas com risco de alagamento com base na sua localização aproximada?
        </p>

        <div className="flex gap-3 justify-end">
          <button
            onClick={() => handleChoice(false)}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Não
          </button>
          <button
            ref={confirmBtnRef}
            onClick={() => handleChoice(true)}
            className="px-5 py-2 text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 active:bg-sky-800 rounded-lg shadow-md transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-sky-500"
          >
            Sim, localizar
          </button>
        </div>
      </div>
    </div>
  );
};
