import { Request, Response } from "express";
import {
  getLatencyTimeSeries,
  getSuccessFailureStats,
  getDailyDecisionsHistory,
} from "../utils/metrics.js";
import { getInMemoryLogs } from "../utils/logger.js";

export class MetricsController {
  public getLatency(req: Request, res: Response): void {
    const data = getLatencyTimeSeries();
    res.json({
      success: true,
      data,
      count: data.length,
    });
  }

  public getSuccessFailure(req: Request, res: Response): void {
    const data = getSuccessFailureStats();
    res.json({
      success: true,
      data,
    });
  }

  public getDailyDecisions(req: Request, res: Response): void {
    const data = getDailyDecisionsHistory();
    res.json({
      success: true,
      data,
      count: data.length,
    });
  }

  public getLogs(req: Request, res: Response): void {
    const { date, level } = req.query;

    let normalizedDate: string | undefined;
    if (typeof date === "string" && date.length > 0) {
      normalizedDate = this.normalizeIsoDate(date);
      if (!normalizedDate) {
        res.status(400).json({
          error: "Bad Request",
          message: "Parâmetro 'date' deve estar no formato ISO YYYY-MM-DD.",
        });
        return;
      }
    }

    const logs = getInMemoryLogs({
      date: normalizedDate,
      level: typeof level === "string" ? level : undefined,
    });

    res.json({
      success: true,
      count: logs.length,
      logs,
    });
  }

  /**
   * Normaliza datas para ISO (YYYY-MM-DD).
   * Aceita ISO diretamente e converte o formato legado DD/MM/YYYY.
   */
  private normalizeIsoDate(value: string): string | undefined {
    if (/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(value)) {
      return value;
    }

    const legacy = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (legacy) {
      const [, dd, mm, yyyy] = legacy;
      return `${yyyy}-${mm}-${dd}`;
    }

    return undefined;
  }
}

export const metricsController = new MetricsController();
