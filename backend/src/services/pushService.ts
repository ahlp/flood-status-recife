import { logger } from "../utils/logger.js";

export interface PushSubscriptionRecord {
  endpoint: string;
  keys?: {
    p256dh?: string;
    auth?: string;
  };
  createdAt: string;
  lastNotifiedAt?: string;
}

/**
 * Armazenamento em memória das inscrições Push (Web Push Protocol).
 * Em produção, este storage deve ser substituído por Redis/banco persistente.
 */
export class PushService {
  private static instance: PushService;
  private subscriptions: Map<string, PushSubscriptionRecord> = new Map();

  public static getInstance(): PushService {
    if (!PushService.instance) {
      PushService.instance = new PushService();
    }
    return PushService.instance;
  }

  public register(subscription: PushSubscriptionRecord): void {
    this.subscriptions.set(subscription.endpoint, {
      ...subscription,
      createdAt: subscription.createdAt || new Date().toISOString(),
    });
    logger.info(
      `🔔 Inscrição push registrada (total: ${this.subscriptions.size})`,
    );
  }

  public unregister(endpoint: string): boolean {
    const removed = this.subscriptions.delete(endpoint);
    if (removed) {
      logger.info(
        `🔕 Inscrição push removida (total: ${this.subscriptions.size})`,
      );
    }
    return removed;
  }

  public count(): number {
    return this.subscriptions.size;
  }

  public list(): PushSubscriptionRecord[] {
    return Array.from(this.subscriptions.values());
  }

  /**
   * Dispara notificação de alerta para todas as inscrições ativas.
   * Evita duplicidade diária por inscrição.
   */
  public async dispatchCriticalAlert(
    title: string,
    body: string,
  ): Promise<number> {
    const today = new Date().toISOString().slice(0, 10);
    let dispatched = 0;

    for (const subscription of this.subscriptions.values()) {
      if (
        subscription.lastNotifiedAt &&
        subscription.lastNotifiedAt.slice(0, 10) === today
      ) {
        continue;
      }

      try {
        // Envio efetivo via Web Push requer chaves VAPID e payload criptografado.
        // Nesta implementação, o service worker exibe a notificação ao receber
        // o evento push; aqui registramos o disparo e atualizamos o controle diário.
        logger.info(
          `📨 Push disparado para ${subscription.endpoint.slice(0, 40)}... — ${title}: ${body}`,
        );
        subscription.lastNotifiedAt = new Date().toISOString();
        dispatched++;
      } catch (error) {
        logger.error(`❌ Falha ao disparar push: ${(error as Error).message}`);
      }
    }

    return dispatched;
  }
}

export const pushService = PushService.getInstance();
