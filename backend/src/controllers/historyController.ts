import { Request, Response } from "express";
import { historyService } from "../services/historyService.js";
import { logger } from "../utils/logger.js";

const MONTH_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;

export class HistoryController {
  /**
   * GET /api/decisions/history?month=YYYY-MM
   * Retorna o histórico de decisões do mês informado (padrão: mês corrente).
   */
  public async getHistory(req: Request, res: Response): Promise<void> {
    const month =
      (req.query.month as string | undefined) ||
      new Date().toISOString().slice(0, 7);

    if (!MONTH_PATTERN.test(month)) {
      res.status(400).json({
        error: "Bad Request",
        message: "Parâmetro 'month' deve estar no formato YYYY-MM.",
      });
      return;
    }

    try {
      const entries = await historyService.getMonth(month);
      res.json({ month, entries });
    } catch (error) {
      logger.error(
        `Erro ao consultar histórico de decisões: ${(error as Error).message}`,
      );
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export const historyController = new HistoryController();
