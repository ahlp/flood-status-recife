import { describe, it, expect } from "vitest";
import {
  formatSnippet,
  SNIPPET_MIN_LENGTH,
  SNIPPET_MAX_LENGTH,
} from "../src/utils/rssSnippet.js";

describe("formatSnippet — contrato 200..400 caracteres", () => {
  it("complementa snippets curtos até o mínimo de 200 caracteres", () => {
    const short = "Maré alta e chuva forte.";
    const snippet = formatSnippet(short);
    expect(snippet.length).toBeGreaterThanOrEqual(SNIPPET_MIN_LENGTH);
    expect(snippet.length).toBeLessThanOrEqual(SNIPPET_MAX_LENGTH);
    expect(snippet.startsWith(short)).toBe(true);
  });

  it("não retorna snippet com menos de 200 caracteres mesmo para entrada vazia", () => {
    const snippet = formatSnippet("");
    expect(snippet.length).toBeGreaterThanOrEqual(SNIPPET_MIN_LENGTH);
    expect(snippet.length).toBeLessThanOrEqual(SNIPPET_MAX_LENGTH);
  });

  it("trunca snippets longos para no máximo 400 caracteres", () => {
    const long = "Alerta de alagamento. ".repeat(60);
    const snippet = formatSnippet(long);
    expect(snippet.length).toBeLessThanOrEqual(SNIPPET_MAX_LENGTH);
    expect(snippet.length).toBeGreaterThanOrEqual(SNIPPET_MIN_LENGTH);
    expect(snippet.endsWith("...")).toBe(true);
  });

  it("preserva snippets já dentro do intervalo", () => {
    const within = "A".repeat(250);
    expect(formatSnippet(within)).toBe(within);
  });
});
