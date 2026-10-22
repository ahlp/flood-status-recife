import { Request, Response } from "express";
import { pushService } from "../services/pushService.js";
import { logger } from "../utils/logger.js";

export class PushController {
  /**
   * POST /api/push/register
   * Persiste a inscrição PushSubscription enviada pelo navegador.
   */
  public register(req: Request, res: Response): void {
    const { endpoint, keys } = req.body || {};

    if (!endpoint || typeof endpoint !== "string") {
      res.status(400).json({
        error: "Bad Request",
        message: "Campo 'endpoint' é obrigatório.",
      });
      return;
    }

    pushService.register({
      endpoint,
      keys,
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({ success: true, subscriptions: pushService.count() });
  }

  /**
   * DELETE /api/push/register
   * Remove uma inscrição previamente registrada.
   */
  public unregister(req: Request, res: Response): void {
    const endpoint =
      (req.body && req.body.endpoint) ||
      (req.query.endpoint as string | undefined);

    if (!endpoint) {
      res.status(400).json({
        error: "Bad Request",
        message: "Campo 'endpoint' é obrigatório.",
      });
      return;
    }

    pushService.unregister(endpoint);
    res.json({ success: true, subscriptions: pushService.count() });
  }

  /**
   * GET /api/push/status
   * Retorna a quantidade de inscrições ativas (útil para monitoramento).
   */
  public status(_req: Request, res: Response): void {
    res.json({ subscriptions: pushService.count() });
  }

  /**
   * POST /api/push/test
   * Dispara um alerta de teste para todas as inscrições.
   */
  public async test(_req: Request, res: Response): Promise<void> {
    try {
      const dispatched = await pushService.dispatchCriticalAlert(
        "Alerta de alagamento",
        "Notificação de teste do Fico em Casa Hoje?",
      );
      res.json({ success: true, dispatched });
    } catch (error) {
      logger.error(
        `Erro ao disparar push de teste: ${(error as Error).message}`,
      );
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export const pushController = new PushController();
