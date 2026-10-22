export const SNIPPET_MIN_LENGTH = 200;
export const SNIPPET_MAX_LENGTH = 400;

const SUPPLEMENT =
  " Este resumo é gerado automaticamente pelo algoritmo preditivo com base nas condições meteorológicas, de maré e fluviométricas monitoradas na Região Metropolitana do Recife, incluindo rios, vias críticas e previsões de chuva para a manhã.";

/**
 * Normaliza o snippet da justificativa para o intervalo [200, 400] caracteres.
 * - Textos curtos são complementados com contexto operacional.
 * - Textos longos são truncados em limite de palavra (com reticências).
 */
export function formatSnippet(desc: string): string {
  const base = (desc || "").trim();

  if (base.length < SNIPPET_MIN_LENGTH) {
    let result = base;
    while (result.length < SNIPPET_MIN_LENGTH) {
      result += SUPPLEMENT;
    }
    if (result.length > SNIPPET_MAX_LENGTH) {
      result = result.slice(0, SNIPPET_MAX_LENGTH);
    }
    return result;
  }

  if (base.length <= SNIPPET_MAX_LENGTH) {
    return base;
  }

  const cut = base.slice(0, SNIPPET_MAX_LENGTH - 3);
  const lastSpace = cut.lastIndexOf(" ");
  const truncated =
    lastSpace >= SNIPPET_MIN_LENGTH ? cut.slice(0, lastSpace) : cut;
  return `${truncated}...`;
}
