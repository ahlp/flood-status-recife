import { create } from "xmlbuilder2";
import { DecisionResult, RSSFeedItem } from "../types/index.js";
import { cacheService } from "./cacheService.js";
import { logger } from "../utils/logger.js";

export class RSSService {
  private static readonly RSS_CACHE_KEY = "feh:rss:latest";
  private static readonly RSS_JSON_CACHE_KEY = "feh:rss:latest_json";

  /**
   * Constrói o feed RSS 2.0 a partir da decisão do dia
   */
  public buildRssXml(decision: DecisionResult): string {
    const pubDate = new Date(decision.calculatedAt).toUTCString();
    const todayDateStr = new Date(decision.calculatedAt)
      .toISOString()
      .slice(0, 10);
    const title = `Decisão do dia: Ficar em casa? ${decision.value}`;
    const link = "https://ficoemcasa.com.br/";
    const guid = `feh-decision-${todayDateStr}`;
    const description = decision.extendedDescription;

    const doc = create({ version: "1.0", encoding: "UTF-8" })
      .ele("rss", {
        version: "2.0",
        "xmlns:atom": "http://www.w3.org/2005/Atom",
      })
      .ele("channel")
      .ele("title")
      .txt("Fico em Casa Hoje? - Alertas de Alagamento Recife")
      .up()
      .ele("link")
      .txt(link)
      .up()
      .ele("description")
      .txt(
        "Feed diário matinal de monitoramento e previsão de risco de ilhamento urbano no Recife e RMR.",
      )
      .up()
      .ele("language")
      .txt("pt-BR")
      .up()
      .ele("lastBuildDate")
      .txt(pubDate)
      .up()
      .ele("atom:link", {
        href: `${link}api/rss`,
        rel: "self",
        type: "application/rss+xml",
      })
      .up()
      .ele("item")
      .ele("title")
      .txt(title)
      .up()
      .ele("link")
      .txt(link)
      .up()
      .ele("guid", { isPermaLink: "false" })
      .txt(guid)
      .up()
      .ele("pubDate")
      .txt(pubDate)
      .up()
      .ele("description")
      .txt(description)
      .up()
      .up()
      .up();

    return doc.end({ prettyPrint: true });
  }

  /**
   * Gera e armazena o RSS em cache
   */
  public async generateAndCacheRss(decision: DecisionResult): Promise<string> {
    const xml = this.buildRssXml(decision);
    const todayDateStr = new Date(decision.calculatedAt)
      .toISOString()
      .slice(0, 10);

    const jsonItem: RSSFeedItem = {
      title: `Decisão do dia: Ficar em casa? ${decision.value}`,
      link: "https://ficoemcasa.com.br/",
      pubDate: new Date(decision.calculatedAt).toUTCString(),
      description: decision.extendedDescription,
      guid: `feh-decision-${todayDateStr}`,
    };

    await cacheService.set(RSSService.RSS_CACHE_KEY, xml, 86400);
    await cacheService.set(RSSService.RSS_JSON_CACHE_KEY, jsonItem, 86400);

    logger.info("📡 Feed RSS gerado e gravado no cache com sucesso.");
    return xml;
  }

  /**
   * Retorna o XML do feed mais recente (ou gera se não existir)
   */
  public async getRssXml(fallbackDecision?: DecisionResult): Promise<string> {
    const cachedXml = await cacheService.get<string>(RSSService.RSS_CACHE_KEY);
    if (cachedXml) return cachedXml;

    if (fallbackDecision) {
      return await this.generateAndCacheRss(fallbackDecision);
    }

    // Default básico
    const today = new Date().toISOString().slice(0, 10);
    return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Fico em Casa Hoje?</title><link>https://ficoemcasa.com.br/</link><description>Feed diário</description><item><title>Decisão do dia: Ficar em casa? NÃO</title><link>https://ficoemcasa.com.br/</link><guid>feh-${today}</guid><description>Maré baixa e chuva fraca. Vias transitáveis.</description></item></channel></rss>`;
  }

  /**
   * Retorna os dados JSON do último item do feed
   */
  public async getLatestItemJson(
    fallbackDecision?: DecisionResult,
  ): Promise<RSSFeedItem> {
    const cached = await cacheService.get<RSSFeedItem>(
      RSSService.RSS_JSON_CACHE_KEY,
    );
    if (cached) return cached;

    if (fallbackDecision) {
      await this.generateAndCacheRss(fallbackDecision);
      const updated = await cacheService.get<RSSFeedItem>(
        RSSService.RSS_JSON_CACHE_KEY,
      );
      if (updated) return updated;
    }

    const today = new Date().toISOString().slice(0, 10);
    return {
      title: "Decisão do dia: Ficar em casa? NÃO",
      link: "https://ficoemcasa.com.br/",
      pubDate: new Date().toUTCString(),
      description:
        "Maré baixa e chuva fraca prevista no início da manhã. Trânsito seguro sem pontos críticos de retenção na Região Metropolitana do Recife.",
      guid: `feh-decision-${today}`,
    };
  }

  /**
   * Gera o nome de download formato rss-YYYYMMDD.xml
   */
  public getDownloadFileName(): string {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    return `rss-${yyyy}${mm}${dd}.xml`;
  }
}

export const rssService = new RSSService();
