export type DecisionValue = 'SIM' | 'NÃO';

export interface WeatherData {
  rainPast6h: number; // Chuva acumulada 00h-06h em mm
  rainForecastMorning: number; // Chuva prevista 06h-10h em mm
  rainProbability: number; // 0-100%
  timestamp: string;
}

export interface TideData {
  peakTime: string; // ex: "07:30"
  peakHeight: number; // altura em metros (ex: 2.3)
  isHighTideMorning: boolean; // se o pico coincide com a janela 06h-10h
  timestamp: string;
}

export interface RiverData {
  name: string;
  station: string;
  level: number; // cota em metros
  alertThreshold: number;
  overflowThreshold: number;
  status: 'NORMAL' | 'ATENÇÃO' | 'ALERTA' | 'TRANSBORDAMENTO';
}

export interface CriticalRoad {
  id: string;
  name: string;
  neighborhood: string;
  city: string;
  lat: number;
  lng: number;
  floodRiskLevel: 'ALTO' | 'CRÍTICO' | 'MÉDIO';
  description: string;
}

export interface DecisionFactors {
  rainfall: WeatherData;
  tide: TideData;
  rivers: RiverData[];
  riskScore: number; // 0 a 100%
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

export interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  service: string;
  metadata?: Record<string, unknown>;
}
