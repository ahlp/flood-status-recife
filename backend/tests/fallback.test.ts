import { describe, it, expect, vi, afterEach } from "vitest";
import request from "supertest";
import { app } from "../src/server.js";
import { riskEngineService } from "../src/services/riskEngine.js";

describe("Fallback de alta disponibilidade (Caso 16)", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("GET /api/decision responde 200 com isFallback=true quando a inferência falha", async () => {
    vi.spyOn(riskEngineService, "evaluateCurrentStatus").mockRejectedValueOnce(
      new Error("Falha simulada na coleta de dados externos"),
    );

    const res = await request(app).get("/api/decision?city=recife");

    expect(res.status).toBe(200);
    expect(res.body.isFallback).toBe(true);
    expect(typeof res.body.justification).toBe("string");
    expect(res.body.factors).toBeDefined();
  });
});
