import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { DecisionDisplay } from "../src/components/DecisionDisplay.js";
import { ErrorFallback } from "../src/components/ErrorFallback.js";
import { GeoConsentModal } from "../src/components/GeoConsentModal.js";
import { DecisionResult } from "../src/types/index.js";

const mockDecisionSim: DecisionResult = {
  value: "SIM",
  justification: "Pico de maré de 2.2m às 07h30 alinhado a 35mm de chuva.",
  extendedDescription: "Risco elevado de alagamentos.",
  riskScore: 82,
  calculatedAt: new Date().toISOString(),
  expiresAt: new Date().toISOString(),
  factors: {
    rainfall: {
      rainPast6h: 20,
      rainForecastMorning: 15,
      rainProbability: 80,
      timestamp: "",
    },
    tide: {
      peakTime: "07:30",
      peakHeight: 2.2,
      isHighTideMorning: true,
      timestamp: "",
    },
    rivers: [],
    riskScore: 82,
  },
  criticalRoads: [],
};

const mockDecisionNao: DecisionResult = {
  value: "NÃO",
  justification: "Maré baixa e chuva fraca. Vias transitáveis.",
  extendedDescription: "Condições seguras para locomoção.",
  riskScore: 25,
  calculatedAt: new Date().toISOString(),
  expiresAt: new Date().toISOString(),
  factors: {
    rainfall: {
      rainPast6h: 0,
      rainForecastMorning: 1,
      rainProbability: 20,
      timestamp: "",
    },
    tide: {
      peakTime: "08:00",
      peakHeight: 1.4,
      isHighTideMorning: false,
      timestamp: "",
    },
    rivers: [],
    riskScore: 25,
  },
  criticalRoads: [],
};

describe("Frontend Components Test Suite", () => {
  it("DecisionDisplay renderiza decisão SIM com alerta e fatores de risco", () => {
    render(<DecisionDisplay decision={mockDecisionSim} />);
    expect(screen.getByText("SIM!")).toBeDefined();
    expect(screen.getByText(/Fica em casa hoje/i)).toBeDefined();
    expect(screen.getByText(/Pico de maré de 2.2m/i)).toBeDefined();
    expect(screen.getByText("82%")).toBeDefined();
  });

  it("DecisionDisplay renderiza decisão NÃO com mensagem segura", () => {
    render(<DecisionDisplay decision={mockDecisionNao} />);
    expect(screen.getByText("NÃO!")).toBeDefined();
    expect(screen.getByText(/Pode sair com segurança/i)).toBeDefined();
    expect(screen.getByText(/Maré baixa e chuva fraca/i)).toBeDefined();
    expect(screen.getByText("25%")).toBeDefined();
  });

  it("ErrorFallback exibe texto centralizado e botão Tentar Novamente (US-1, US-2)", () => {
    const onRetryMock = vi.fn();
    render(<ErrorFallback onRetry={onRetryMock} />);

    expect(
      screen.getByText(/Não foi possível obter dados hoje/i),
    ).toBeDefined();
    const btn = screen.getByRole("button", { name: /Tentar Novamente/i });
    expect(btn).toBeDefined();

    fireEvent.click(btn);
    expect(onRetryMock).toHaveBeenCalledTimes(1);
  });

  it("GeoConsentModal abre e dispara callbacks de consentimento", () => {
    const onConsentMock = vi.fn();
    const { rerender } = render(
      <GeoConsentModal isOpen={true} onConsent={onConsentMock} />,
    );

    expect(
      screen.getByText(/Deseja que exibamos vias críticas próximas/i),
    ).toBeDefined();

    const confirmBtn = screen.getByRole("button", { name: /Sim, localizar/i });
    fireEvent.click(confirmBtn);
    expect(onConsentMock).toHaveBeenCalledWith(true);

    rerender(<GeoConsentModal isOpen={false} onConsent={onConsentMock} />);
    expect(
      screen.queryByText(/Deseja que exibamos vias críticas próximas/i),
    ).toBeNull();
  });
});
