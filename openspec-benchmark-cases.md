# 🔬 Benchmark de Validação de Conformidade: OpenSpec × LLMs

> **Projeto**: Flood Status Recife (`flood-status-recife`)  
> **Objetivo de Pesquisa**: Avaliar a capacidade de Modelos de Linguagem (LLMs) em detectar divergências, regressões, obsolescência e ausência de implementação entre Especificações Executáveis (**OpenSpec**) e Código-Fonte Real (Frontend/Backend).  
> **Metodologia**: Cada caso abaixo representa um cenário de teste planejado para ser instanciado como um Pull Request (PR) individual de avaliação de conformidade.

---

## 📑 Taxonomia dos Cenários de Avaliação

| Tipo | Categoria | Descrição |
|:---:|---|---|
| **Tipo A** | **Código Alterado / Spec Obsoleta** | O código evoluiu legitimamente, mas a especificação não foi atualizada (*Spec Drift*). O LLM deve apontar a necessidade de atualizar a spec. |
| **Tipo B** | **Spec Alterada / Código Obsoleto** | Os requisitos de negócio/design mudaram na spec, mas o código permanece na versão antiga (*Code Drift*). O LLM deve apontar que o código precisa ser corrigido. |
| **Tipo C** | **Nova Spec / Código Ausente** | Nova capacidade formalmente especificada sem qualquer implementação prévia (*Green-field*). O LLM deve apontar ausência total e planejar os módulos. |
| **Tipo D** | **Regressão / Bug no Código** | O código sofreu uma alteração incorreta que viola diretamente os cenários `GIVEN/WHEN/THEN` da spec. O LLM deve acusar o bug. |
| **Tipo E** | **Depreciação / Código Órfão** | Um requisito foi descontinuado e removido da spec, mas o código ainda mantém a lógica ativa. O LLM deve acusar código morto/não especificado. |
| **Tipo F** | **Incompatibilidade de Contrato / Schema** | Desalinhamento sutil de payload, códigos HTTP, tipos ou unidades de medida. O LLM deve identificar a quebra de contrato. |
| **Tipo G** | **Divergência Concorrente / Conflito Bidirecional** | Tanto a spec quanto o código foram modificados simultaneamente no PR, mas adotando premissas ou regras conflitantes (*Split-Brain Specification/Implementation*). O LLM deve detectar a colisão mútua e solicitar arbitragem/reconciliação humana. |

---

## 🎯 Casos de Teste para Execução dos PRs

---

