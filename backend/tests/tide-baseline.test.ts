import { describe, it, expect } from "vitest";
import {
  TIDE_PEAK_WINDOW,
  TIDE_CRITICAL_WINDOW,
  TIDE_CRITICAL_HEIGHT_METERS,
  TIDE_ZH_OFFSET_METERS,
} from "../src/services/dataFetcher.js";

describe("Baseline canônico de maré (Caso 23)", () => {
  it("janela de busca do pico é 04h–11h", () => {
    expect(TIDE_PEAK_WINDOW).toEqual({ startHour: 4, endHour: 11 });
  });

  it("janela crítica é 06h–10h", () => {
    expect(TIDE_CRITICAL_WINDOW).toEqual({ startHour: 6, endHour: 10 });
  });

  it("limiar crítico é 1.90m", () => {
    expect(TIDE_CRITICAL_HEIGHT_METERS).toBe(1.9);
  });

  it("offset do Zero Hidrográfico é +1.35m", () => {
    expect(TIDE_ZH_OFFSET_METERS).toBe(1.35);
  });
});
