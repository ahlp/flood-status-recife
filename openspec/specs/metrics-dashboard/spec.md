## Purpose

Provide an internal operational monitoring dashboard with latency metrics, reliability indicators, request volume history and filterable structured logs.

## Requirements

### Requirement: Exibir Métricas de Latência das Chamadas Externas

The system SHALL display time-series charts showing latency in milliseconds for Open-Meteo, Marinha do Brasil and CEMADEN/APAC over the last 24 hours.

#### Scenario: Exibir métricas de latência das chamadas externas

- **GIVEN** O sistema está em produção e o endpoint /dashboard está acessível via HTTPS
- **WHEN** Um usuário autenticado com token JWT válido navega para a URL /dashboard
- **THEN** A página carrega em menos que 2 segundos
- **THEN** Os gráficos de latência mostram valores reais dos últimos 24h para Open-Meteo, Marinha e CEMADEN
- **THEN** Cada gráfico exibe título, eixo X (tempo) e eixo Y (latência ms) com legendas claras

### Requirement: Contrato de Dados de Latência em Milissegundos

The latency API SHALL expose latency values in milliseconds, using the fields `openMeteo`, `marinha` and `cemaden` in each data point.

#### Scenario: API retorna latência em milissegundos

- **GIVEN** O usuário autenticado consulta `GET /api/metrics/latency`
- **WHEN** A resposta é serializada
- **THEN** Cada ponto contém os campos `openMeteo`, `marinha` e `cemaden`
- **THEN** Os valores são expressos em milissegundos (não em segundos)
- **THEN** O campo legado `latency_sec` não é utilizado

### Requirement: Mostrar Taxa de Sucesso vs Falha por Fonte

The system SHALL present success vs. failure rates for each external open data integration.

#### Scenario: Mostrar taxa de sucesso vs falha por fonte

- **GIVEN** O sistema coleta métricas em tempo real
- **WHEN** O usuário acessa a seção "Taxa de Sucesso" no dashboard
- **THEN** Um gráfico de barras apresenta a porcentagem de requisições bem-sucedidas e falhas nas últimas 24h
- **THEN** A legenda indica cores verde (sucesso) e vermelho (falha)
- **THEN** Os valores são atualizados automaticamente

### Requirement: Exibir Contagem Diária de Requisições de Decisão

The system SHALL chart the total daily requests served by the /decision endpoint across the past 7 weeks.

#### Scenario: Exibir contagem diária de requisições API /decision

- **GIVEN** O endpoint /decision está sendo chamado por usuários externos
- **WHEN** Um usuário acessa a seção de requisições diárias no dashboard
- **THEN** Um gráfico mostra o número total de chamadas ao /decision para cada dia das últimas 7 semanas
- **THEN** O eixo X exibe datas, o eixo Y exibe contagem e há tooltips ao passar o cursor

### Requirement: Filtrar Logs Estruturados por Data e Nível

The system SHALL provide a structured log viewer allowing filtering by date and severity level (INFO, WARN, ERROR).

#### Scenario: Filtrar logs estruturados por data/hora e nível

- **GIVEN** Logs são armazenados em formato estruturado JSON
- **WHEN** Um usuário define filtro "data = 2026-09-15" e "nível = ERROR"
- **THEN** A tabela exibe apenas registros correspondentes ao dia e nível selecionado
- **THEN** Cada linha mostra timestamp, nível, mensagem e campo service

### Requirement: Autenticação JWT para Acesso ao Dashboard

The system SHALL restrict access to dashboard endpoints and metrics requiring valid JWT authentication.

#### Scenario: Verificar autenticação JWT na API de dashboard

- **GIVEN** Um token JWT inválido, expirado ou ausente é usado para acessar /dashboard
- **WHEN** O usuário tenta navegar para a página ou invocar as rotas de métricas
- **THEN** O servidor responde com status 401 Unauthorized e corpo JSON explicando o motivo
