## Purpose

Guarantee high availability and graceful error handling via a neutral static fallback screen when external open data APIs are unavailable.

## Requirements

### Requirement: Exibir Página de Contingência Estática

The system SHALL display an accessible, neutral contingency screen informing users when upstream data sources fail.

#### Scenario: Página exibe mensagem padrão quando fonte externa falha

- **GIVEN** O usuário acessa a aplicação e as fontes externas estão indisponíveis
- **WHEN** A aplicação detecta falha irrecuperável nas requisições
- **THEN** A aplicação renderiza a página de contingência com o texto centralizado "Não foi possível obter dados hoje. Por favor, tente novamente amanhã."
- **THEN** O layout tem fundo neutro (#f5f5f5) e contraste 4.5:1 conforme WCAG 2.1 AA
- **THEN** A mensagem permanece no centro vertical e horizontal da tela sem elementos de alarme falso

### Requirement: Botão de Recarga Tentar Novamente

The system SHALL provide a reload button allowing users to retry fetching fresh data without relying on browser navigation controls.

#### Scenario: Recarregar a aplicação via botão Tentar Novamente

- **GIVEN** O usuário está visualizando a tela de contingência
- **WHEN** O usuário clica no botão "Tentar Novamente" ou pressiona Enter com o botão focado
- **THEN** A página executa a recarga da aplicação para tentar recuperar os dados atualizados
