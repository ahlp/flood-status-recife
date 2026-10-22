export type DecisionValue = "SIM" | "NÃO" | "ATENÇÃO";

export interface WeatherData {
  rainPast6h: number;
  rainForecastMorning: number;
  rainProbability: number;
  timestamp: string;
}

export interface TideData {
  peakTime: string;
  peakHeight: number;
  isHighTideMorning: boolean;
  timestamp: string;
}

export interface RiverData {
  name: string;
  station: string;
  level: number;
  alertThreshold: number;
  overflowThreshold: number;
  status: "NORMAL" | "ATENÇÃO" | "ALERTA" | "TRANSBORDAMENTO";
}

export interface CriticalRoad {
  id: string;
  name: string;
  neighborhood: string;
  city: string;
  lat: number;
  lng: number;
  floodRiskLevel: "ALTO" | "CRÍTICO" | "MÉDIO";
  description: string;
}

export interface DecisionFactors {
  rainfall: WeatherData;
  tide: TideData;
  rivers: RiverData[];
  riskScore: number;
}

export interface DecisionResult {
  value: DecisionValue;
  justification: string;
  extendedDescription: string;
  riskScore: number;
  calculatedAt: string;
  expiresAt: string;
  factors: DecisionFactors;
  criticalRoads: CriticalRoad[];
  isFallback?: boolean;
}

export interface RSSFeedItem {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  guid: string;
}

export interface LatencyDataPoint {
  timestamp: string;
  timeStr: string;
  openMeteo: number;
  marinha: number;
  cemaden: number;
}

export interface SourceSuccessRate {
  service: string;
  successCount: number;
  failureCount: number;
  successRate: number;
}

export interface DailyDecisionPoint {
  date: string;
  count: number;
}

export interface LogEntry {
  timestamp: string;
  level: "info" | "warn" | "error";
  message: string;
  service: string;
  metadata?: Record<string, unknown>;
}
