import { describe, it, expect } from "vitest";
import tailwindConfig from "../tailwind.config.js";

describe("Identidade visual canônica das decisões (Caso 24)", () => {
  const colors = (tailwindConfig as any).theme.extend.colors;

  it("SIM usa o token canônico decision-sim = #ff4d00", () => {
    expect(colors["decision-sim"]).toBe("#ff4d00");
  });

  it("NÃO usa o token canônico decision-nao = #3498db", () => {
    expect(colors["decision-nao"]).toBe("#3498db");
  });

  it("vermelho #c0392b não é usado como base da decisão SIM", () => {
    expect(colors["decision-sim"]).not.toBe("#c0392b");
  });
});
