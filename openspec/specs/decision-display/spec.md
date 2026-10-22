## Purpose

Provide instant daily decision display (SIM or NÃO) regarding urban flooding and mobility risk in Recife and the metropolitan region, applying reactive visual themes.

## Requirements

### Requirement: Exibir Decisão do Dia Centralizada

The system SHALL display the daily decision ("SIM" or "NÃO") calculated by the predictive risk engine in prominent typography (48px+) centered on screen without requiring login.

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

### Requirement: Definição Canônica da Janela e Limiar de Maré Crítica

The tide evaluation SHALL follow a single canonical baseline shared by specification and implementation: peak search window from 04:00 to 11:00, critical window from 06:00 to 10:00, critical height at or above 1.90m (Zero Hidrográfico reference), and a +1.35m ZH offset applied to the Open-Meteo Marine Mean Sea Level values.

#### Scenario: Maré é considerada crítica somente na janela canônica

- **GIVEN** Os dados horários de maré do dia estão disponíveis
- **WHEN** O pico de maré é calculado entre 04:00 e 11:00
- **THEN** A maré só é marcada como crítica se o pico entre 06:00 e 10:00 for maior ou igual a 1.90m
- **THEN** A altura informada usa o referencial do Zero Hidrográfico com offset de +1.35m
- **THEN** Nenhuma regra concorrente de janela ou limiar é aplicada

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
