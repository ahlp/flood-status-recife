## Purpose

Enable optional IP-based geolocation with user consent to highlight nearest critical flood routes without collecting personal identifiable information.

## Requirements

### Requirement: Processamento Local da Localização Aproximada

The system SHALL process the approximate IP location locally, without sending citizen IP addresses to third-party paid geolocation providers.

#### Scenario: Nenhum IP de cidadão é enviado a serviços externos

- **GIVEN** O usuário concedeu consentimento para exibir vias críticas próximas
- **WHEN** A aplicação resolve a localização aproximada
- **THEN** Nenhuma requisição contendo o IP do cidadão é enviada a provedores externos de geolocalização
- **THEN** Rastreadores de IP de terceiros (por exemplo, ipinfo.io) e seus tokens de API não são utilizados

### Requirement: Exibir Modal de Consentimento para Vias Críticas Próximas

The system SHALL present an accessible consent prompt asking if the user wishes to view nearby critical flood routes based on approximate IP location.

#### Scenario: Modal de consentimento exibido na primeira visita

- **GIVEN** O usuário está na página principal do aplicativo sem consentimento prévio
- **WHEN** A página é carregada
- **THEN** O modal de consentimento aparece com o texto "Deseja que exibamos vias críticas próximas com risco de alagamento?"
- **THEN** Os botões "Sim, localizar" e "Não" são exibidos com foco automático no botão afirmativo
- **THEN** A rolagem do fundo é bloqueada enquanto o modal estiver aberto

### Requirement: Exibição da Via Crítica Mais Próxima

The system SHALL display the nearest critical avenue or road in the interface when consent is granted.

#### Scenario: Usuário aceita consentimento e via crítica é exibida

- **GIVEN** O usuário está na página principal do aplicativo
- **WHEN** O modal de consentimento aparece e o usuário clica em "Sim, localizar"
- **THEN** A aplicação armazena a decisão no localStorage com validade de 30 dias
- **THEN** A aplicação consulta a localização aproximada e a base de vias críticas
- **THEN** A aplicação exibe a via crítica mais próxima (ex.: Av. Governador Agamenon Magalhães) em destaque na interface

### Requirement: Persistência do Consentimento em Armazenamento Local

The system SHALL remember the user choice for 30 days to avoid repetitive prompts.

#### Scenario: Consentimento persistido no localStorage por 30 dias

- **GIVEN** O usuário interagiu com o modal escolhendo "Sim" ou "Não"
- **WHEN** O usuário recarrega a página dentro do período de 30 dias
- **THEN** O modal de consentimento não é reexibido
