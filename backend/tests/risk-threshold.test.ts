import { describe, it, expect } from "vitest";
import { RiskEngineService } from "../src/services/riskEngine.js";

describe("Limiar de decisão de risco (Caso 04)", () => {
  it("constante canônica de corte é 60%", () => {
    expect(RiskEngineService.getRiskThreshold()).toBe(60);
  });
});
