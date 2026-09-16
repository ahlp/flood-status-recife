import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import { Download, Loader2, AlertCircle } from 'lucide-react';

export const PrintButton: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const captureAndDownload = async () => {
    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const container = document.getElementById('decision-container') || document.body;

      // Executa html2canvas com escala 1.5 para alta qualidade (US-1 / RF-09)
      const canvas = await html2canvas(container, {
        scale: 1.5,
        useCORS: true,
        backgroundColor: null,
        logging: false
      });

      // Formata data DDMMYYYY (ex.: decisao-recife-16092026.png)
      const now = new Date();
      const dd = String(now.getDate()).padStart(2, '0');
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const yyyy = now.getFullYear();
      const fileName = `decisao-recife-${dd}${mm}${yyyy}.png`;

      // Cria link de download
      const imageUri = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imageUri;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('[FEH] Erro ao capturar imagem com html2canvas:', error);
      setErrorMessage('Não foi possível gerar imagem. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <button
        onClick={captureAndDownload}
        disabled={isGenerating}
        aria-label="Baixar imagem da decisão"
        className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 active:bg-white/40 backdrop-blur-md text-white font-semibold text-sm rounded-full shadow-lg border border-white/30 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-white"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Gerando...</span>
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            <span>Salvar PNG</span>
          </>
        )}
      </button>

      {/* Modal de erro se falhar (US-2) */}
      {errorMessage && (
        <div 
          role="alert" 
          aria-live="assertive"
          className="fixed bottom-16 right-6 max-w-sm bg-red-600 text-white p-3 rounded-lg shadow-xl flex items-center gap-2 text-sm border border-red-400 animate-bounce"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMessage}</span>
          <button 
            onClick={() => setErrorMessage(null)} 
            className="ml-auto font-bold px-1 hover:text-red-200"
            aria-label="Fechar mensagem de erro"
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
};
