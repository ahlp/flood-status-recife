## Purpose

Extend the daily decision service to the Recife Metropolitan Region, allowing citizens of Olinda and Jaboatão dos Guararapes to consult city-specific flood risk using dedicated coordinates and local monitoring stations.

## Requirements

### Requirement: Seleção de Cidade via Query Param

The system SHALL accept a `city` query parameter on the decision endpoint, supporting `recife` (default), `olinda` and `jaboatao`.

#### Scenario: Consultar decisão para Olinda

- **GIVEN** O backend está em execução
- **WHEN** O cliente chama `GET /api/decision?city=olinda`
- **THEN** O servidor utiliza as coordenadas de Olinda para dados meteorológicos e de maré
- **THEN** A resposta inclui o campo `city` com o identificador `olinda`
- **THEN** A decisão é armazenada em cache com chave específica da cidade

#### Scenario: Cidade não suportada

- **GIVEN** O backend está em execução
- **WHEN** O cliente chama `GET /api/decision?city=caruaru`
- **THEN** O servidor responde 400 Bad Request com mensagem indicando as cidades suportadas

#### Scenario: Cidade omitida utiliza Recife

- **GIVEN** O backend está em execução
- **WHEN** O cliente chama `GET /api/decision` sem o parâmetro `city`
- **THEN** O servidor utiliza a configuração padrão do Recife

### Requirement: Configuração de Coordenadas e Estações por Cidade

The system SHALL define a city configuration containing latitude, longitude and monitoring station filters for each supported municipality.

#### Scenario: Dados coletados com coordenadas da cidade

- **GIVEN** A configuração multi-cidades está carregada
- **WHEN** Os serviços de clima, maré e rios são consultados para uma cidade
- **THEN** As requisições externas usam as coordenadas daquela cidade
- **THEN** As estações fluviométricas são filtradas pelo município correspondente

### Requirement: Seletor de Cidade na Interface

The system SHALL provide a city selector in the frontend that updates the `?city=` query parameter and reloads the decision.

#### Scenario: Usuário alterna entre cidades

- **GIVEN** O usuário está na página principal
- **WHEN** O usuário seleciona "Olinda" ou "Jaboatão"
- **THEN** A URL é atualizada com `?city=olinda` ou `?city=jaboatao`
- **THEN** A decisão exibida corresponde à cidade selecionada
