/**
 * URL base pública do feed RSS (lida de configuração de ambiente).
 * O valor padrão é um endereço local/mock; em produção, definir
 * RSS_FEED_URL com o domínio público real.
 */
export function getRssFeedUrl(): string {
  return process.env.RSS_FEED_URL || "http://localhost:3000";
}
