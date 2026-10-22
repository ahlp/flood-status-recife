import { Request, Response } from "express";
import { cacheService } from "../services/cacheService.js";
import { riskEngineService } from "../services/riskEngine.js";
import { dataFetcherService } from "../services/dataFetcher.js";
import { logger } from "../utils/logger.js";
import { recordDecisionRequest } from "../utils/metrics.js";
import { DecisionResult } from "../types/index.js";
import { resolveCity, listSupportedCityIds } from "../config/cities.js";

export class DecisionController {
  /**
   * GET /api/decision
   * Retorna a decisão do dia com justificativa e fatores de risco
   */
  public async getDecision(req: Request, res: Response): Promise<void> {
    const cityParam = req.query.city as string | undefined;
    const city = resolveCity(cityParam);

    if (!city) {
      res.status(400).json({
        error: "Bad Request",
        message: `Cidade não suportada. Cidades disponíveis: ${listSupportedCityIds().join(", ")}.`,
      });
      return;
    }

    const todayDateStr = new Date().toISOString().slice(0, 10);
    const cacheKey = `feh:decision:${city.id}:${todayDateStr}`;

    recordDecisionRequest();

    try {
      // 1. Consulta Cache Redis (ou in-memory)
      const cached = await cacheService.get<DecisionResult>(cacheKey);
      if (cached) {
        logger.info(
          `⚡ Decisão diária [${city.id}] servida do cache [${cached.value}] - Risco: ${cached.riskScore}%`,
        );
        res.json(cached);
        return;
      }

      // 2. Se não estiver em cache, executa inferência em tempo de execução
      logger.info(
        `🔍 Decisão [${city.id}] não encontrada em cache. Executando avaliação...`,
      );
      const result = await riskEngineService.evaluateCurrentStatus(
        undefined,
        city,
      );

      // 3. Salva no cache com TTL de 24h (86400s)
      await cacheService.set(cacheKey, result, 86400);

      res.json(result);
    } catch (error) {
      logger.error(
        `❌ Falha ao processar decisão [${city.id}]: ${(error as Error).message}`,
      );
      // Fallback estático seguro (RF-04 / US-07)
      const fallback = {
        ...riskEngineService.getStaticFallbackResult(),
        city: city.id,
        cityName: city.name,
      };
      res.json(fallback);
    }
  }

  /**
   * GET /api/location
   * Identifica vias críticas próximas com base em IP ou coordenadas
   */
  public async getLocationInfo(req: Request, res: Response): Promise<void> {
    try {
      const clientIp =
        (req.headers["x-forwarded-for"] as string)?.split(",")[0] ||
        req.socket.remoteAddress ||
        "127.0.0.1";
      const roads = dataFetcherService.getCriticalRoads();

      // Simulação ou busca de via crítica mais próxima
      const defaultRoad = roads[0]; // Av. Governador Agamenon Magalhães

      res.json({
        ip: clientIp,
        city: "Recife",
        state: "PE",
        region: "Pernambuco",
        country: "Brasil",
        nearestCriticalRoad: defaultRoad,
        criticalRoads: roads,
      });
    } catch (error) {
      logger.warn(`Erro na geolocalização: ${(error as Error).message}`);
      res.json({
        city: "Recife",
        state: "PE",
        nearestCriticalRoad: dataFetcherService.getCriticalRoads()[0],
        criticalRoads: dataFetcherService.getCriticalRoads(),
      });
    }
  }

  /**
   * POST /api/webhook/notify
   * Webhook para integração opcional com parceiros (ex.: transporte público)
   */
  public async postWebhookNotify(req: Request, res: Response): Promise<void> {
    const payload = req.body;
    logger.info(
      `📡 Webhook de notificação recebido: ${JSON.stringify(payload)}`,
    );

    res.json({
      success: true,
      receivedAt: new Date().toISOString(),
      message: "Notificação de status registrada com sucesso.",
    });
  }
}

export const decisionController = new DecisionController();
