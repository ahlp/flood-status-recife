## Purpose

Allow citizens to install the application as a Progressive Web App (PWA) and keep access to the last known daily decision even without internet connectivity.

## Requirements

### Requirement: Instalação como PWA

The system SHALL expose a valid web app manifest so browsers can offer installation to the home screen.

#### Scenario: Manifest e metatags presentes

- **GIVEN** O usuário acessa a aplicação em um navegador compatível
- **WHEN** A página é carregada
- **THEN** O documento referencia `/manifest.json` com `name`, `short_name`, `start_url`, `display: "standalone"`, `theme_color` e `background_color`
- **THEN** O documento declara a metatag `theme-color`
- **THEN** Ícones de 192x192 e 512x512 estão registrados no manifest

### Requirement: Cache de Recursos pelo Service Worker

The system SHALL register a service worker that caches the application shell for offline access.

#### Scenario: Aplicação disponível offline

- **GIVEN** O usuário já visitou a aplicação ao menos uma vez
- **WHEN** O usuário recarrega a página sem conexão de rede
- **THEN** O service worker responde com os recursos em cache (app shell)
- **THEN** A aplicação é renderizada mesmo offline

### Requirement: Persistência da Última Decisão

The system SHALL persist the last successfully loaded decision and display it when the network is unavailable.

#### Scenario: Última decisão exibida offline

- **GIVEN** O usuário carregou a decisão com sucesso em uma visita anterior
- **WHEN** Uma nova consulta falha por falta de conexão
- **THEN** A aplicação exibe a última decisão armazenada localmente
- **THEN** Um aviso indica que os dados são da última atualização disponível
