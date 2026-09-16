import {
  WeatherData,
  TideData,
  RiverData,
  CriticalRoad,
  DecisionResult,
  DecisionValue,
} from "../types/index.js";
import { dataFetcherService } from "./dataFetcher.js";

export class RiskEngineService {
  private static readonly RISK_THRESHOLD = 65; // Corte em 65%

  /**
   * Trunca texto respeitando limite de caracteres com reticências (US-02)
   */
  public truncateJustification(text: string, maxLength = 90): string {
    if (!text || text.trim().length === 0) {
      return "Justificativa indisponível.";
    }
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength - 1).trimEnd() + "…";
  }

  /**
   * Avalia o vetor de entrada e gera o índice de risco de 0 a 100%
   */
  public calculateRiskScore(
    rainfall: WeatherData,
    tide: TideData,
    rivers: RiverData[],
  ): number {
    // 1. Fator Pluviométrico (peso 45%)
    // Chuva acumulada na madrugada (0-6h) + previsão (6-10h)
    const totalMorningRain = rainfall.rainPast6h + rainfall.rainForecastMorning;
    // Escala: 0mm -> 0, 15mm -> 40%, 35mm -> 80%, 50mm+ -> 100%
    const rainScore = Math.min(100, (totalMorningRain / 45) * 100);

    // 2. Fator Maré (peso 35%)
    // Preamar em Recife: <1.5m (baixa), 1.5-2.0m (média), >2.0m (alta/crítica)
    let tideScore = 0;
    if (tide.peakHeight >= 2.3) {
      tideScore = 100;
    } else if (tide.peakHeight >= 2.0) {
      tideScore = 75 + (tide.peakHeight - 2.0) * 80;
    } else if (tide.peakHeight >= 1.6) {
      tideScore = 40 + (tide.peakHeight - 1.6) * 85;
    } else {
      tideScore = (tide.peakHeight / 1.6) * 40;
    }

    // Se a maré alta não coincide com o horário matinal de pico (06h-10h), atenua em 30%
    if (!tide.isHighTideMorning) {
      tideScore *= 0.7;
    }

    // 3. Fator Nível dos Rios (peso 20%)
    let riverScore = 0;
    const hasOverflow = rivers.some((r) => r.status === "TRANSBORDAMENTO");
    const hasAlert = rivers.some((r) => r.status === "ALERTA");
    const hasAttention = rivers.some((r) => r.status === "ATENÇÃO");

    if (hasOverflow) {
      riverScore = 100;
    } else if (hasAlert) {
      riverScore = 80;
    } else if (hasAttention) {
      riverScore = 45;
    } else {
      riverScore = 15;
    }

    // Efeito de Não-Linearidade (Sinérgica): quando chuva E maré alta coincidem, o risco salta
    let synergyMultiplier = 1.0;
    if (
      totalMorningRain >= 25 &&
      tide.peakHeight >= 2.0 &&
      tide.isHighTideMorning
    ) {
      synergyMultiplier = 1.25; // Efeito represa nos canais
    }

    const baseRisk = rainScore * 0.45 + tideScore * 0.35 + riverScore * 0.2;
    const finalRisk = Math.min(100, Math.round(baseRisk * synergyMultiplier));

    return finalRisk;
  }

  /**
   * Gera a justificativa contextual curta (≤ 90 caracteres)
   */
  public generateShortJustification(
    value: DecisionValue,
    rainfall: WeatherData,
    tide: TideData,
    rivers: RiverData[],
  ): string {
    const totalRain = Math.round(
      rainfall.rainPast6h + rainfall.rainForecastMorning,
    );

    if (value === "SIM") {
      const riverCritical = rivers.find(
        (r) => r.status === "ALERTA" || r.status === "TRANSBORDAMENTO",
      );
      if (riverCritical) {
        return this.truncateJustification(
          `Maré de ${tide.peakHeight.toFixed(1)}m às ${tide.peakTime} e ${riverCritical.name} em cota de alerta.`,
        );
      }
      return this.truncateJustification(
        `Pico de maré de ${tide.peakHeight.toFixed(1)}m às ${tide.peakTime} alinhado a ${totalRain}mm de chuva.`,
      );
    } else {
      if (totalRain < 5 && tide.peakHeight < 1.9) {
        return this.truncateJustification(
          `Maré baixa (${tide.peakHeight.toFixed(1)}m) e chuva fraca. Vias livres sem pontos críticos.`,
        );
      }
      return this.truncateJustification(
        `Maré sob controle (${tide.peakHeight.toFixed(1)}m) e chuva moderada. Trânsito transitável.`,
      );
    }
  }

  /**
   * Gera descrição estendida para exibição complementar e RSS Feed (200-400 caracteres)
   */
  public generateExtendedDescription(
    value: DecisionValue,
    riskScore: number,
    rainfall: WeatherData,
    tide: TideData,
    rivers: RiverData[],
  ): string {
    const totalRain = Math.round(
      rainfall.rainPast6h + rainfall.rainForecastMorning,
    );
    const riverStatusSummary = rivers
      .map((r) => `${r.name}: ${r.status.toLowerCase()}`)
      .join(", ");

    if (value === "SIM") {
      return `Alerta de Risco Alto (${riskScore}%): Fique em casa nesta manhã. A combinação de maré alta com pico de ${tide.peakHeight.toFixed(1)}m às ${tide.peakTime}, somada a precipitação de ${totalRain}mm acumulada/prevista e cota dos rios (${riverStatusSummary}), gera alto potencial de ilhamento nas principais vias metropolitanas do Recife.`;
    }

    return `Situação Normal (${riskScore}%): Pode sair com tranquilidade nesta manhã. As condições meteorológicas e fluviométricas indicam baixo risco de alagamentos. Pico de maré previsto para ${tide.peakTime} com altura de ${tide.peakHeight.toFixed(1)}m e chuva de ${totalRain}mm. Situação dos rios: ${riverStatusSummary}.`;
  }

  /**
   * Executa a avaliação completa e retorna o resultado estruturado
   */
  public async evaluateCurrentStatus(
    criticalRoads?: CriticalRoad[],
  ): Promise<DecisionResult> {
    const rainfall = await dataFetcherService.fetchWeatherData();
    const tide = await dataFetcherService.fetchTideData();
    const rivers = await dataFetcherService.fetchRiverData();
    const roads = criticalRoads || dataFetcherService.getCriticalRoads();

    const riskScore = this.calculateRiskScore(rainfall, tide, rivers);
    const value: DecisionValue =
      riskScore > RiskEngineService.RISK_THRESHOLD ? "SIM" : "NÃO";

    const justification = this.generateShortJustification(
      value,
      rainfall,
      tide,
      rivers,
    );
    const extendedDescription = this.generateExtendedDescription(
      value,
      riskScore,
      rainfall,
      tide,
      rivers,
    );

    const now = new Date();
    const expiresAt = new Date(
      now.getTime() + 24 * 60 * 60 * 1000,
    ).toISOString();

    return {
      value,
      justification,
      extendedDescription,
      riskScore,
      calculatedAt: now.toISOString(),
      expiresAt,
      factors: {
        rainfall,
        tide,
        rivers,
        riskScore,
      },
      criticalRoads: roads,
      isFallback: false,
    };
  }

  /**
   * Fallback estático seguro em caso de pane geral de dados (RF-04 / US-07)
   */
  public getStaticFallbackResult(): DecisionResult {
    const now = new Date();
    const expiresAt = new Date(
      now.getTime() + 24 * 60 * 60 * 1000,
    ).toISOString();

    return {
      value: "SIM",
      justification:
        "Decisão padrão de precaução devido à indisponibilidade momentânea de dados.",
      extendedDescription:
        "Não foi possível obter dados meteorológicos hoje. Por precaução, consulte os órgãos oficiais de defesa civil antes de sair.",
      riskScore: 66,
      calculatedAt: now.toISOString(),
      expiresAt,
      factors: {
        rainfall: {
          rainPast6h: 0,
          rainForecastMorning: 0,
          rainProbability: 0,
          timestamp: now.toISOString(),
        },
        tide: {
          peakTime: "07:30",
          peakHeight: 2.0,
          isHighTideMorning: true,
          timestamp: now.toISOString(),
        },
        rivers: [],
        riskScore: 66,
      },
      criticalRoads: dataFetcherService.getCriticalRoads(),
      isFallback: true,
    };
  }
}

export const riskEngineService = new RiskEngineService();
