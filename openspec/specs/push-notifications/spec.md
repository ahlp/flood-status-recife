## Purpose

Deliver proactive browser push notifications to citizens when the daily decision is critical, using the Web Push Protocol and a service worker.

## Requirements

### Requirement: Registro do Service Worker

The system SHALL register a service worker (`/sw.js`) that handles `push` and `notificationclick` events.

#### Scenario: Service worker registrado na primeira visita

- **GIVEN** O usuário navega para a aplicação em um navegador com suporte a Service Workers
- **WHEN** A aplicação é carregada
- **THEN** O service worker `/sw.js` é registrado com escopo raiz
- **THEN** O service worker responde a eventos `push` exibindo uma notificação nativa

### Requirement: Inscrição no Web Push Protocol

The system SHALL allow the user to opt in to push notifications and register the resulting subscription with the backend.

#### Scenario: Usuário ativa notificações push

- **GIVEN** O usuário está na página principal
- **WHEN** O usuário clica no botão "Ativar notificações"
- **THEN** A aplicação solicita permissão de notificação ao navegador
- **THEN** Ao conceder a permissão, a inscrição PushSubscription é enviada para `POST /api/push/register`
- **THEN** O backend persiste a inscrição e responde com status 201

#### Scenario: Usuário recusa notificações

- **GIVEN** O usuário está na página principal
- **WHEN** O usuário recusa a permissão de notificação
- **THEN** Nenhuma inscrição é enviada ao backend
- **THEN** O botão permanece no estado "Ativar notificações"

### Requirement: Disparo Automático para Decisão Crítica

The system SHALL dispatch a push notification automatically when the daily decision is `SIM`.

#### Scenario: Notificação disparada quando a decisão é SIM

- **GIVEN** Existem inscrições push registradas no backend
- **WHEN** A decisão do dia é calculada como `SIM`
- **THEN** O backend dispara uma notificação com o título "Alerta de alagamento" e a justificativa curta
- **THEN** As notificações são enviadas apenas uma vez por dia por inscrição

### Requirement: Cancelamento da Inscrição

The system SHALL allow the user to disable push notifications at any time.

#### Scenario: Usuário desativa notificações push

- **GIVEN** O usuário possui uma inscrição push ativa
- **WHEN** O usuário clica em "Desativar notificações"
- **THEN** A inscrição é removida localmente
- **THEN** O backend remove a inscrição via `DELETE /api/push/register`
