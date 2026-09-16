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
    const logs = getInMemoryLogs({
      date: typeof date === "string" ? date : undefined,
      level: typeof level === "string" ? level : undefined,
    });

    res.json({
      success: true,
      count: logs.length,
      logs,
    });
  }
}

export const metricsController = new MetricsController();
