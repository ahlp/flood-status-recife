import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";

vi.mock("../src/services/api.js", () => ({
  fetchLatestRss: vi.fn().mockResolvedValue({
    title: "Decisão do dia: Ficar em casa? SIM",
    link: "https://ficoemcasa.com.br/decisao",
    pubDate: new Date().toISOString(),
    description:
      "Alerta de risco elevado de alagamento nas principais vias do Recife. ".repeat(
        5,
      ),
    guid: "feh-test-guid",
  }),
  downloadRssXml: vi.fn(),
}));

import { RSSView } from "../src/pages/RSSView.js";

describe("RSSView — Segurança do link externo", () => {
  beforeAll(() => {
    // Garante ambiente de clipboard disponível para o componente
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: vi.fn() },
      configurable: true,
    });
  });

  it("link externo abre em nova aba com rel=noopener noreferrer", async () => {
    render(
      <MemoryRouter>
        <RSSView />
      </MemoryRouter>,
    );

    const link = await screen.findByRole("link", {
      name: /Acessar página de decisão/i,
    });

    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toBe("noopener noreferrer");
  });
});
