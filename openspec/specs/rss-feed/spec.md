## Purpose

Deliver daily static RSS 2.0 XML feeds and a dedicated minimalist view for citizens and integration tools (Slack, Discord, feed readers).

> **Nota de depreciação:** o download do feed como arquivo anexo `.xml` foi descontinuado. O feed deve ser consumido diretamente pela URL pública (`/api/rss`).

## Requirements

### Requirement: Exibir Último Item do Feed RSS

The system SHALL present the latest published daily RSS item on a dedicated page with full title, secure external link and justification snippet.

#### Scenario: Verificar exibição correta do título, link e snippet da justificativa

- **GIVEN** A aplicação está em execução no ambiente de produção
- **WHEN** O usuário navega até a página dedicada ao último item do feed RSS (/rss)
- **THEN** A página exibe o título completo do último artigo publicado na fonte de dados RSS
- **THEN** O link exibido corresponde exatamente à URL do artigo original e abre em uma nova aba quando clicado com rel="noopener noreferrer"
- **THEN** Um snippet da justificativa, contendo no mínimo 200 caracteres e máximo 400 caracteres, é mostrado abaixo do título
- **THEN** A estrutura visual segue um estilo minimalista com fundo branco e ícone RSS visível no cabeçalho

### Requirement: Consumo Direto do Feed por URL

The system SHALL expose the RSS feed only through the public reading endpoints (`/rss` and `/api/rss`), without an attachment download endpoint.

#### Scenario: Feed consumido diretamente pela URL

- **GIVEN** O usuário ou integrador deseja obter o feed
- **WHEN** Acessa a URL pública do feed
- **THEN** O conteúdo XML é retornado para leitura direta
- **THEN** O endpoint de download `/api/rss/download` não existe e responde 404
