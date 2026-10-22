## Purpose

Provide instant daily decision display (SIM or NÃO) regarding urban flooding and mobility risk in Recife and the metropolitan region, applying reactive visual themes.

Visual identity tokens are canonical and must not diverge between specification and code: `decision-sim` = #ff4d00 (SIM), `decision-nao` = #3498db (NÃO). The legacy `#c0392b` red is reserved for accent/error usage and must not be used as the SIM base color.

## Requirements

### Requirement: Exibir Decisão do Dia Centralizada

The system SHALL display the daily decision ("SIM" or "NÃO") calculated by the predictive risk engine in prominent typography (48px+) centered on screen without requiring login.

#### Scenario: Decisão SIM exibida corretamente com tema alerta

- **GIVEN** Usuário acessa a página sem parâmetros de consulta
- **WHEN** A API interna retorna decisão "SIM" e justificativa curta
- **THEN** Página exibe texto "SIM" em fonte 48px centralizado
- **THEN** Tema da página tem cor base #ff4d00 (alerta) — identidade canônica única da decisão SIM
- **THEN** Transição CSS de 0.3s ocorre ao carregar a página

#### Scenario: Decisão NÃO exibida corretamente com tema azul neutro

- **GIVEN** Usuário acessa a página sem parâmetros
- **WHEN** A API interna retorna decisão "NÃO" e justificativa curta
- **THEN** Página exibe texto "NÃO" em fonte 48px centralizado
- **THEN** Tema da página tem cor base #3498db (azul neutro)
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
