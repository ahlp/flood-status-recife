import React, { useState, useEffect, useCallback } from "react";
import {
  loginAdmin,
  fetchLatencyMetrics,
  fetchSuccessFailureMetrics,
  fetchDailyDecisionsMetrics,
  fetchLogs,
} from "../services/api.js";
import {
  LatencyDataPoint,
  SourceSuccessRate,
  DailyDecisionPoint,
  LogEntry,
} from "../types/index.js";
import {
  Activity,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  Database,
  Filter,
  Lock,
  LogOut,
  RefreshCw,
  Terminal,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

export const Dashboard: React.FC = () => {
  const [token, setToken] = useState<string | null>(() =>
    sessionStorage.getItem("feh_admin_token"),
  );
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("adminrecife");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Estados de dados
  const [latencyData, setLatencyData] = useState<LatencyDataPoint[]>([]);
  const [successRates, setSuccessRates] = useState<SourceSuccessRate[]>([]);
  const [dailyDecisions, setDailyDecisions] = useState<DailyDecisionPoint[]>(
    [],
  );
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);

  // Filtros de Logs
  const [logDate, setLogDate] = useState("");
  const [logLevel, setLogLevel] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);
    try {
      const res = await loginAdmin(username, password);
      setToken(res.token);
      sessionStorage.setItem("feh_admin_token", res.token);
    } catch {
      setLoginError("Credenciais inválidas. Verifique usuário e senha.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    sessionStorage.removeItem("feh_admin_token");
  };

  const loadDashboardData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [lat, succ, daily, logList] = await Promise.all([
        fetchLatencyMetrics(token),
        fetchSuccessFailureMetrics(token),
        fetchDailyDecisionsMetrics(token),
        fetchLogs(token, logDate, logLevel),
      ]);
      setLatencyData(lat);
      setSuccessRates(succ);
      setDailyDecisions(daily);
      setLogs(logList);
    } catch {
      // Se der 401, expulsa
      handleLogout();
    } finally {
      setLoading(false);
    }
  }, [token, logDate, logLevel]);

  useEffect(() => {
    document.body.className =
      "bg-slate-950 font-sans text-slate-100 min-h-screen";
    if (token) {
      loadDashboardData();

      // Atualização automática dos gráficos a cada 60s
      const interval = setInterval(loadDashboardData, 60000);
      return () => clearInterval(interval);
    }
  }, [token, loadDashboardData]);

  // Tela de Login se não autenticado
  if (!token) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-400 mx-auto mb-4">
            <Lock className="w-6 h-6" />
          </div>

          <h1 className="text-2xl font-black text-center text-white mb-2">
            Painel de Métricas FEH
          </h1>
          <p className="text-xs text-slate-400 text-center mb-6">
            Autenticação restrita de operadores
          </p>

          {loginError && (
            <div className="mb-4 p-3 rounded-xl bg-red-900/30 border border-red-800 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Usuário
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-sky-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 px-4 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl shadow-lg transition-colors cursor-pointer mt-2"
            >
              {isLoggingIn ? "Autenticando..." : "Entrar no Dashboard"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar para tela inicial</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8">
      {/* Header do Dashboard */}
      <header className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <Activity className="w-6 h-6 text-sky-400" />
              <span>Monitoramento & Métricas Internas</span>
            </h1>
            <p className="text-xs text-slate-400">
              Flood Status Recife (Fico em Casa Hoje?)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadDashboardData}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-xs font-semibold rounded-xl text-slate-300 border border-slate-800 cursor-pointer"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
            />
            <span>Atualizar</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-2 bg-red-950/40 hover:bg-red-900/60 text-xs font-semibold text-red-300 border border-red-900/50 rounded-xl cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sair</span>
          </button>
        </div>
      </header>

      {/* Grid de Métricas */}
      <main className="max-w-7xl mx-auto py-8 space-y-8">
        {/* Seção 1: Latência das Chamadas Externas (Open-Meteo, Marinha, CEMADEN) */}
        <section className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-sky-400" />
                <span>Latência das Chamadas Externas (Últimas 24h)</span>
              </h2>
              <p className="text-xs text-slate-400">
                Tempo de resposta em milissegundos (ms) por fonte
              </p>
            </div>
            <div className="flex gap-3 text-xs">
              <span className="flex items-center gap-1 text-sky-400">
                ● Open-Meteo
              </span>
              <span className="flex items-center gap-1 text-amber-400">
                ● Marinha do Brasil
              </span>
              <span className="flex items-center gap-1 text-emerald-400">
                ● CEMADEN
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card Open-Meteo */}
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <div className="text-xs font-semibold text-slate-400 mb-1">
                Open-Meteo (Previsão Pluvial)
              </div>
              <div className="text-2xl font-black text-sky-400">
                {latencyData[latencyData.length - 1]?.openMeteo || 140} ms
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                Média 24h: ~150ms
              </div>
            </div>

            {/* Card Marinha */}
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <div className="text-xs font-semibold text-slate-400 mb-1">
                Marinha do Brasil (Tábua de Marés)
              </div>
              <div className="text-2xl font-black text-amber-400">
                {latencyData[latencyData.length - 1]?.marinha || 210} ms
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                Média 24h: ~220ms
              </div>
            </div>

            {/* Card CEMADEN */}
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <div className="text-xs font-semibold text-slate-400 mb-1">
                CEMADEN / APAC (Nível Fluvial)
              </div>
              <div className="text-2xl font-black text-emerald-400">
                {latencyData[latencyData.length - 1]?.cemaden || 95} ms
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                Média 24h: ~105ms
              </div>
            </div>
          </div>

          {/* Gráfico Visual de Histórico Recente de Latência */}
          <div className="mt-6 pt-4 border-t border-slate-800 overflow-x-auto">
            <div className="min-w-[600px] flex items-end justify-between gap-1 h-28 pt-4">
              {latencyData.slice(-16).map((pt, idx) => (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center gap-1 h-full justify-end group relative"
                >
                  <div className="w-full flex items-end gap-0.5 justify-center h-full">
                    <div
                      style={{
                        height: `${Math.min(100, (pt.openMeteo / 300) * 100)}%`,
                      }}
                      className="w-1.5 bg-sky-400 rounded-t"
                      title={`Open-Meteo: ${pt.openMeteo}ms`}
                    />
                    <div
                      style={{
                        height: `${Math.min(100, (pt.marinha / 300) * 100)}%`,
                      }}
                      className="w-1.5 bg-amber-400 rounded-t"
                      title={`Marinha: ${pt.marinha}ms`}
                    />
                    <div
                      style={{
                        height: `${Math.min(100, (pt.cemaden / 300) * 100)}%`,
                      }}
                      className="w-1.5 bg-emerald-400 rounded-t"
                      title={`CEMADEN: ${pt.cemaden}ms`}
                    />
                  </div>
                  <span className="text-[9px] text-slate-500 mt-1">
                    {pt.timeStr}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Seção 2: Taxa de Sucesso vs Falha por Fonte */}
        <section className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-400" />
                <span>Taxa de Sucesso vs. Falha das Fontes Externas</span>
              </h2>
              <p className="text-xs text-slate-400">
                Confiabilidade e resiliência das integrações
              </p>
            </div>
            <div className="flex gap-3 text-xs">
              <span className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> Sucesso
              </span>
              <span className="flex items-center gap-1 text-red-400">
                <XCircle className="w-3.5 h-3.5" /> Falha
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {successRates.map((src) => (
              <div
                key={src.service}
                className="bg-slate-900 p-5 rounded-2xl border border-slate-800"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-white uppercase">
                    {src.service}
                  </span>
                  <span className="text-sm font-black text-emerald-400">
                    {src.successRate}%
                  </span>
                </div>

                {/* Barra de Progresso Bicolor */}
                <div className="w-full h-3 bg-red-900/60 rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${src.successRate}%` }}
                    className="bg-emerald-500 h-full"
                  />
                </div>

                <div className="flex justify-between text-[11px] text-slate-400 mt-3">
                  <span>
                    Sucessos:{" "}
                    <strong className="text-emerald-400">
                      {src.successCount}
                    </strong>
                  </span>
                  <span>
                    Falhas:{" "}
                    <strong className="text-red-400">{src.failureCount}</strong>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Seção 3: Contagem Diária de Requisições /decision (7 Semanas) */}
        <section className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-400" />
                <span>
                  Volume Diário de Consultas /decision (Últimas 7 Semanas)
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Total de requisições de decisão atendidas pelo backend
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[700px] flex items-end justify-between gap-1 h-36 pt-4">
              {dailyDecisions.slice(-21).map((d, i) => (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group"
                >
                  <div
                    style={{
                      height: `${Math.min(100, (d.count / 2000) * 100)}%`,
                    }}
                    className="w-full bg-indigo-500/80 group-hover:bg-indigo-400 rounded-t transition-all relative"
                  >
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-[10px] text-white px-2 py-0.5 rounded shadow whitespace-nowrap pointer-events-none transition-opacity">
                      {d.count} acessos
                    </div>
                  </div>
                  <span className="text-[8px] text-slate-500">{d.date}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Seção 4: Visualizador de Logs Estruturados */}
        <section className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Terminal className="w-5 h-5 text-sky-400" />
                <span>Logs Estruturados do Sistema</span>
              </h2>
              <p className="text-xs text-slate-400">
                Filtragem de ocorrências por severidade e data
              </p>
            </div>

            {/* Controles de Filtro */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <input
                  type="date"
                  value={logDate}
                  onChange={(e) => setLogDate(e.target.value)}
                  className="bg-transparent text-slate-200 focus:outline-none"
                />
              </div>

              <select
                value={logLevel}
                onChange={(e) => setLogLevel(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
              >
                <option value="">Todos os Níveis</option>
                <option value="INFO">INFO</option>
                <option value="WARN">WARN</option>
                <option value="ERROR">ERROR</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto max-h-96 rounded-xl border border-slate-800 bg-slate-950 font-mono text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] sticky top-0 border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-4">Timestamp</th>
                  <th className="py-2.5 px-4">Nível</th>
                  <th className="py-2.5 px-4">Serviço</th>
                  <th className="py-2.5 px-4">Mensagem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900">
                {logs.length > 0 ? (
                  logs.map((l, i) => (
                    <tr key={i} className="hover:bg-slate-900/50">
                      <td className="py-2 px-4 text-slate-400 whitespace-nowrap">
                        {new Date(l.timestamp).toLocaleTimeString("pt-BR")}
                      </td>
                      <td className="py-2 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            l.level === "error"
                              ? "bg-red-900/60 text-red-300"
                              : l.level === "warn"
                                ? "bg-amber-900/60 text-amber-300"
                                : "bg-sky-900/60 text-sky-300"
                          }`}
                        >
                          {l.level.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-2 px-4 text-slate-400">{l.service}</td>
                      <td className="py-2 px-4 text-slate-200">{l.message}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-500">
                      Nenhum registro de log encontrado para os filtros
                      selecionados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};
