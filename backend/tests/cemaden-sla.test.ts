import { describe, it, expect } from "vitest";
import { CEMADEN_SLA } from "../src/config/sla.js";

describe("SLA canônico do CEMADEN (Caso 25)", () => {
  it("permite no máximo 2 tentativas", () => {
    expect(CEMADEN_SLA.maxAttempts).toBe(2);
  });

  it("usa timeout de 2500ms por tentativa", () => {
    expect(CEMADEN_SLA.timeoutMs).toBe(2500);
  });
});
