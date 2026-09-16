import cron from 'node-cron';
import { logger } from '../utils/logger.js';
import { riskEngineService } from './riskEngine.js';
import { cacheService } from './cacheService.js';
import { rssService } from './rssService.js';

export class SchedulerService {
  private cronJob: cron.ScheduledTask | null = null;

  public start(): void {
    // 05h30 no fuso de Recife (UTC-3). Formato cron: "30 5 * * *"
    const schedule = process.env.CRON_SCHEDULE || '30 5 * * *';

    logger.info(`⏰ Inicializando agendador matinal cron: [${schedule}]`);

    this.cronJob = cron.schedule(
      schedule,
      async () => {
        logger.info('🌅 Disparando rotina matinal diária de coleta e inferência preditiva (05h30)...');
        await this.runDailyEvaluation();
      },
      {
        timezone: 'America/Recife'
      }
    );
  }

  public async runDailyEvaluation(): Promise<void> {
    try {
      const result = await riskEngineService.evaluateCurrentStatus();
      const todayDateStr = new Date().toISOString().slice(0, 10);
      const cacheKey = `feh:decision:${todayDateStr}`;

      await cacheService.set(cacheKey, result, 86400); // 24 horas TTL
      await rssService.generateAndCacheRss(result);

      logger.info(
        `✅ Inferência diária concluída com sucesso! Decisão: [${result.value}] - Risco: ${result.riskScore}%`
      );
    } catch (error) {
      logger.error(`❌ Erro durante inferência diária agendada: ${(error as Error).message}`);
    }
  }

  public stop(): void {
    if (this.cronJob) {
      this.cronJob.stop();
      logger.info('🛑 Agendador cron finalizado.');
    }
  }
}

export const schedulerService = new SchedulerService();
