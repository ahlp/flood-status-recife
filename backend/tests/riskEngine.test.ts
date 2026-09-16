import { describe, it, expect } from "vitest";
import { riskEngineService } from "../src/services/riskEngine.js";
import { WeatherData, TideData, RiverData } from "../src/types/index.js";

describe("RiskEngineService", () => {
  const baseWeather: WeatherData = {
    rainPast6h: 0,
    rainForecastMorning: 2,
    rainProbability: 20,
    timestamp: new Date().toISOString(),
  };

  const baseTide: TideData = {
    peakTime: "08:00",
    peakHeight: 1.4,
    isHighTideMorning: false,
    timestamp: new Date().toISOString(),
  };

  const baseRivers: RiverData[] = [
    {
      name: "Rio Capibaribe",
      station: "Estação Central",
      level: 2.5,
      alertThreshold: 4.2,
      overflowThreshold: 5.0,
      status: "NORMAL",
    },
  ];

  it("deve calcular risco baixo (<65%) e retornar NÃO quando o tempo e maré estão tranquilos", () => {
    const risk = riskEngineService.calculateRiskScore(
      baseWeather,
      baseTide,
      baseRivers,
    );
    expect(risk).toBeLessThanOrEqual(65);

    const justification = riskEngineService.generateShortJustification(
      "NÃO",
      baseWeather,
      baseTide,
      baseRivers,
    );
    expect(justification.length).toBeLessThanOrEqual(90);
    expect(justification).toContain("Maré");
  });

  it("deve calcular risco alto (>65%) e retornar SIM quando ocorre chuva forte + maré alta no pico", () => {
    const heavyRain: WeatherData = {
      rainPast6h: 25,
      rainForecastMorning: 20,
      rainProbability: 90,
      timestamp: new Date().toISOString(),
    };

    const criticalTide: TideData = {
      peakTime: "07:30",
      peakHeight: 2.3,
      isHighTideMorning: true,
      timestamp: new Date().toISOString(),
    };

    const alertRivers: RiverData[] = [
      {
        name: "Rio Tejipió",
        station: "Afogados",
        level: 3.3,
        alertThreshold: 2.5,
        overflowThreshold: 3.2,
        status: "TRANSBORDAMENTO",
      },
    ];

    const risk = riskEngineService.calculateRiskScore(
      heavyRain,
      criticalTide,
      alertRivers,
    );
    expect(risk).toBeGreaterThan(65);

    const justification = riskEngineService.generateShortJustification(
      "SIM",
      heavyRain,
      criticalTide,
      alertRivers,
    );
    expect(justification.length).toBeLessThanOrEqual(90);
    expect(justification).toBeTruthy();
  });

  it("deve truncar justificativas com reticências quando exceder 90 caracteres (US-02)", () => {
    const longText =
      "Esta é uma justificativa muito longa que ultrapassa significativamente o limite estipulado de noventa caracteres para teste de conformidade.";
    const truncated = riskEngineService.truncateJustification(longText, 90);
    expect(truncated.length).toBeLessThanOrEqual(90);
    expect(truncated.endsWith("…")).toBe(true);
  });

  it("deve retornar justificativa padrão quando vazia", () => {
    const empty = riskEngineService.truncateJustification("", 90);
    expect(empty).toBe("Justificativa indisponível.");
  });

  it("deve fornecer fallback estático seguro com todos os campos necessários (RF-04)", () => {
    const fallback = riskEngineService.getStaticFallbackResult();
    expect(fallback.value).toBe("SIM");
    expect(fallback.isFallback).toBe(true);
    expect(fallback.justification).toBeTruthy();
    expect(fallback.criticalRoads.length).toBeGreaterThan(0);
  });
});
