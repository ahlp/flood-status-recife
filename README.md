# 🌊 Fico em Casa Hoje? (Flood Status Recife)

> **Uma aplicação web ultrassimples, sem cadastro e sem atrito, que responde de forma direta com SIM ou NÃO se o cidadão do Recife e Região Metropolitana (RMR) deve ficar em casa devido ao risco de ilhamento urbano por alagamentos.**

Inspirado no conceito minimalista e instantâneo do [shouldideploy.today](https://shouldideploy.today), o **Fico em Casa Hoje?** avalia os fatores críticos de mobilidade do Recife logo cedo pela manhã (05h30 UTC-3), combinando dados abertos de precipitação, tábua de marés e nível dos rios em um motor de decisão preditivo.

---

## 📌 Sumário
- [1. O Problema e o Conceito](#1-o-problema-e-o-conceito)
- [2. Principais Funcionalidades](#2-principais-funcionalidades)
- [3. Arquitetura e Tecnologias](#3-arquitetura-e-tecnologias)
- [4. Fontes de Dados Abertas](#4-fontes-de-dados-abertas)
- [5. Motor de Decisão e Regras de Negócio](#5-motor-de-decisão-e-regras-de-negócio)
- [6. Endpoints da API](#6-endpoints-da-api)
- [7. Status do Projeto e Roadmap de Tarefas](#7-status-do-projeto-e-roadmap-de-tarefas)
- [8. Como Executar o Projeto](#8-como-executar-o-projeto)
- [9. Variáveis de Ambiente](#9-variáveis-de-ambiente)
- [10. Testes e Acessibilidade](#10-testes-e-acessibilidade)
- [11. Licença](#11-licença)

---

## 1. O Problema e o Conceito

A decisão de sair para o trabalho, escola ou faculdade em Recife precisa ocorrer entre **6h e 7h da manhã**. A topografia e hidrografia do Recife geram um risco severo de ilhamento urbano quando ocorre a **combinação tripla**:
1. 🌧️ **Chuva acumulada ou prevista** nas primeiras horas do dia;
2. 🌊 **Pico da Maré Alta** que represa a foz dos rios e os canais de drenagem;
3. 🏞️ **Cota elevada dos rios principais** (Capibaribe, Tejipió e Beberibe).

Quando esses três fatores coincidem, eixos viários vitais (como Av. Gov. Agamenon Magalhães, Av. Mal. Mascarenhas de Morais, II Perimetral e Av. Cruz Cabugá) tornam-se intransitáveis.

### A Experiência do Usuário (UI/UX)
- **Zero Login:** Acesso direto à informação em menos de 1,5 segundo.
- **Layout Mutável:** 
  - **SIM, FICA EM CASA!** → Tema de alerta em tons avermelhados/alaranjados (`#ff4d00` / `#c0392b`), tipografia destacada e justificativa contextual dos fatores críticos.
  - **NÃO, PODE SAIR!** → Tema neutro/azul (`#3498db` / `#3b82f6`), com mensagem direta de tranquilidade.
- **Transição Suave:** Transição visual fluida (0.3s) sem cintilação.
- **Acessibilidade:** Padrão WCAG 2.1 AA com contraste mínimo 4.5:1 e suporte a navegação por teclado e leitores de tela.

---

## 2. Principais Funcionalidades

- ⚡ **Página Única Instantânea:** Decisão destacada em fonte grande (48px+), centralizada e responsiva (mobile-first).
- 💬 **Justificativa Contextual:** Texto sucinto (≤ 90 caracteres) explicando os fatores determinantes (ex.: *"Pico de maré de 2.2m às 07h30 alinhado a 35mm de chuva na madrugada"*).
- 🖨️ **Exportação PNG / Imprimir:** Botão para capturar a tela em alta resolução (escala 1.5) e baixar automaticamente o arquivo `decisao-recife-DDMMYYYY.png`.
- 📡 **Feed RSS Diário (`/rss`):** Feed padronizado e página dedicada minimalista para integração com Slack, Discord e leitores de RSS.
- 📍 **Geolocalização Opcional por IP:** Modal com consentimento e persistência (localStorage 30 dias) para exibir vias críticas mais próximas.
- 🛡️ **Fallback Estático:** Em caso de indisponibilidade de APIs externas, exibe mensagem clara e amigável com botão para tentar novamente.
- 📊 **Dashboard de Métricas & Logs (`/dashboard`):** Painel interno autenticado via JWT com gráficos de latência por fonte externa, taxa de sucesso/falha, volume de requisições e visualizador de logs estruturados.
- 📈 **Métricas Prometheus (`/metrics`):** Exposição nativa de métricas do sistema.
- 🔄 **Webhook de Notificação (`/api/webhook/notify`):** Endpoint para disparo de notificações a sistemas integrados (ex.: empresas de transporte público).

---

## 3. Arquitetura e Tecnologias

O projeto é estruturado em uma arquitetura moderna e desacoplada:

```
flood-status-recife/
├── backend/                  # API REST em Node.js (Express + TypeScript)
│   ├── src/
│   │   ├── controllers/      # Controladores das rotas
│   │   ├── services/         # Serviços (DataFetcher, RiskEngine, Cache, RSS, Metrics, Logger)
│   │   ├── data/             # Mapeamento de vias críticas e histórico
│   │   ├── middlewares/      # Autenticação JWT, rate limiting, logs
│   │   ├── routes/           # Definição das rotas da API
│   │   └── server.ts         # Inicialização do servidor e scheduler
│   └── tests/                # Testes unitários e de integração
├── frontend/                 # SPA em React (Vite + TypeScript + Tailwind CSS)
│   ├── src/
│   │   ├── components/       # DecisionDisplay, GeoModal, PrintButton, ErrorFallback, etc.
│   │   ├── pages/            # Home, RSSView, Dashboard
│   │   ├── services/         # Cliente API (Axios), geolocalização e exportação
│   │   └── styles/           # Configuração de temas e variáveis CSS
│   └── tests/                # Testes de componentes (Vitest + Testing Library)
└── docker-compose.yml        # Orquestração de Backend, Frontend e Redis
```

### Tecnologias Utilizadas
- **Backend:** Node.js, Express, TypeScript, Axios, Redis (ioredis com fallback em memória), node-cron, JSON Web Token (JWT), Prometheus Client (`prom-client`), Winston (logs estruturados).
- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Lucide React, html2canvas, Axios, React Router.
- **Cache & Armazenamento:** Redis com TTL de 24h para persistência da decisão diária.
- **Containerização:** Docker e Docker Compose.

---

## 4. Fontes de Dados Abertas

O sistema utiliza exclusivamente bases públicas e gratuitas sem custos de dados proprietários:

| Categoria | Fonte Aberta | Dados Extraídos |
|---|---|---|
| **Previsão Pluvial** | Open-Meteo API / APAC / INMET | Chuva acumulada na madrugada (00h-06h) e previsão horária matinal (06h-10h). |
| **Maré** | Tábua de Marés da Marinha do Brasil (Porto do Recife) | Horário do pico matinal da preamar e altura da maré (metros). |
| **Nível Fluvial** | CEMADEN / APAC | Cota e situação dos rios Capibaribe, Tejipió e Beberibe. |
| **Pontos Críticos** | Dados Abertos Recife | Mapeamento geográfico de vias com histórico de alagamento. |

---

## 5. Motor de Decisão e Regras de Negócio

### Pipeline de Execução Diária
1. **Agendamento:** Diariamente às **05h30 (horário de Recife - UTC-3)**, o serviço executa o ciclo de coleta e inferência.
2. **Cálculo de Risco ($0 \text{ a } 100\%$):**
   $$\text{Risco} = f(\text{Chuva Prevista Matutina}, \text{Altura da Maré no Pico}, \text{Nível dos Rios})$$
3. **Ponto de Corte:**
   - **Risco > 65%** $\rightarrow$ **SIM, FICA EM CASA!**
   - **Risco $\le$ 65%** $\rightarrow$ **NÃO, PODE SAIR!**
4. **Cache & Persistência:** A decisão calculada é gravada no Redis com TTL de 24 horas (`feh:decision:YYYY-MM-DD`).
5. **Resiliência:** Em caso de falha de conexão com fontes externas, aplica 3 tentativas com backoff exponencial; persistindo o erro, ativa a resposta de fallback estático segura.

---

## 6. Endpoints da API

| Método | Endpoint | Descrição | Autenticação |
|---|---|---|---|
| `GET` | `/api/decision` | Retorna a decisão do dia, fatores de risco e justificativa | Aberto |
| `GET` | `/api/rss` | Retorna o XML do feed RSS diário | Aberto |
| `GET` | `/api/rss/latest` | Retorna JSON com os dados do último item do feed RSS | Aberto |
| `GET` | `/api/rss/download` | Download direto do arquivo `rss-YYYYMMDD.xml` | Aberto |
| `GET` | `/metrics` | Métricas no formato Prometheus | Aberto |
| `GET` | `/api/metrics/latency` | Métricas de latência das fontes externas (24h) | JWT Requerido |
| `GET` | `/api/metrics/success-failure` | Taxa de sucesso vs. falha por fonte externa | JWT Requerido |
| `GET` | `/api/metrics/daily-decisions` | Histórico de requisições de decisão | JWT Requerido |
| `GET` | `/api/logs` | Consulta de logs estruturados (filtro por data e nível) | JWT Requerido |
| `POST` | `/api/auth/login` | Autenticação de operadores do painel interno | Aberto |
| `POST` | `/api/webhook/notify` | Webhook para disparo a parceiros externos | Token Opcional |

---

## 7. Status do Projeto e Roadmap de Tarefas

### Legenda de Status
- 🟢 **Concluído** (`[x]`)
- 🟡 **Em Progresso**
- ⚪ **Pendente** (`[ ]`)

### Roadmap de Implementação

#### Fase 1: Documentação & Planejamento Inicial
- [x] **README.md e Estruturação do Projeto** — Documentação detalhada dos requisitos, arquitetura, stack tecnológica e roadmap de tarefas. (Status: 🟢 Concluído)

#### Fase 2: Backend (Node.js + Express + TypeScript)
- [x] **Configuração da Base do Backend** — Setup do projeto TypeScript, Express, middlewares essenciais (CORS, Helmet, Rate Limiter, Winston logger) e scripts. (Status: 🟢 Concluído)
- [x] **Módulo Coletor de Dados Abertos (`DataFetcherService`)** — Integração com Open-Meteo, Tábua de Marés, CEMADEN/APAC e catálogo de vias críticas com política de retry e resiliência. (Status: 🟢 Concluído)
- [x] **Motor de Decisão e Inferência (`RiskEngineService`)** — Algoritmo preditivo de cálculo de índice de risco, corte em 65% e gerador de justificativa contextual (≤ 90 caracteres). (Status: 🟢 Concluído)
- [ ] **Camada de Cache e Scheduler (`CacheService` & `CronJob`)** — Persistência Redis com TTL 24h (com fallback em memória) e rotina diária às 05h30. (Status: ⚪ Pendente)
- [ ] **Serviço de RSS e Endpoints Públicos** — Geração de XML RSS 2.0, download e rotas `/api/decision`, `/api/rss`, `/api/rss/latest`. (Status: ⚪ Pendente)
- [ ] **Módulo de Observabilidade, Logs e Métricas** — Endpoint `/metrics` Prometheus, rotas de métricas agregadas e logs estruturados em JSON com rota de consulta `/api/logs`. (Status: ⚪ Pendente)
- [ ] **Autenticação JWT e Webhook** — Rota `/api/auth/login` para dashboard e `/api/webhook/notify` para disparo externo. (Status: ⚪ Pendente)
- [ ] **Testes Automatizados do Backend** — Testes unitários e de integração com cobertura para fetchers, risk engine, cache e rotas da API. (Status: ⚪ Pendente)

#### Fase 3: Frontend (React + Vite + Tailwind CSS)
- [ ] **Configuração da Base do Frontend** — Setup Vite, React 18, TypeScript, Tailwind CSS, Lucide React e estrutura de rotas. (Status: ⚪ Pendente)
- [ ] **Componente Principal de Decisão e Tema Dinâmico** — Renderização da decisão em 48px+, temas reativos (Alerta Laranja/Vermelho vs. Neutro/Azul) com transição de 0.3s. (Status: ⚪ Pendente)
- [ ] **Justificativa Contextual e Fallback Estático** — Exibição sucinta da justificativa e tela amigável de erro de dados externos com botão "Tentar Novamente". (Status: ⚪ Pendente)
- [ ] **Exportação PNG em Alta Resolução** — Botão "Imprimir" integrado com html2canvas (escala 1.5) e download com nome `decisao-recife-DDMMYYYY.png`. (Status: ⚪ Pendente)
- [ ] **Modal de Geolocalização por IP** — Prompt com consentimento, integração com IP lookup, persistência em localStorage (30 dias) e exibição da via crítica mais próxima. (Status: ⚪ Pendente)
- [ ] **Página do Feed RSS (`/rss`)** — Visualização minimalista do último item, link seguro em nova aba, snippet da justificativa (200-400 chars) e botão "Download RSS". (Status: ⚪ Pendente)
- [ ] **Dashboard de Métricas & Monitoramento (`/dashboard`)** — Interface interna com autenticação JWT, gráficos de latência por fonte, taxa de sucesso/falha, volume de requisições e visualizador de logs com filtros. (Status: ⚪ Pendente)
- [ ] **Acessibilidade WCAG 2.1 AA & Testes do Frontend** — Validação de contraste mínimo 4.5:1, foco visível, navegação por teclado e testes com Vitest/Testing Library. (Status: ⚪ Pendente)

#### Fase 4: Integração, Docker e Validação Final
- [ ] **Dockerização Completa** — Dockerfile multi-stage para backend e frontend, além de `docker-compose.yml` integrado com Redis. (Status: ⚪ Pendente)
- [ ] **Validação E2E e Lançamento** — Verificação completa de todos os fluxos BDD descritos no DECK_BRIEFING. (Status: ⚪ Pendente)

---

## 8. Como Executar o Projeto

### Pré-requisitos
- **Node.js**: v18.0.0 ou superior (recomendado v20+)
- **npm** ou **yarn**
- **Docker** e **Docker Compose** (opcional, para execução com Redis)

### Execução com Docker Compose (Recomendado)
```bash
# Clone o repositório
git clone https://gitlab.com/ahlp/flood-status-recife.git
cd flood-status-recife

# Inicie os serviços (Backend, Frontend e Redis)
docker-compose up --build
```
Acesse:
- **Frontend:** `http://localhost:3000`
- **Backend API:** `http://localhost:4000`
- **Métricas:** `http://localhost:4000/metrics`

### Execução Local para Desenvolvimento

#### 1. Backend
```bash
cd backend
npm install
npm run dev
```

#### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 9. Variáveis de Ambiente

### Backend (`backend/.env`)
```env
PORT=4000
NODE_ENV=development
REDIS_URL=redis://localhost:6379
JWT_SECRET=super-secret-flood-status-jwt-key
CORS_ORIGIN=http://localhost:3000
CRON_SCHEDULE="30 5 * * *"
IPINFO_TOKEN=
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:4000
```

---

## 10. Testes e Acessibilidade

```bash
# Executar testes no backend
cd backend && npm test

# Executar testes no frontend
cd frontend && npm test
```

A interface segue os padrões **WCAG 2.1 AA**, garantindo:
- Contraste mínimo de 4.5:1 em todos os modos e temas visuais;
- Navegação completa via teclado (`Tab`, `Shift+Tab`, `Enter`, `Esc`);
- Suporte a leitores de tela com atributos ARIA semânticos (`aria-live`, `aria-modal`, `role="alert"`).

---

## 11. Licença

Este projeto é disponibilizado sob a licença [MIT](LICENSE).

