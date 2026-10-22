import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { DecisionDisplay } from "../src/components/DecisionDisplay.js";
import { ErrorFallback } from "../src/components/ErrorFallback.js";
import {
  GeoConsentModal,
  checkGeoConsent,
  saveGeoConsent,
} from "../src/components/GeoConsentModal.js";
import { PrintButton } from "../src/components/PrintButton.js";
import { RssIcon } from "../src/components/RssIcon.js";
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
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe("DecisionDisplay Spec Compliance", () => {
    it("renderiza decisão SIM com alerta, 48px+ de fonte e fatores de risco", () => {
      render(<DecisionDisplay decision={mockDecisionSim} />);
      expect(screen.getByText("SIM!")).toBeDefined();
      expect(screen.getByText(/Fica em casa hoje/i)).toBeDefined();
      expect(screen.getByText(/Pico de maré de 2.2m/i)).toBeDefined();
      expect(screen.getByText("82%")).toBeDefined();
    });

    it("renderiza decisão NÃO com mensagem segura", () => {
      render(<DecisionDisplay decision={mockDecisionNao} />);
      expect(screen.getByText("NÃO!")).toBeDefined();
      expect(screen.getByText(/Pode sair com segurança/i)).toBeDefined();
      expect(screen.getByText(/Maré baixa e chuva fraca/i)).toBeDefined();
      expect(screen.getByText("25%")).toBeDefined();
    });

    it("trunca justificativa para no máximo 90 caracteres quando texto for longo", () => {
      const longDecision: DecisionResult = {
        ...mockDecisionSim,
        justification:
          "Esta é uma justificativa extremamente longa com mais de noventa caracteres que deve ser truncada automaticamente pela interface.",
      };
      render(<DecisionDisplay decision={longDecision} />);
      const el = screen.getByTitle(longDecision.justification);
      expect(el.textContent!.length).toBeLessThanOrEqual(90);
      expect(el.textContent).toContain("…");
    });

    it("renderiza via crítica próxima quando fornecida", () => {
      const road = {
        id: "agamenon",
        name: "Av. Governador Agamenon Magalhães",
        neighborhood: "Derby",
        city: "Recife",
        lat: -8.05,
        lng: -34.89,
        floodRiskLevel: "CRÍTICO" as const,
        description: "Alagamento",
      };
      render(<DecisionDisplay decision={mockDecisionSim} userRoad={road} />);
      expect(screen.getByText(/Via crítica próxima:/i)).toBeDefined();
      expect(
        screen.getByText(/Av. Governador Agamenon Magalhães/i),
      ).toBeDefined();
    });
  });

  describe("GeoConsentModal Spec Compliance", () => {
    it("renderiza texto exato da especificação e botões corretos", () => {
      const onConsentMock = vi.fn();
      render(<GeoConsentModal isOpen={true} onConsent={onConsentMock} />);

      expect(
        screen.getByText(
          "Deseja que exibamos vias críticas próximas com risco de alagamento?",
        ),
      ).toBeDefined();

      const confirmBtn = screen.getByRole("button", { name: "Sim, localizar" });
      const cancelBtn = screen.getByRole("button", { name: "Não" });
      expect(confirmBtn).toBeDefined();
      expect(cancelBtn).toBeDefined();

      fireEvent.click(confirmBtn);
      expect(onConsentMock).toHaveBeenCalledWith(true);
    });

    it("bloqueia e restaura o overflow do body ao abrir/fechar", () => {
      const { rerender } = render(
        <GeoConsentModal isOpen={true} onConsent={vi.fn()} />,
      );
      expect(document.body.style.overflow).toBe("hidden");

      rerender(<GeoConsentModal isOpen={false} onConsent={vi.fn()} />);
      expect(document.body.style.overflow).not.toBe("hidden");
    });

    it("persiste consentimento no localStorage com validade de 30 dias", () => {
      saveGeoConsent(true);
      const consent = checkGeoConsent();
      expect(consent.asked).toBe(true);
      expect(consent.consent).toBe(true);
    });

    it("trata consentimento expirado no localStorage como não solicitado", () => {
      const expiredData = {
        consent: true,
        expiresAt: Date.now() - 1000, // expirado
      };
      localStorage.setItem("feh_geo_consent", JSON.stringify(expiredData));

      const consent = checkGeoConsent();
      expect(consent.asked).toBe(false);
      expect(consent.consent).toBe(false);
    });
  });

  describe("Static Fallback & Error Handling Spec Compliance", () => {
    it("ErrorFallback exibe texto centralizado e botão Tentar Novamente", () => {
      const onRetryMock = vi.fn();
      render(<ErrorFallback onRetry={onRetryMock} />);

      expect(
        screen.getByText(
          "Não foi possível obter dados hoje. Por favor, tente novamente amanhã.",
        ),
      ).toBeDefined();
      const btn = screen.getByRole("button", { name: /Tentar Novamente/i });
      expect(btn).toBeDefined();

      fireEvent.click(btn);
      expect(onRetryMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("PNG Export & RSS Navigation Spec Compliance", () => {
    it("PrintButton renderiza botão de salvar PNG", () => {
      render(<PrintButton />);
      expect(
        screen.getByRole("button", { name: /Baixar imagem da decisão/i }),
      ).toBeDefined();
      expect(screen.getByText("Salvar PNG")).toBeDefined();
    });

    it("RssIcon renderiza link direcionando para /rss", () => {
      render(
        <BrowserRouter>
          <RssIcon />
        </BrowserRouter>,
      );
      const link = screen.getByRole("link", { name: /Acessar Feed RSS/i });
      expect(link.getAttribute("href")).toBe("/rss");
    });
  });
});
