## Purpose

Deliver daily static RSS 2.0 XML feeds and a dedicated minimalist view for citizens and integration tools (Slack, Discord, feed readers).

## Requirements

### Requirement: Exibir Último Item do Feed RSS

The system SHALL present the latest published daily RSS item on a dedicated page with full title, secure external link and justification snippet. The snippet SHALL always contain between 200 and 400 characters; shorter texts SHALL be complemented with operational context and longer texts SHALL be truncated at a word boundary.

#### Scenario: Verificar exibição correta do título, link e snippet da justificativa

- **GIVEN** A aplicação está em execução no ambiente de produção
- **WHEN** O usuário navega até a página dedicada ao último item do feed RSS (/rss)
- **THEN** A página exibe o título completo do último artigo publicado na fonte de dados RSS
- **THEN** O link exibido corresponde exatamente à URL do artigo original e abre em uma nova aba quando clicado com rel="noopener noreferrer"
- **THEN** Um snippet da justificativa, contendo no mínimo 200 caracteres e máximo 400 caracteres, é mostrado abaixo do título
- **THEN** A estrutura visual segue um estilo minimalista com fundo branco e ícone RSS visível no cabeçalho

### Requirement: Download do Arquivo XML RSS

The system SHALL allow users to download the complete XML feed file with proper attachment headers.

#### Scenario: Botão Download RSS funcional

- **GIVEN** O usuário está na página /rss
- **WHEN** O usuário clica no botão "Download RSS"
- **THEN** Inicia download automático do arquivo XML (.xml) com nome rss-YYYYMMDD.xml
