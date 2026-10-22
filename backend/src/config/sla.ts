/**
 * Política canônica de SLA e tolerância a falhas para integrações externas.
 * Fonte da verdade compartilhada entre especificação e implementação.
 */
export interface ServiceSla {
  maxAttempts: number;
  timeoutMs: number;
}

export const CEMADEN_SLA: ServiceSla = {
  maxAttempts: 2,
  timeoutMs: 2500,
};

export const OPEN_METEO_SLA: ServiceSla = {
  maxAttempts: 3,
  timeoutMs: 5000,
};

export const OPEN_METEO_MARINE_SLA: ServiceSla = {
  maxAttempts: 3,
  timeoutMs: 5000,
};
