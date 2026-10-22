import { cacheService } from "./cacheService.js";
import { DecisionResult, DecisionValue } from "../types/index.js";
import { logger } from "../utils/logger.js";

export interface DecisionHistoryEntry {
  date: string; // YYYY-MM-DD
  value: DecisionValue;
  riskScore: number;
  justification: string;
}

const HISTORY_TTL_SECONDS = 90 * 24 * 60 * 60; // 90 dias
const MONTH_KEY_PREFIX = "feh:history:";

export class HistoryService {
  private monthKey(month: string): string {
    return `${MONTH_KEY_PREFIX}${month}`;
  }

  /**
   * Registra a decisão do dia no histórico (sobrescreve o mesmo dia).
   */
  public async record(result: DecisionResult): Promise<void> {
    try {
      const date = (result.calculatedAt || new Date().toISOString()).slice(
        0,
        10,
      );
      const month = date.slice(0, 7);
      const key = this.monthKey(month);

      const existing =
        (await cacheService.get<DecisionHistoryEntry[]>(key)) || [];
      const filtered = existing.filter((entry) => entry.date !== date);
      filtered.push({
        date,
        value: result.value,
        riskScore: result.riskScore,
        justification: result.justification,
      });
      filtered.sort((a, b) => a.date.localeCompare(b.date));

      await cacheService.set(key, filtered, HISTORY_TTL_SECONDS);
    } catch (error) {
      logger.warn(
        `Falha ao registrar histórico de decisão: ${(error as Error).message}`,
      );
    }
  }

  public async getMonth(month: string): Promise<DecisionHistoryEntry[]> {
    const entries =
      (await cacheService.get<DecisionHistoryEntry[]>(this.monthKey(month))) ||
      [];
    return entries.sort((a, b) => a.date.localeCompare(b.date));
  }
}

export const historyService = new HistoryService();
