import { describe, it, expect } from "vitest";
import { riskEngineService } from "../src/services/riskEngine.js";

describe("Truncamento de justificativa com reticências (Caso 03)", () => {
  const longText =
    "Pico de maré de 2.2m às 07h30 alinhado a 35mm de chuva, e o Rio Tejipió está em alerta com cota de 2.8m";

  it("trunca em 90 caracteres incluindo a reticência", () => {
    const result = riskEngineService.truncateJustification(longText, 90);
    expect(result.length).toBeLessThanOrEqual(90);
    expect(result.endsWith("…")).toBe(true);
  });

  it("preserva textos que já cabem no limite", () => {
    const short = "Maré alta e chuva forte.";
    expect(riskEngineService.truncateJustification(short, 90)).toBe(short);
  });

  it("retorna texto padrão para entrada vazia", () => {
    expect(riskEngineService.truncateJustification("", 90)).toBe(
      "Justificativa indisponível.",
    );
  });
});
