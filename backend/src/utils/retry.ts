import { logger } from "./logger.js";

export interface RetryOptions {
  maxRetries?: number;
  initialDelayMs?: number;
  factor?: number;
  serviceName?: string;
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {},
): Promise<T> {
  const maxRetries = options.maxRetries ?? 3;
  const initialDelayMs = options.initialDelayMs ?? 500;
  const factor = options.factor ?? 2;
  const serviceName = options.serviceName ?? "ExternalService";

  let lastError: unknown;
  let delay = initialDelayMs;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const errorMsg = error instanceof Error ? error.message : String(error);
      logger.warn(
        `[${serviceName}] Falha na tentativa ${attempt}/${maxRetries}: ${errorMsg}`,
      );

      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= factor;
      }
    }
  }

  throw lastError;
}
