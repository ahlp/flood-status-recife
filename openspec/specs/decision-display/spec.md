## Purpose

Provide instant daily decision display (SIM or NÃO) regarding urban flooding and mobility risk in Recife and the metropolitan region, applying reactive visual themes.

## Requirements

### Requirement: Exibir Decisão do Dia Centralizada

The system SHALL display the daily decision ("SIM", "NÃO" or "ATENÇÃO") calculated by the predictive risk engine in prominent typography (48px+) centered on screen without requiring login. The "ATENÇÃO" state SHALL apply when the risk score is between 50% and 65%.

#### Scenario: Decisão SIM exibida corretamente com tema alerta

- **GIVEN** Usuário acessa a página sem parâmetros de consulta
- **WHEN** A API interna retorna decisão "SIM" e justificativa curta
- **THEN** Página exibe texto "SIM" em fonte 48px centralizado
- **THEN** Tema da página tem cor base #ff4d00 (alerta) ou #c0392b (vermelho)
- **THEN** Transição CSS de 0.3s ocorre ao carregar a página

#### Scenario: Decisão NÃO exibida corretamente com tema azul neutro

- **GIVEN** Usuário acessa a página sem parâmetros
- **WHEN** A API interna retorna decisão "NÃO" e justificativa curta
- **THEN** Página exibe texto "NÃO" em fonte 48px centralizado
- **THEN** Tema da página tem cor base #3498db (azul neutro)
- **THEN** Transição CSS de 0.3s ocorre ao carregar a página

#### Scenario: Decisão ATENÇÃO exibida corretamente com tema amarelo

- **GIVEN** Usuário acessa a página sem parâmetros
- **WHEN** A API interna retorna decisão "ATENÇÃO" (risco entre 50% e 65%)
- **THEN** Página exibe texto "ATENÇÃO" em fonte 48px centralizado
- **THEN** Tema da página tem cor base #f39c12 (amarelo)
- **THEN** Transição CSS de 0.3s ocorre ao carregar a página

### Requirement: Exibir Justificativa Curta Contextual

The system SHALL display a concise justification (at most 90 characters) below the decision explaining the critical risk factors.

#### Scenario: Justificativa curta exibida abaixo da decisão

- **GIVEN** A API retorna justificativa "Pico de maré de 2.2m às 07h30 alinhado a 35mm de chuva"
- **WHEN** Página renderiza decisão
- **THEN** Texto abaixo do título tem tamanho 18px e não excede 90 caracteres
- **THEN** Centralizado horizontalmente

### Requirement: Navegação para Feed RSS

The system SHALL provide an accessible RSS icon in the header that routes to the dedicated RSS view.

#### Scenario: Ícone RSS redireciona para /rss

- **GIVEN** Usuário clica no ícone RSS
- **WHEN** Evento click é disparado
- **THEN** Navega para URL "/rss" sem recarregar a página
