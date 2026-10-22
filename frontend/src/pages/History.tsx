import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Loader2,
} from "lucide-react";
import { fetchDecisionHistory } from "../services/api.js";
import { DecisionHistoryEntry } from "../types/index.js";

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

type HistoryStatus = "SIM" | "NÃO" | "ATENÇÃO";

const STATUS_STYLES: Record<HistoryStatus, string> = {
  SIM: "bg-red-600 text-white",
  NÃO: "bg-sky-600 text-white",
  ATENÇÃO: "bg-amber-500 text-white",
};

const STATUS_LABEL: Record<HistoryStatus, string> = {
  SIM: "SIM",
  NÃO: "NÃO",
  ATENÇÃO: "ATENÇÃO",
};

function shiftMonth(month: string, delta: number): string {
  const [year, monthIndex] = month.split("-").map(Number);
  const date = new Date(Date.UTC(year, monthIndex - 1 + delta, 1));
  return date.toISOString().slice(0, 7);
}

function formatMonthLabel(month: string): string {
  const [year, monthIndex] = month.split("-").map(Number);
  const date = new Date(Date.UTC(year, monthIndex - 1, 1));
  return date.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
}

export const History: React.FC = () => {
  const [month, setMonth] = useState(() =>
    new Date().toISOString().slice(0, 7),
  );
  const [entries, setEntries] = useState<DecisionHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.className =
      "bg-slate-50 font-sans text-slate-900 min-h-screen";
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetchDecisionHistory(month)
      .then((data) => {
        if (!cancelled) setEntries(data.entries || []);
      })
      .catch(() => {
        if (!cancelled) setEntries([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [month]);

  const entriesByDate = useMemo(() => {
    const map = new Map<string, DecisionHistoryEntry>();
    entries.forEach((entry) => map.set(entry.date, entry));
    return map;
  }, [entries]);

  // Constrói a grade do calendário do mês
  const calendarDays = useMemo(() => {
    const [year, monthIndex] = month.split("-").map(Number);
    const firstDay = new Date(Date.UTC(year, monthIndex - 1, 1));
    const daysInMonth = new Date(Date.UTC(year, monthIndex, 0)).getUTCDate();
    const leadingBlanks = firstDay.getUTCDay();

    const cells: Array<{ day: number | null; date?: string }> = [];
    for (let i = 0; i < leadingBlanks; i++) cells.push({ day: null });
    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${month}-${String(day).padStart(2, "0")}`;
      cells.push({ day, date });
    }
    return cells;
  }, [month]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col p-4 sm:p-8">
      <header className="w-full max-w-3xl mx-auto flex items-center justify-between pb-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <CalendarDays className="w-7 h-7 text-slate-900" />
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            Histórico de Decisões
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

      <main className="w-full max-w-3xl mx-auto py-8 flex-1">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setMonth((prev) => shiftMonth(prev, -1))}
            aria-label="Mês anterior"
            className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <h2 className="text-lg font-bold capitalize">
            {formatMonthLabel(month)}
          </h2>

          <button
            onClick={() => setMonth((prev) => shiftMonth(prev, 1))}
            aria-label="Próximo mês"
            className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-500">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            Carregando histórico...
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <div className="grid grid-cols-7 gap-2 mb-2">
              {WEEKDAYS.map((weekday) => (
                <div
                  key={weekday}
                  className="text-center text-xs font-bold uppercase tracking-wide text-slate-500 py-1"
                >
                  {weekday}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((cell, index) => {
                if (!cell.day || !cell.date) {
                  return <div key={`blank-${index}`} className="min-h-20" />;
                }

                const entry = entriesByDate.get(cell.date);
                return (
                  <div
                    key={cell.date}
                    className="min-h-20 rounded-xl border border-slate-200 bg-slate-50 p-2 flex flex-col gap-1"
                    title={entry?.justification || "Sem decisão registrada"}
                  >
                    <span className="text-xs font-bold text-slate-600">
                      {cell.day}
                    </span>
                    {entry ? (
                      <span
                        className={`mt-auto inline-flex items-center justify-center rounded-md px-1.5 py-0.5 text-[10px] font-black tracking-wide ${STATUS_STYLES[entry.value as HistoryStatus]}`}
                      >
                        {STATUS_LABEL[entry.value as HistoryStatus]}
                      </span>
                    ) : (
                      <span className="mt-auto text-[10px] text-slate-400">
                        —
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-4 mt-6 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-red-600" /> SIM
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-500" /> ATENÇÃO
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-sky-600" /> NÃO
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-slate-200" /> Sem registro
          </span>
        </div>
      </main>
    </div>
  );
};
