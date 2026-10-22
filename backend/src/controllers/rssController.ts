import { Request, Response } from "express";
import { rssService } from "../services/rssService.js";
import { riskEngineService } from "../services/riskEngine.js";
import { logger } from "../utils/logger.js";

export class RSSController {
  public async getRss(req: Request, res: Response): Promise<void> {
    try {
      const xml = await rssService.getRssXml();
      res.set("Content-Type", "application/rss+xml; charset=utf-8");
      res.send(xml);
    } catch (error) {
      logger.error(`Erro ao gerar feed RSS: ${(error as Error).message}`);
      const fallbackDecision = riskEngineService.getStaticFallbackResult();
      const fallbackXml = rssService.buildRssXml(fallbackDecision);
      res.set("Content-Type", "application/rss+xml; charset=utf-8");
      res.send(fallbackXml);
    }
  }

  public async getLatestRss(req: Request, res: Response): Promise<void> {
    try {
      const item = await rssService.getLatestItemJson();
      res.json(item);
    } catch (error) {
      logger.error(
        `Erro ao recuperar último item RSS: ${(error as Error).message}`,
      );
      const fallbackDecision = riskEngineService.getStaticFallbackResult();
      const fallbackItem = await rssService.getLatestItemJson(fallbackDecision);
      res.json(fallbackItem);
    }
  }
}

export const rssController = new RSSController();