### Caso 01 — Transição para Open-Meteo Marine na Tábua de Marés
- **Tipo**: `Tipo A` (Código Alterado / Spec Obsoleta)
- **Spec Alvo**: [`openspec/specs/decision-display/spec.md`](openspec/specs/decision-display/spec.md)
- **Código Alvo**: [`backend/src/services/dataFetcher.ts#L92-L143`](backend/src/services/dataFetcher.ts#L92-L143)
- **Descrição do PR**: O código substituiu o cálculo harmônico estático pela API REST da Open-Meteo Marine com ajuste de Zero Hidrográfico (+1.35m), enquanto a spec ainda descreve "Tábua de Marés da Marinha do Brasil".
- **Expectativa do LLM**: Detectar que a fonte de dados declarada na spec está defasada em relação à implementação do serviço e sugerir a atualização da spec.

---

### Caso 02 — Telemetria de Linígrafos do CEMADEN para Nível Fluvial
- **Tipo**: `Tipo A` (Código Alterado / Spec Obsoleta)
- **Spec Alvo**: [`openspec/specs/metrics-dashboard/spec.md`](openspec/specs/metrics-dashboard/spec.md)
- **Código Alvo**: [`backend/src/services/dataFetcher.ts#L148-L215`](backend/src/services/dataFetcher.ts#L148-L215)
- **Descrição do PR**: O backend passou a consumir o feed JSON público de PCDs do CEMADEN (`resources.cemaden.gov.br`), mas a spec ainda pressupõe valores estáticos e menção genérica a "CEMADEN / APAC".
- **Expectativa do LLM**: Identificar que a spec de monitoramento não reflete a estrutura de ingestão telemétrica implementada.

---

### Caso 03 — Algoritmo de Truncamento de Justificativa com Reticências
- **Tipo**: `Tipo A` (Código Alterado / Spec Obsoleta)
- **Spec Alvo**: [`openspec/specs/decision-display/spec.md`](openspec/specs/decision-display/spec.md)
- **Código Alvo**: [`frontend/src/components/DecisionDisplay.tsx#L60-L67`](frontend/src/components/DecisionDisplay.tsx#L60-L67) e [`backend/src/services/riskEngine.ts#L17-L25`](backend/src/services/riskEngine.ts#L17-L25)
- **Descrição do PR**: O código aplica a regra explícita de `slice(0, 89) + "…"` para garantir no máximo 90 caracteres, enquanto a spec afirma vagamente que o texto "não excede 90 caracteres".
- **Expectativa do LLM**: Apontar que o comportamento de reticências (`…`) existe no código mas está omitido no cenário da spec.

---

### Caso 04 — Redução do Ponto de Corte de Risco para 60%
- **Tipo**: `Tipo B` (Spec Alterada / Código Obsoleto)
- **Spec Alvo**: [`openspec/specs/decision-display/spec.md`](openspec/specs/decision-display/spec.md)
- **Código Alvo**: [`backend/src/services/riskEngine.ts#L12`](backend/src/services/riskEngine.ts#L12) e [`frontend/src/components/DecisionDisplay.tsx#L105`](frontend/src/components/DecisionDisplay.tsx#L105)
- **Descrição do PR**: A spec foi atualizada para reduzir o limiar de decisão de risco de 65% para 60% por diretriz da Defesa Civil, mas o código mantém `RISK_THRESHOLD = 65` e a legenda "Corte: 65%".
- **Expectativa do LLM**: Acusar não-conformidade no valor da constante do motor de risco e na interface do usuário.

---

### Caso 05 — Extensão da Validade do Consentimento de IP para 90 Dias
- **Tipo**: `Tipo B` (Spec Alterada / Código Obsoleto)
- **Spec Alvo**: [`openspec/specs/geo-location/spec.md`](openspec/specs/geo-location/spec.md)
- **Código Alvo**: [`frontend/src/components/GeoConsentModal.tsx#L10`](frontend/src/components/GeoConsentModal.tsx#L10)
- **Descrição do PR**: O requisito da spec aumentou a retenção do consentimento no `localStorage` de 30 para 90 dias, mas a constante `EXPIRY_DAYS` no frontend continua fixada em 30.
- **Expectativa do LLM**: Identificar que o tempo de expiração no código desobedece o requisito de 90 dias da spec.

---

### Caso 06 — Adição de Botão "Copiar Link Seguro" na Página RSS
- **Tipo**: `Tipo B` (Spec Alterada / Código Obsoleto)
- **Spec Alvo**: [`openspec/specs/rss-feed/spec.md`](openspec/specs/rss-feed/spec.md)
- **Código Alvo**: [`frontend/src/pages/RSSView.tsx`](frontend/src/pages/RSSView.tsx)
- **Descrição do PR**: A spec incluiu um novo requisito exigindo um botão "Copiar Link" ao lado de "Download RSS", com cópia para o clipboard e toast de confirmação.
- **Expectativa do LLM**: Apontar que o componente `RSSView.tsx` não implementa o botão nem o fluxo de cópia especificado.

---

### Caso 07 — Padronização ISO no Nome do Arquivo PNG (`decisao-recife-YYYY-MM-DD.png`)
- **Tipo**: `Tipo B` (Spec Alterada / Código Obsoleto)
- **Spec Alvo**: [`openspec/specs/png-export/spec.md`](openspec/specs/png-export/spec.md)
- **Código Alvo**: [`frontend/src/components/PrintButton.tsx#L27-L30`](frontend/src/components/PrintButton.tsx#L27-L30)
- **Descrição do PR**: A spec alterou o padrão de nomenclatura de `decisao-recife-DDMMYYYY.png` para `decisao-recife-YYYY-MM-DD.png` (ISO 8601), mas o código ainda formata como `DDMMYYYY`.
- **Expectativa do LLM**: Sinalizar a discrepância na formatação da data no nome do arquivo gerado.

---

### Caso 08 — Suporte ao Estado Intermediário de Risco ("ATENÇÃO")
- **Tipo**: `Tipo B` (Spec Alterada / Código Obsoleto)
- **Spec Alvo**: [`openspec/specs/decision-display/spec.md`](openspec/specs/decision-display/spec.md)
- **Código Alvo**: [`backend/src/types/index.ts#L1`](backend/src/types/index.ts#L1) e [`frontend/src/components/DecisionDisplay.tsx`](frontend/src/components/DecisionDisplay.tsx)
- **Descrição do PR**: A spec passou a definir três decisões possíveis (`SIM`, `NÃO`, `ATENÇÃO`), com tema amarelo `#f39c12` para risco entre 50% e 65%, enquanto o código suporta apenas o enum binário `SIM | NÃO`.
- **Expectativa do LLM**: Detectar que os tipos TypeScript e as regras visuais da interface não suportam o terceiro estado.

---

### Caso 09 — Notificações Web Push para Alertas Críticos
- **Tipo**: `Tipo C` (Nova Spec / Código Ausente)
- **Spec Alvo**: `openspec/specs/push-notifications/spec.md` *(Novo Arquivo)*
- **Código Alvo**: Nenhum arquivo correspondente em `frontend/` e `backend/`
- **Descrição do PR**: Adicionada especificação completa para registro de service worker, inscrição no Web Push Protocol e disparo automático quando a decisão do dia for `SIM`.
- **Expectativa do LLM**: Declarar 0% de conformidade, apontar ausência total de implementação e listar os arquivos e rotas a serem criados.

---

### Caso 10 — Histórico e Calendário de Decisões Passadas
- **Tipo**: `Tipo C` (Nova Spec / Código Ausente)
- **Spec Alvo**: `openspec/specs/risk-history-calendar/spec.md` *(Novo Arquivo)*
- **Código Alvo**: Inexistente em `frontend/src/pages/` e `backend/src/routes/apiRoutes.ts`
- **Descrição do PR**: Especificação criada para uma rota `/historico` contendo visualização em calendário mensal dos dias anteriores com selos de status de alagamento.
- **Expectativa do LLM**: Identificar que nem a rota do frontend nem o endpoint `/api/decisions/history` existem no código.

---

### Caso 11 — Suporte a Progressive Web App (PWA) Offline
- **Tipo**: `Tipo C` (Nova Spec / Código Ausente)
- **Spec Alvo**: `openspec/specs/pwa-offline/spec.md` *(Novo Arquivo)*
- **Código Alvo**: [`frontend/index.html`](frontend/index.html) e `frontend/public/`
- **Descrição do PR**: Nova spec estipula instalação como PWA (`manifest.json`), cache de ícones e capacidade de exibir a última decisão carregada mesmo sem sinal de internet.
- **Expectativa do LLM**: Constatar ausência de `manifest.json`, service worker de cache e metatags de PWA.

---

### Caso 12 — Seleção de Cidades da Região Metropolitana (Olinda e Jaboatão)
- **Tipo**: `Tipo C` (Nova Spec / Código Ausente)
- **Spec Alvo**: `openspec/specs/multi-city-rmr/spec.md` *(Novo Arquivo)*
- **Código Alvo**: [`backend/src/services/dataFetcher.ts`](backend/src/services/dataFetcher.ts) e [`frontend/src/pages/Home.tsx`](frontend/src/pages/Home.tsx)
- **Descrição do PR**: Especificação adiciona suporte a query param `?city=olinda` ou `?city=jaboatao` com coordenadas personalizadas e estações locais. O código atual possui as coordenadas do Recife fixas.
- **Expectativa do LLM**: Apontar que o sistema opera em modo unicity e não implementa o suporte multi-cidades.

---

### Caso 13 — Redução Indevida da Escala de Exportação do Canvas PNG
- **Tipo**: `Tipo D` (Regressão / Bug no Código)
- **Spec Alvo**: [`openspec/specs/png-export/spec.md`](openspec/specs/png-export/spec.md)
- **Código Alvo**: [`frontend/src/components/PrintButton.tsx#L18`](frontend/src/components/PrintButton.tsx#L18)
- **Descrição do PR**: Durante uma tentativa de otimização de memória, um desenvolvedor alterou `scale: 1.5` para `scale: 1.0` no `html2canvas`.
- **Expectativa do LLM**: Detectar a violação direta do requisito explícito da spec que exige escala 1.5 para alta densidade de impressão.

---

### Caso 14 — Remoção do Bloqueio de Rolagem do Fundo no Modal de Consentimento
- **Tipo**: `Tipo D` (Regressão / Bug no Código)
- **Spec Alvo**: [`openspec/specs/geo-location/spec.md`](openspec/specs/geo-location/spec.md)
- **Código Alvo**: [`frontend/src/components/GeoConsentModal.tsx#L53-L56`](frontend/src/components/GeoConsentModal.tsx#L53-L56)
- **Descrição do PR**: Uma refatoração de estilos removeu a manipulação de `document.body.style.overflow = "hidden"`, permitindo rolagem com o modal aberto.
- **Expectativa do LLM**: Identificar que o cenário de acessibilidade ("A rolagem do fundo é bloqueada enquanto o modal estiver aberto") foi quebrado.

---

### Caso 15 — Omissão do Atributo de Segurança `rel="noopener noreferrer"` no Link RSS
- **Tipo**: `Tipo D` (Regressão / Bug no Código)
- **Spec Alvo**: [`openspec/specs/rss-feed/spec.md`](openspec/specs/rss-feed/spec.md)
- **Código Alvo**: [`frontend/src/pages/RSSView.tsx#L97`](frontend/src/pages/RSSView.tsx#L97)
- **Descrição do PR**: O link para a notícia externa manteve `target="_blank"`, mas perdeu o atributo `rel="noopener noreferrer"` em uma edição de template.
- **Expectativa do LLM**: Flagrar a falha de conformidade de segurança e apontar a linha exata onde o atributo foi omitido.

---

### Caso 16 — Resposta de Erro 500 sem Fallback em Falhas de Conexão
- **Tipo**: `Tipo D` (Regressão / Bug no Código)
- **Spec Alvo**: [`openspec/specs/static-fallback/spec.md`](openspec/specs/static-fallback/spec.md)
- **Código Alvo**: [`backend/src/controllers/decisionController.ts`](backend/src/controllers/decisionController.ts)
- **Descrição do PR**: O controller passou a propagar exceções como `HTTP 500 Internal Server Error` em vez de responder com o objeto de contingência estática (`isFallback: true`).
- **Expectativa do LLM**: Apontar que o comportamento de alta disponibilidade e tolerância a falhas exigido na spec foi violado.

---

### Caso 17 — Código Residual com Suporte a Tokens de Provedores de IP Terceiros
- **Tipo**: `Tipo E` (Depreciação / Código Órfão)
- **Spec Alvo**: [`openspec/specs/geo-location/spec.md`](openspec/specs/geo-location/spec.md)
- **Código Alvo**: [`backend/src/controllers/decisionController.ts`](backend/src/controllers/decisionController.ts) e `backend/.env` (`IPINFO_TOKEN`)
- **Descrição do PR**: A spec baniu formalmente o envio de IPs de cidadãos a serviços externos pagos. O código ainda mantém chaves e trechos condicionais com `ipinfo.io`.
- **Expectativa do LLM**: Notar a presença de lógica órfã e potencialmente violadora das diretrizes de privacidade da spec.

---

### Caso 18 — Descontinuação do Endpoint de Download de Arquivo XML
- **Tipo**: `Tipo E` (Depreciação / Código Órfão)
- **Spec Alvo**: [`openspec/specs/rss-feed/spec.md`](openspec/specs/rss-feed/spec.md)
- **Código Alvo**: [`backend/src/controllers/rssController.ts#L35-L50`](backend/src/controllers/rssController.ts#L35-L50) e [`frontend/src/services/api.ts#L127`](frontend/src/services/api.ts#L127)
- **Descrição do PR**: O requisito de download como anexo `.xml` foi revogado da spec em favor apenas da leitura direta do feed via URL, mas o backend continua expondo `/api/rss/download`.
- **Expectativa do LLM**: Apontar que a rota e o botão de download representam funcionalidade morta/não contemplada na spec.

---

### Caso 19 — Status Code 403 retornado em vez de 401 Unauthorized
- **Tipo**: `Tipo F` (Incompatibilidade de Contrato / Schema)
- **Spec Alvo**: [`openspec/specs/metrics-dashboard/spec.md`](openspec/specs/metrics-dashboard/spec.md)
- **Código Alvo**: [`backend/src/middlewares/auth.ts#L18`](backend/src/middlewares/auth.ts#L18)
- **Descrição do PR**: Em caso de token ausente ou inválido nas rotas do painel, o middleware responde com status `403 Forbidden` em vez do exigido `401 Unauthorized`.
- **Expectativa do LLM**: Apontar a divergência de conformidade do código de resposta HTTP entre o middleware e a spec.

---

### Caso 20 — Latência retornada em Segundos em vez de Milissegundos
- **Tipo**: `Tipo F` (Incompatibilidade de Contrato / Schema)
- **Spec Alvo**: [`openspec/specs/metrics-dashboard/spec.md`](openspec/specs/metrics-dashboard/spec.md)
- **Código Alvo**: [`backend/src/utils/metrics.ts#L49-L55`](backend/src/utils/metrics.ts#L49-L55)
- **Descrição do PR**: A spec define que o gráfico exibe o tempo de resposta em milissegundos (`ms`), mas a API serializou os dados divididos por 1000 com o campo `latency_sec`.
- **Expectativa do LLM**: Detectar a incompatibilidade de unidades e nome de campo do contrato de dados.

---

### Caso 21 — Diminuição do Tamanho Mínimo do Snippet RSS para 150 Caracteres
- **Tipo**: `Tipo F` (Incompatibilidade de Contrato / Schema)
- **Spec Alvo**: [`openspec/specs/rss-feed/spec.md`](openspec/specs/rss-feed/spec.md)
- **Código Alvo**: [`frontend/src/pages/RSSView.tsx#L20-L30`](frontend/src/pages/RSSView.tsx#L20-L30)
- **Descrição do PR**: A função `formatSnippet` no frontend foi alterada para aceitar resumos curtos de até 150 caracteres, violando o intervalo estipulado de 200 a 400 caracteres.
- **Expectativa do LLM**: Detectar a quebra do limite inferior estipulado no requisito do snippet.

---

### Caso 22 — Incompatibilidade no Formato de Data do Filtro de Logs (`DD/MM/YYYY` vs ISO)
- **Tipo**: `Tipo F` (Incompatibilidade de Contrato / Schema)
- **Spec Alvo**: [`openspec/specs/metrics-dashboard/spec.md`](openspec/specs/metrics-dashboard/spec.md)
- **Código Alvo**: [`frontend/src/pages/Dashboard.tsx#L452-L457`](frontend/src/pages/Dashboard.tsx#L452-L457)
- **Descrição do PR**: A spec define o filtro de data no padrão ISO `YYYY-MM-DD` (ex: `2026-09-15`), enquanto o frontend envia `DD/MM/YYYY`, impedindo o casamento com o banco de logs.
- **Expectativa do LLM**: Identificar o desalinhamento de formato de data entre o formulário do dashboard e a especificação.

---

### Caso 23 — Redefinição Concorrente da Janela e Limiar de Maré Crítica
- **Tipo**: `Tipo G` (Divergência Concorrente / Conflito Bidirecional)
- **Spec Alvo**: [`openspec/specs/decision-display/spec.md`](openspec/specs/decision-display/spec.md)
- **Código Alvo**: [`backend/src/services/dataFetcher.ts#L120-L135`](backend/src/services/dataFetcher.ts#L120-L135)
- **Descrição do PR**: O Product Manager alterou a spec para definir maré crítica como $\ge 2.1\text{m}$ na janela restrita das `06h00 às 08h30`. Simultaneamente, no mesmo PR, o desenvolvedor alterou o código para considerar maré crítica como $\ge 2.0\text{m}$ na janela expandida das `05h30 às 09h30`. Ambos abandonaram o padrão anterior ($\ge 1.9\text{m}$, 06h–10h), mas divergiram entre si.
- **Expectativa do LLM**: Reconhecer que houve alteração concorrente em ambos os artefatos, apontar que nenhum dos dois representa o baseline anterior, evidenciar a colisão de regras e solicitar arbitragem/reconciliação de negócio.

---

### Caso 24 — Conflito Bidirecional na Identidade Visual da Decisão "SIM"
- **Tipo**: `Tipo G` (Divergência Concorrente / Conflito Bidirecional)
- **Spec Alvo**: [`openspec/specs/decision-display/spec.md`](openspec/specs/decision-display/spec.md)
- **Código Alvo**: [`frontend/src/components/DecisionDisplay.tsx`](frontend/src/components/DecisionDisplay.tsx) e [`frontend/tailwind.config.js`](frontend/tailwind.config.js)
- **Descrição do PR**: O designer atualizou o cenário da spec determinando que o fundo do alerta SIM deve adotar Vermelho Carmim (`#e74c3c`). Concomitantemente, o desenvolvedor alterou o código e as classes Tailwind para Laranja Escuro Queimado (`#d35400`). A cor original (`#ff4d00`) foi substituída por ambos por valores conflitantes.
- **Expectativa do LLM**: Não classificar simplesmente como "código desatualizado", mas constatar que ambas as partes propuseram novas paletas visuais incompatíveis no mesmo ciclo.

---

### Caso 25 — Política Conflitante de SLA e Tolerância a Falhas no CEMADEN
- **Tipo**: `Tipo G` (Divergência Concorrente / Conflito Bidirecional)
- **Spec Alvo**: [`openspec/specs/metrics-dashboard/spec.md`](openspec/specs/metrics-dashboard/spec.md)
- **Código Alvo**: [`backend/src/services/dataFetcher.ts#L150-L165`](backend/src/services/dataFetcher.ts#L150-L165)
- **Descrição do PR**: A equipe de infraestrutura atualizou a spec estabelecendo SLA rigoroso de no máximo 2 tentativas com timeout de 2.500ms antes de acionar o fallback. O desenvolvedor, querendo evitar quedas, alterou o código para 5 tentativas com timeout de 8.000ms.
- **Expectativa do LLM**: Apontar a divergência crítica nos parâmetros de resiliência e latência máxima tolerada entre a especificação e o cliente HTTP.

---

## 📊 Matriz de Cobertura do Benchmark

| Capacidade OpenSpec | Casos Associados | Tipos Testados |
|---|:---:|:---:|
| `decision-display` | Caso 01, 03, 04, 08, 23, 24 | Tipo A, Tipo B, Tipo G |
| `geo-location` | Caso 05, 14, 17 | Tipo B, Tipo D, Tipo E |
| `metrics-dashboard` | Caso 02, 19, 20, 22, 25 | Tipo A, Tipo F, Tipo G |
| `png-export` | Caso 07, 13 | Tipo B, Tipo D |
| `rss-feed` | Caso 06, 15, 18, 21 | Tipo B, Tipo D, Tipo E, Tipo F |
| `static-fallback` | Caso 16 | Tipo D |
| `push-notifications` *(Nova)* | Caso 09 | Tipo C |
| `risk-history-calendar` *(Nova)* | Caso 10 | Tipo C |
| `pwa-offline` *(Nova)* | Caso 11 | Tipo C |
| `multi-city-rmr` *(Nova)* | Caso 12 | Tipo C |

---

## 🧪 Roteiro de Avaliação para o Experimento com LLMs

Para cada caso acima, a avaliação deve ser submetida a diferentes modelos com o seguinte protocolo de *prompting*:

1. **Entrada do Modelo**:
   - Conteúdo completo da spec em questão (`openspec/specs/<area>/spec.md`).
   - Trecho de código / diff do Pull Request em teste.
2. **Pergunta Avaliativa**:
   - *"Existe conformidade total entre a especificação e o código apresentado? Se não, aponte a categoria do problema (código incorreto, spec defasada, código faltante, quebra de contrato ou divergência concorrente/split-brain) e justifique com evidências textuais."*
3. **Métricas a Coletar**:
   - **Acurácia de Classificação**: O modelo identificou o tipo correto (A, B, C, D, E, F ou G)?
   - **Precisão de Evidência**: O modelo citou a linha ou cenário exato que causou o problema?
   - **Capacidade de Correção / Arbitragem**: O modelo sugeriu o patch correto (editar spec, editar código ou pedir arbitragem humana para conflitos bidirecionais)?
