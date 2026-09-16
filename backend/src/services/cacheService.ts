import { Redis } from 'ioredis';
import { logger } from '../utils/logger.js';

export class CacheService {
  private redis: Redis | null = null;
  private inMemoryFallback: Map<string, { value: string; expiresAt: number }> = new Map();
  private isConnected = false;

  constructor() {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    try {
      this.redis = new Redis(redisUrl, {
        lazyConnect: true,
        maxRetriesPerRequest: 1,
        retryStrategy: () => null // Não travar o servidor caso Redis esteja offline
      });

      this.redis.connect()
        .then(() => {
          this.isConnected = true;
          logger.info(' Conectado ao Redis ElastiCache com sucesso.');
        })
        .catch((err) => {
          this.isConnected = false;
          logger.warn(`⚠️ Redis não disponível (${err.message}). Utilizando cache em memória (fallback).`);
        });

      this.redis.on('error', (err) => {
        if (this.isConnected) {
          logger.warn(`Aviso de conexão Redis: ${err.message}`);
        }
        this.isConnected = false;
      });
    } catch {
      this.isConnected = false;
      logger.warn('⚠️ Falha ao inicializar cliente Redis. Utilizando cache in-memory.');
    }
  }

  public async get<T>(key: string): Promise<T | null> {
    if (this.isConnected && this.redis) {
      try {
        const raw = await this.redis.get(key);
        if (raw) return JSON.parse(raw) as T;
      } catch (err) {
        logger.warn(`Erro na leitura do Redis (${(err as Error).message}), recorrendo à memória.`);
      }
    }

    // Fallback memória
    const item = this.inMemoryFallback.get(key);
    if (item) {
      if (Date.now() < item.expiresAt) {
        return JSON.parse(item.value) as T;
      }
      this.inMemoryFallback.delete(key);
    }
    return null;
  }

  public async set(key: string, value: unknown, ttlSeconds = 86400): Promise<void> {
    const serialized = JSON.stringify(value);

    if (this.isConnected && this.redis) {
      try {
        await this.redis.set(key, serialized, 'EX', ttlSeconds);
      } catch (err) {
        logger.warn(`Erro na gravação do Redis (${(err as Error).message}), salvando em memória.`);
      }
    }

    // Grava também no fallback local
    this.inMemoryFallback.set(key, {
      value: serialized,
      expiresAt: Date.now() + ttlSeconds * 1000
    });
  }

  public async delete(key: string): Promise<void> {
    if (this.isConnected && this.redis) {
      try {
        await this.redis.del(key);
      } catch {
        // Ignora
      }
    }
    this.inMemoryFallback.delete(key);
  }
}

export const cacheService = new CacheService();
