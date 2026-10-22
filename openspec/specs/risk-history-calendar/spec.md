## Purpose

Provide citizens with a historical view of past daily decisions, presented as a monthly calendar with flood status badges, so they can understand risk patterns over time.

## Requirements

### Requirement: Endpoint de Histórico de Decisões

The system SHALL expose a public API endpoint `GET /api/decisions/history` that returns the recorded daily decisions for a given month.

#### Scenario: Consultar histórico do mês corrente

- **GIVEN** O backend registrou decisões diárias ao longo do mês
- **WHEN** O cliente chama `GET /api/decisions/history?month=2026-09`
- **THEN** O servidor responde 200 com um objeto contendo `month` e a lista `entries`
- **THEN** Cada entrada contém `date` (YYYY-MM-DD), `value` (SIM, NÃO ou ATENÇÃO), `riskScore` e `justification`
- **THEN** Se o parâmetro `month` estiver ausente, o mês corrente é utilizado
- **THEN** Um parâmetro `month` com formato inválido retorna 400 Bad Request

### Requirement: Registro Automático das Decisões

The system SHALL record each calculated daily decision in the history store, replacing any previous record for the same date.

#### Scenario: Decisão do dia registrada no histórico

- **GIVEN** Uma decisão diária é calculada ou servida pelo endpoint `/api/decision`
- **WHEN** O resultado é produzido
- **THEN** Uma entrada com a data do dia é adicionada ao histórico
- **THEN** Cálculos repetidos no mesmo dia sobrescrevem a entrada anterior

### Requirement: Página de Histórico com Calendário Mensal

The system SHALL provide a frontend route `/historico` displaying a monthly calendar of past decisions with status badges.

#### Scenario: Visualizar calendário de decisões passadas

- **GIVEN** O usuário navega para `/historico`
- **WHEN** A página carrega o histórico do mês
- **THEN** Um calendário mensal é exibido com os dias do mês em grade
- **THEN** Cada dia com decisão registrada exibe um selo de status: SIM (vermelho), ATENÇÃO (amarelo) ou NÃO (azul)
- **THEN** Dias sem decisão registrada são exibidos em cinza neutro
- **THEN** O usuário pode navegar entre meses anteriores e posteriores
