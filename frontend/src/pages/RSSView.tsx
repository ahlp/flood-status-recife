import React, { useEffect, useState } from "react";
import { fetchLatestRss, downloadRssXml } from "../services/api.js";
import { RSSFeedItem } from "../types/index.js";
import { Rss, Download, ExternalLink, ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { formatSnippet } from "../utils/rssSnippet.js";

export const RSSView: React.FC = () => {
  const [item, setItem] = useState<RSSFeedItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.className = "bg-white font-sans text-slate-900 min-h-screen";
    fetchLatestRss().then((data) => {
      setItem(data);
      setLoading(false);
    });
  }, []);

  const truncatedTitle =
    item?.title && item.title.length > 100
      ? item.title.substring(0, 97) + "..."
      : item?.title || "";

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-between p-4 sm:p-8">
      {/* Header */}
      <header
        role="banner"
        className="w-full max-w-3xl mx-auto flex items-center justify-between pb-6 border-b border-slate-200"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 flex items-center justify-center text-slate-900"
            aria-hidden="true"
          >
            <Rss className="w-8 h-8" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Feed RSS — Fico em Casa Hoje?
          </h1>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors p-2 rounded-lg hover:bg-slate-100"
          aria-label="Voltar para a página principal"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar</span>
        </Link>
      </header>

      {/* Conteúdo Principal */}
      <main role="main" className="w-full max-w-3xl mx-auto my-auto py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin mb-2" />
            <p>Carregando último item do feed...</p>
          </div>
        ) : item ? (
          <article className="space-y-6">
            <div className="text-xs font-semibold uppercase tracking-wider text-sky-600">
              Última Publicação •{" "}
              {item.pubDate
                ? new Date(item.pubDate).toLocaleDateString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Hoje"}
            </div>

            <h2 className="rss-title text-2xl sm:text-3xl md:text-4xl font-black text-slate-950 leading-tight">
              {truncatedTitle}
            </h2>

            <p className="text-base sm:text-lg text-slate-700 leading-relaxed bg-slate-50 p-6 rounded-2xl border border-slate-200">
              {formatSnippet(item.description)}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-bold text-sky-600 hover:text-sky-800 underline underline-offset-4 focus-visible:ring-2 focus-visible:ring-sky-500 rounded p-1"
              >
                <span>Acessar página de decisão</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                onClick={downloadRssXml}
                aria-label="Download RSS XML"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl shadow transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-slate-950"
              >
                <Download className="w-4 h-4" />
                <span>Download RSS (.xml)</span>
              </button>
            </div>
          </article>
        ) : (
          <p className="text-slate-600">Nenhum item encontrado no feed RSS.</p>
        )}
      </main>

      {/* Footer */}
      <footer
        role="contentinfo"
        className="w-full max-w-3xl mx-auto pt-6 border-t border-slate-200 text-xs text-slate-500 text-center"
      >
        Fico em Casa Hoje? — Atualização diária via feed estático RSS 2.0
      </footer>
    </div>
  );
};
