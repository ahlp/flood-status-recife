import axios from "axios";
import {
  DecisionResult,
  RSSFeedItem,
  LatencyDataPoint,
  SourceSuccessRate,
  DailyDecisionPoint,
  LogEntry,
  DecisionHistoryResponse,
} from "../types/index.js";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
});

// Fallback estático local (US-07 / RF-04)
export const STATIC_FALLBACK_DECISION: DecisionResult = {
  value: "SIM",
  justification:
    "Decisão padrão de precaução devido à indisponibilidade de dados externos.",
  extendedDescription:
    "Não foi possível obter dados hoje. Por favor, tente novamente mais tarde ou consulte os órgãos oficiais.",
  riskScore: 65,
  calculatedAt: new Date().toISOString(),
  expiresAt: new Date(Date.now() + 86400000).toISOString(),
  factors: {
    rainfall: {
      rainPast6h: 0,
      rainForecastMorning: 0,
      rainProbability: 0,
      timestamp: new Date().toISOString(),
    },
    tide: {
      peakTime: "07:30",
      peakHeight: 2.0,
      isHighTideMorning: true,
      timestamp: new Date().toISOString(),
    },
    rivers: [],
    riskScore: 65,
  },
  criticalRoads: [
    {
      id: "agamenon-magalhaes",
      name: "Av. Governador Agamenon Magalhães",
      neighborhood: "Derby / Espinheiro",
      city: "Recife",
      lat: -8.0512,
      lng: -34.8988,
      floodRiskLevel: "CRÍTICO",
      description: "Ponto crítico de alagamento nos cruzamentos centrais.",
    },
  ],
  isFallback: true,
};

export async function fetchDecision(): Promise<DecisionResult> {
  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    try {
      const response = await api.get<DecisionResult>("/api/decision");
      return response.data;
    } catch (error) {
      attempts++;
      console.warn(
        `[FEH] Tentativa ${attempts}/${maxAttempts} de buscar decisão falhou.`,
      );
      if (attempts >= maxAttempts) {
        console.warn(
          "[FEH] Ativando fallback estático após 3 falhas consecutivas.",
          error,
        );
        return STATIC_FALLBACK_DECISION;
      }
      await new Promise((res) => setTimeout(res, attempts * 500));
    }
  }

  return STATIC_FALLBACK_DECISION;
}

export async function fetchLocationInfo(): Promise<{
  city: string;
  state: string;
  nearestCriticalRoad?: {
    name: string;
    neighborhood: string;
    description: string;
  };
}> {
  try {
    const res = await api.get("/api/location");
    return res.data;
  } catch (error) {
    console.warn(
      "[FEH] Falha ao consultar geolocalização. Continuando com decisão global.",
      error,
    );
    return {
      city: "Recife",
      state: "PE",
      nearestCriticalRoad: STATIC_FALLBACK_DECISION.criticalRoads[0],
    };
  }
}

export async function fetchLatestRss(): Promise<RSSFeedItem> {
  try {
    const res = await api.get<RSSFeedItem>("/api/rss/latest");
    return res.data;
  } catch {
    return {
      title: "Decisão do dia: Ficar em casa? SIM",
      link: "https://ficoemcasa.com.br/",
      pubDate: new Date().toUTCString(),
      description:
        "Utilizando dados estáticos de contingência. Não foi possível conectar ao servidor RSS.",
      guid: `feh-fallback-${new Date().toISOString().slice(0, 10)}`,
    };
  }
}

export function downloadRssXml(): void {
  window.open(`${API_BASE_URL}/api/rss/download`, "_blank");
}

export async function loginAdmin(
  username: string,
  password: string,
): Promise<{ token: string; expiresIn: number }> {
  const res = await api.post("/api/auth/login", { username, password });
  return res.data;
}

export async function fetchLatencyMetrics(
  token: string,
): Promise<LatencyDataPoint[]> {
  const res = await api.get("/api/metrics/latency", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data;
}

export async function fetchSuccessFailureMetrics(
  token: string,
): Promise<SourceSuccessRate[]> {
  const res = await api.get("/api/metrics/success-failure", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data;
}

export async function fetchDailyDecisionsMetrics(
  token: string,
): Promise<DailyDecisionPoint[]> {
  const res = await api.get("/api/metrics/daily-decisions", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data;
}

export async function fetchLogs(
  token: string,
  date?: string,
  level?: string,
): Promise<LogEntry[]> {
  const params: Record<string, string> = {};
  if (date) params.date = date;
  if (level) params.level = level;

  const res = await api.get("/api/logs", {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });
  return res.data.logs;
}

// --- Histórico de Decisões ---
export async function fetchDecisionHistory(
  month: string,
): Promise<DecisionHistoryResponse> {
  const res = await api.get("/api/decisions/history", { params: { month } });
  return res.data;
}
