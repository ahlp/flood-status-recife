# Fico em Casa Hoje?

> Nome da Solução: Fico em Casa Hoje?

Inspiração Visual e Conceitual: shouldideploy.today

Escopo do Projeto: Recife e Região Metropolitana (RMR)

Objetivo: Uma aplicação web ultrassimples, sem cadastro e sem atrito, que responde de forma direta com SIM ou NÃO se o cidadão deve ficar em casa devido ao risco de ilhamento urbano em Recife, mudando todo o layout da página conforme a decisão calculada pela IA.
1. O Conceito e Experiência do Usuário (UI/UX)

Assim como o Should I Deploy Today?, a aplicação é focada em respostas instantâneas, minimalistas e sem necessidade de navegação complexa:

    Zero Login: O usuário acessa a URL e recebe a resposta imediatamente. Sem cadastros, e-mails ou formulários.

    Layout Mutável segundo a Decisão:

        Decisão: "NÃO, PODE SAIR!" → Layout em tons neutros/azuis, mensagem direta e justificativa sucinta ("Maré baixa e chuva fraca prevista. Trânsito sem pontos críticos de escoamento.").

        Decisão: "SIM, FICA EM CASA!" → Layout de alerta em tons alaranjados/vermelhos, tipografia destacada e justificativa dos fatores ("Pico de maré de 2.2m às 07h30 alinhado a 35mm de chuva acumulada na madrugada.").

    Notificações via RSS (Opcional): Para usuários que desejam automação (integrar no Slack, Discord ou leitor de feed sem precisar de login), a plataforma disponibiliza um feed RSS estático atualizado diariamente pela manhã.

2. O Problema

A decisão de sair para o trabalho ou faculdade em Recife precisa acontecer logo cedo (entre 6h e 7h da manhã). O problema de mobilidade da cidade é gerado pela combinação tripla de:

    Chuva recente ou prevista para as primeiras horas.

    Pico da Maré Alta (que reprime os canais da cidade).

    Nível dos Rios (Capibaribe, Tejipió e Beberibe).

Quando esses três fatores se alinham, vias cruciais (como Agamenon Magalhães, Mascarenhas de Morais e II Perimetral) ficam ilhadas.
3. Diretrizes Técnicas e Fontes de Dados

    Somente Bases Abertas: Todo o pipeline de dados utiliza exclusivamente APIs meteorológicas e bases públicas governamentais gratuitas e abertas.

    Sem Monitoramento em Tempo Real Continuo: Não há necessidade de infraestrutura cara de streaming em tempo real. O sistema executa uma consulta e inferência pontual todas as manhãs (ex: às 05h30).

Fontes de Dados Utilizadas:
Categoria	Fonte / Base Aberta	Dado Extraído para a Manhã
Previsão Pluvial	Open-Meteo API / INMET / APAC	Chuva acumulada na madrugada e previsão horária entre 6h e 10h.
Maré	Tábua de Marés da Marinha do Brasil	Horário exato do pico de maré alta matutino e altura (m).
Nível Fluvial	CEMADEN / APAC	Cota dos rios no início do dia.
Pontos de Risco	Dados Abertos Recife	Mapeamento geográfico de histórico de alagamentos por bairro/via.
4. O Motor de Inteligência Artificial

A IA atua como um classificador preditivo de risco diário baseado no histórico acumulado da cidade:

    Ingestão Matinal: Às 05h30, o script busca os dados abertos de previsão de chuva, cota da maré e nível dos rios para as próximas horas.

    Modelagem Preditiva: Um modelo de Machine Learning (classificação supervisionada, como XGBoost ou Regressão Logística) avalia o vetor de entrada:

Decisa˜o (Ficar em Casa?)=f(Chuva Prevista Matutina,Altura da Mareˊ no Pico,Nıˊvel do Rio)

    Geração do Resultado: O modelo gera um índice de risco de 0 a 100%.

        Risco >65%→ NÃO SAIA DE CASA (Ativa layout de alerta e gera item no RSS).

        Risco ≤65%→ PODE SAIR (Ativa layout normal).

5. Resumo das Regras de Negócio

    Acesso: Web, aberto a qualquer pessoa sem login.

    Frequência de Atualização: 1x ao dia (pela manhã).

    Interface: Página única reativa, cujo tema visual reflete a resposta da IA.

    Distribuição: Web Frontend + Feed RSS.


_Exportado em 16/09/2026_


---

## Contexto Aprimorado


**Visão Geral**

Projeto "Fico em Casa Hoje?" visa oferecer uma solução web ultrassimplificada, sem cadastro, que fornece aos cidadãos do Recife e Região Metropolitana (RMR) uma resposta instantânea – SIM ou NÃO – sobre a necessidade de permanecerem em casa no início da manhã devido ao risco de ilhamento urbano. O objetivo é reduzir perdas humanas, materiais e de mobilidade urbana causada por enchentes matinais, integrando dados meteorológicos, marítimos e fluviais públicos com um modelo preditivo de risco baseado em Machine Learning.

O público-alvo são trabalhadores, estudantes, moradores e profissionais que precisam decidir rapidamente se podem sair de casa entre 6h e 7h. A solução difere dos alertas tradicionais por:

1. **Simplicidade total**: nenhuma tela de login, apenas uma página única;
2. **Decisão visualmente distinta**: o layout muda completamente (tema neutro vs alerta) com justificativa textual imediata;
3. **Feed RSS opcional** para automação sem necessidade de login;
4. **Modelo preditivo local** que combina chuva, maré alta e nível fluvial em tempo real usando dados abertos;
5. **Atualização diária pontual** (05h30) garantindo relevância no momento crítico da decisão.

O valor gerado: redução de incidentes de mobilidade urbana, economia de recursos (combustível, tempo), maior segurança pessoal e fortalecimento da cultura de prevenção comunitária.

**Funcionalidades**


#### Página Única Instantânea

Ao acessar a URL principal, o usuário recebe imediatamente a decisão do modelo. A página não contém navegação adicional, formulários ou anúncios, garantindo foco total na informação crítica.

#### Tema Visual Dinâmico

O layout alterna entre temas neutros/azuis (permite sair) e alertas em tons alaranjados/vermelhos (ficar em casa). A transição inclui animação suave, cores de acessibilidade e tipografia destacada para rápida leitura.

#### Justificativa Contextual

Abaixo da decisão aparece um parágrafo curto explicando os fatores que influenciaram a classificação: maré alta prevista, altura, chuva acumulada, nível dos rios. Isso educa o usuário sobre as causas do risco.

#### Feed RSS Diário

Um endpoint RSS estático gera um item por dia com a decisão e justificativa. Usuários podem integrar ao Slack, Discord ou leitores de feed sem cadastro.

#### Modelagem Preditiva XGBoost

O backend executa diariamente (05h30) uma consulta aos dados abertos e treina/reusa um modelo XGBoost que calcula risco entre 0-100%. A lógica de corte (65%) define a decisão.

#### Consulta Programada com Airflow/cron

Um job cron ou Airflow dispara o script Python, faz as chamadas às APIs Open-Meteo, Marinha do Brasil e CEMADEN, processa dados e armazena a decisão em cache Redis para respostas instantâneas.

#### Cache de Decisão

A resposta calculada é armazenada em memória (Redis) por 24h, permitindo que milhares de usuários recebam a mesma decisão sem reprocessar dados repetidamente.

#### Página Mobile‑First

O design responsivo garante legibilidade e rapidez em dispositivos móveis, já que a maioria dos usuários acessa via celular no período crítico da manhã.

#### Fallback Estático em Caso de Falha

Se qualquer fonte externa falhar (ex.: API indisponível), o sistema serve uma página estática com mensagem “Não foi possível obter dados hoje. Por favor, tente novamente amanhã.”

#### Log de Erros e Métricas

Um dashboard interno coleta métricas de latência, taxa de sucesso das chamadas externas e volume de acessos, permitindo monitoramento proativo do serviço.

**Fluxos do Sistema**

- Fluxo 1 – Usuário na manhã: 
1. Acessa URL principal.
2. Sistema consulta cache; se existir decisão atual (até 24h), devolve página.
3. Se não houver cache, backend executa job de cálculo (chama APIs, roda modelo).
4. Resultado é salvo no cache e enviado ao usuário em tema dinâmico.
5. Usuário pode copiar a URL ou usar RSS para automação.
- Fluxo 2 – Integração via RSS: 
1. Usuário adiciona feed RSS na agenda de integração (Slack, Discord, leitor).
2. Cada manhã às 05h30, backend publica item no feed com título “Decisão do dia: Ficar em casa? SIM/NÃO” e corpo contendo justificativa.
3. O usuário recebe a mensagem automaticamente no canal escolhido.
- Fluxo 3 – Falha de Dados Externos: 
1. Se qualquer API externa falhar, job grava log de erro.
2. Sistema retorna página estática de “Erro de dados”.
3. Usuário pode tentar novamente mais tarde ou consultar o feed RSS (que permanece funcional).

**Sugestões**

- Implementar webhook opcional para sistemas de gestão de transporte público, permitindo que ônibus e metrô ajustem rotas automaticamente quando a decisão for ‘SIM’.

- Adicionar camada de geolocalização: ao detectar localização do usuário via IP, exibir apenas vias críticas próximas (ex.: Agamenon Magalhães) na justificativa para personalizar alerta.

- Incorporar histórico diário em um gráfico simples no footer, mostrando evolução do risco nos últimos 7 dias, ajudando o usuário a contextualizar padrões sazonais.

- Permitir exportação da decisão como PNG ou PDF para impressão rápida (ex.: imprimir “Não sair hoje” e colar na porta).

- Criar micro‑serviço de teste A/B para avaliar diferentes cores de alerta e mensagens, otimizando taxa de adesão ao aviso.

## Documento de Requisitos

# Documento de Requisitos – “Fico em Casa Hoje?”

Este documento descreve, de forma detalhada e concreta, todos os requisitos funcionais, não‑funcionais, de interface, atributos de qualidade e restrições do sistema **“Fico em Casa Hoje?”** (FEH). O objetivo é que a equipe de desenvolvimento tenha um conjunto claro e completo para implementar o projeto conforme a proposta apresentada.

> **Formato**: Markdown  
> **Idioma**: Português brasileiro  
> **Público-alvo**: Desenvolvedores, arquitetos, testadores e stakeholders técnicos.  

---

## 1. Requisitos Funcionais

| # | Nome | Descrição | Prioridade (P) | Dependências |
|---|------|-----------|-----------------|--------------|
| RF‑01 | **Resposta instantânea na primeira página** | Ao acessar a URL principal (`https://ficoemcasa.com.br/`), o sistema deve exibir imediatamente a decisão de “SIM” ou “NÃO” sem qualquer etapa adicional (login, formulário). | P1 | - |
| RF‑02 | **Cálculo diário da decisão** | A cada dia às 05h30 (horário local do Recife) um job automático coleta dados das APIs externas, executa o modelo preditivo e armazena a decisão. | P1 | RF‑01, RF‑04 |
| RF‑03 | **Persistência da decisão** | O resultado diário deve ser armazenado em cache (Redis) com TTL de 24 h para que todas as requisições subsequentes retornem o mesmo valor até o próximo cálculo. | P1 | RF‑02 |
| RF‑04 | **Fallback estático** | Se qualquer fonte externa falhar, a página exibida deve ser uma versão estática informando “Não foi possível obter dados hoje. Por favor, tente novamente amanhã.” | P2 | - |
| RF‑05 | **Feed RSS diário** | Um endpoint (`/rss`) gera um item RSS contendo título “Decisão do dia: Ficar em casa? SIM/NÃO” e corpo com justificativa. | P1 | RF‑02 |
| RF‑06 | **Tema visual dinâmico** | O layout da página deve mudar automaticamente entre:
  * Tema neutro/azul (decisão “NÃO – Pode sair”)  
  * Tema alerta vermelho/orange (decisão “SIM – Fica em casa”)
  com transição CSS de 0.3 s e contraste mínimo de 4.5:1 para acessibilidade. | P2 | RF‑01 |
| RF‑07 | **Justificativa contextual** | Abaixo da decisão deve aparecer um parágrafo curto (≤ 90 caracteres) explicando os fatores que influenciaram a classificação (ex.: “Maré alta prevista em 7h30 + chuva de 35 mm”). | P2 | RF‑02 |
| RF‑08 | **Geolocalização opcional** | Se o usuário consentir (via prompt de navegador) o sistema pode detectar IP e exibir vias críticas relevantes na justificativa. | P3 | RF‑01 |
| RF‑09 | **Exportação em PNG** | Um botão “Imprimir” gera uma imagem da página atual (layout + decisão + justificativa) que pode ser salva ou impressa. | P4 | RF‑01, RF‑06 |
| RF‑10 | **Monitoramento de métricas** | O backend deve expor endpoints `/metrics` (Prometheus format) com latência das chamadas externas, taxa de sucesso e número de requisições diárias. | P3 | - |
| RF‑11 | **Logs detalhados** | Cada execução do job diário deve gerar logs estruturados (JSON) contendo timestamp, status de cada API, tempo de resposta, erro se houver e decisão final. | P2 | RF‑02 |

---

## 2. Requisitos Não Funcionais

| # | Nome | Descrição | Métrica / Valor |
|---|------|-----------|-----------------|
| RNF‑01 | **Tempo de resposta** | A página principal deve responder em ≤ 1,5 s para 95 % das requisições. | 1.5 s |
| RNF‑02 | **Escalabilidade horizontal** | O sistema deve suportar até 10 000 acessos simultâneos sem degradação perceptível. | 10k concurrent users |
| RNF‑03 | **Disponibilidade** | Disponibilidade mínima de 99,9 % (downtime máximo de 43 min por ano). | 99.9 % |
| RNF‑04 | **Segurança da API externa** | Todas as chamadas externas devem usar HTTPS; tokens ou chaves são armazenados no Vault/Secret Manager e nunca expostos no código fonte. | TLS 1.2+ |
| RNF‑05 | **Resiliência** | Em caso de falha de uma API, o job deve tentar 3 vezes com backoff exponencial (0.5s, 1s, 2s). Se ainda falhar, registra erro e continua com fallback estático. | 3 retries |
| RNF‑06 | **Acessibilidade** | Página deve atender WCAG 2.1 AA: contraste mínimo 4.5:1, navegação por teclado, texto alternativo para imagens, ARIA labels nos botões. | WCAG 2.1 AA |
| RNF‑07 | **Compatibilidade de navegador** | Suporte a Chrome 80+, Firefox 75+, Edge 80+, Safari 13+ (mobile). | Browsers list |
| RNF‑08 | **Tempo de cache** | TTL do Redis = 24 h; se o job falhar, o cache pode servir o valor antigo até expirar. | 24 h |
| RNF‑09 | **Consumo de recursos** | Job diário deve usar ≤ 500 MB RAM e ≤ 1 CPU core em ambiente Docker. | ≤ 500 MB RAM |
| RNF‑10 | **Localização do servidor** | Instância hospedada em infraestrutura brasileira (AWS us-east-2 / GCP southamerica‑east). | Brazil region |

---

## 3. Requisitos de Interface

### 3.1 Frontend

| Elemento | Descrição | Exemplo |
|----------|-----------|---------|
| **Header** | Logo “Fico em Casa Hoje?” alinhado à esquerda, sem link. | ![logo](link) |
| **Decision Box** | Texto central (“SIM” ou “NÃO”) em fonte grande (48 px), cor verde/laranja conforme tema. | <h1 style="color:#FF4D00">SIM</h1> |
| **Justificativa** | Parágrafo abaixo do Decision Box, fonte 18 px, linha de 80 caracteres máximo. | “Maré alta prevista em 07h30 + chuva de 35 mm” |
| **Export Button** | Botão “Imprimir” no canto inferior direito; ícone de impressora. | <button>📠 Imprimir</button> |
| **RSS Icon** | Link para `/rss` com ícone RSS, ao lado do botão. | 🔗 /rss |
| **Geolocalização Prompt** | Modal pequeno “Deseja exibir vias críticas próximas?” (Sim/Não). | <div class="modal">... </div> |

### 3.2 Backend

| Endpoint | Método | Path | Descrição | Exemplo de Resposta |
|----------|--------|------|-----------|---------------------|
| **GET** | `/` | Página principal | Retorna HTML com decisão e justificativa. | `<html>...</html>` |
| **GET** | `/rss` | Feed RSS diário | XML contendo título, link, descrição. | `<?xml version="1.0"?> <rss>...</rss>` |
| **GET** | `/metrics` | Métricas Prometheus | Texto plano com métricas. | `feh_requests_total 12345` |
| **POST** | `/webhook/notify` | Opcional para integração externa (ex.: transporte) | Recebe JSON `{ "decision": "SIM", "timestamp": ... }`. | HTTP 200 OK |

---

## 4. Atributos de Qualidade

| Nome | Significado | Como será garantido |
|------|-------------|---------------------|
| **Usabilidade** | Usuário deve obter a decisão em < 1 s e entender o risco sem esforço adicional. | Testes UX com usuários reais; métricas de tempo de resposta. |
| **Manutenibilidade** | Código modular, documentação inline (docstrings), testes unitários 80 % coverage. | CI/CD com linting + cobertura. |
| **Testabilidade** | Cada componente isolado (data fetcher, model predictor, cache) tem testes automatizados. | PyTest/UnitTest para backend; Jest/Cypress para frontend. |
| **Portabilidade** | Dockerfile oficial, suporte a Kubernetes. | Imagem Docker multi‑stage, Helm chart. |
| **Eficiência** | Uso otimizado de memória e CPU, evitando chamadas redundantes. | Cache Redis + batch requests. |
| **Resiliência** | Sistema continua operando com fallback estático mesmo quando 1 ou mais APIs falham. | Estratégia de retries + fallback page. |

---

## 5. Restrições

1. **Apenas Dados Abertos** – Não pode ser usado nenhum serviço pago nem dados proprietários.
2. **Sem Cadastro/Autenticação** – O fluxo principal deve ser totalmente anônimo; apenas a API `/webhook/notify` pode exigir token (opcional).
3. **Horário de Cálculo** – O job diário deve rodar estritamente às 05h30 horário local; não há ajuste manual.
4. **Limite de Recursos na Cloud** – Instância padrão (t2.medium / n1-standard-1) em região brasileira; qualquer aumento de recursos requer aprovação do PMO.
5. **Política de Retenção de Dados** – Decisão armazenada apenas no cache Redis e logs históricos mantidos por 30 dias em bucket S3/Cloud Storage. Não há banco relacional persistente além disso.
6. **Compliance LGPD** – Nenhum dado pessoal é coletado; geolocalização opcional deve ser feita via IP sem armazenamento permanente.
7. **Licenças de Código** – Todo o código deve ser open‑source (MIT) e não pode incluir dependências que exigem licenças comerciais.

---

> **Observação Final:**  
> Todos os requisitos foram formulados para permitir uma implementação ágil, com ciclos de release curtos (sem mais que 2 semanas por sprint). A equipe deve priorizar a entrega do MVP contendo RF‑01, RF‑02, RF‑03, RF‑04, RF‑05 e RF‑06 antes de evoluir para funcionalidades opcionais (RF‑08, RF‑09, RF‑10).  

---

## Plano do Projeto

# Plano de Projeto – “Fico em Casa Hoje?” (FEH)

## 1. Objetivos do Projeto  
O projeto **“Fico em Casa Hoje?”** tem como finalidade fornecer, de forma ultrassimplificada e sem atrito, uma resposta imediata (“SIM” ou “NÃO”) para os cidadãos do Recife e Região Metropolitana sobre a necessidade de permanecerem em casa no início da manhã.  

| Objetivo | Descrição | Métrica de Sucesso |
|----------|-----------|--------------------|
| **Reduzir incidentes de mobilidade urbana** | Diminuição das ocorrências de pessoas sendo atingidas por enchentes matinais, evitando congestionamentos e danos materiais. | Taxa de incidentes menores que 20 % em relação ao período pré‑implementação (período de 3 meses). |
| **Agilizar a tomada de decisão** | Garantir que a informação crítica esteja disponível para cada cidadão dentro de < 1,5 s após o acesso à página. | 95 % das requisições respondidas em ≤ 1,5 s. |
| **Maximizar a confiabilidade dos dados abertos** | Integrar de forma resiliente APIs públicas (meteorológicas, marítimas e fluviais) com tolerância a falhas externas. | Taxa de disponibilidade do sistema ≥ 99,9 % anual. |
| **Promover cultura de prevenção** | Educar usuários sobre os fatores que geram risco de ilhamento urbano através de justificativas curtas e contextualizadas. | 80 % dos usuários que acessam a página confirmam compreensão da causa via pesquisa pós‑uso (NPS > 70). |

## 2. Escopo do Projeto  
O escopo está dividido em **Módulos Funcionais** (o que será entregue) e **Limitações de Entrega** (o que não será entregue nesta primeira versão).

### 2.1 Módulos Funcionais
| Módulo | Descrição | Dependências |
|--------|-----------|--------------|
| **Frontend – Página Única** | HTML/CSS/JS responsivo, sem login, exibindo decisão e justificativa. | RF‑01, RF‑06, RF‑07 |
| **Backend – API de Dados** | Serviço REST que coleta dados das APIs externas, executa modelo XGBoost, armazena em Redis e expõe `/`, `/rss`, `/metrics`. | RF‑02, RF‑03, RF‑05, RF‑10 |
| **Job Scheduler** | Job cron/airflow rodando às 05h30, realizando fetch + inferência. | RF‑02 |
| **Cache & Persistência** | Redis TTL 24 h para decisões; logs em bucket S3 (retenção 30 dias). | RF‑03, RNF‑08 |
| **Fallback Estático** | Página estática em caso de falha externa. | RF‑04 |
| **RSS Feed** | Endpoint `/rss` gerando item diário. | RF‑05 |
| **Exportação PNG** | Botão “Imprimir” usando html2canvas ou similar. | RF‑09 |
| **Geolocalização Opcional** | Prompt de consentimento + exibição de vias críticas via IP. | RF‑08 |
| **Métricas & Logs** | Prometheus `/metrics`; logs estruturados JSON. | RF‑10, RF‑11 |

### 2.2 Limitações de Entrega
- **Integração com transporte público** (webhook opcional) será entregue em *Sprint 5*.
- **Histórico diário em gráfico** no footer é funcionalidade opcional para *Sprint 6*.
- **Notificações push via celular** não estão previstas neste ciclo inicial.
- **Armazenamento de dados persistentes (banco relacional)** será evitado; apenas Redis e logs.

## 3. Cronograma  
A execução segue ciclos ágeis (sprints) de 2 semanas, totalizando 8 sprints (16 semanas). Cada sprint tem objetivo específico:

| Sprint | Data Início | Data Término | Objetivo Principal | Entregáveis |
|--------|-------------|--------------|--------------------|-------------|
| **Sprint 1** | 01/10/2026 | 15/10/2026 | Configuração de infraestrutura, Docker, CI/CD. | Dockerfiles, GitHub Actions, pipeline Terraform |
| **Sprint 2** | 16/10/2026 | 30/10/2026 | Implementação do job scheduler e coleta de dados (Open‑Meteo). | Script Python, cronjob, testes unitários |
| **Sprint 3** | 31/10/2026 | 14/11/2026 | Integração da Marinha do Brasil (maré) e CEMADEN (nível fluvial). | Modulo de fetcher, mocks, documentação |
| **Sprint 4** | 15/11/2026 | 29/11/2026 | Desenvolvimento do modelo XGBoost + API `/` + cache Redis. | Modelo treinado, endpoints REST, testes de carga |
| **Sprint 5** | 30/11/2026 | 14/12/2026 | Implementação do RSS feed e fallback estático. | Endpoint `/rss`, página de erro estática |
| **Sprint 6** | 15/12/2026 | 29/12/2026 | Frontend completo, tema dinâmico, export PNG, geolocalização opcional. | Página HTML/CSS/JS, modal de consentimento |
| **Sprint 7** | 30/12/2026 | 13/01/2027 | Métricas Prometheus + logs estruturados; testes de performance. | `/metrics` endpoint, Grafana dashboard mock |
| **Sprint 8** | 14/01/2027 | 28/01/2027 | Testes de integração, QA final, documentação e lançamento beta. | Release no staging, documentação técnica, plano de rollout |

### Linha do Tempo (Gantt)
```
| Sprint | Jan | Feb | Mar |
|--------|-----|-----|-----|
| 1      | ███ |     |     |
| 2      |   ███|     |     |
| 3      |     | ███ |     |
| 4      |     |   ███|     |
| 5      |     |     | ███ |
| 6      |     |     |   ███|
| 7      |     |     |     |
| 8      |     |     |     |
```

## 4. Recursos Necessários  
### 4.1 Equipe Técnica
| Papel | Responsabilidades | Horas/semana |
|-------|-------------------|--------------|
| **Product Owner (PO)** | Definir backlog, priorizar features, validar entregas. | 20h |
| **Scrum Master** | Facilitar cerimônias ágeis, remover impedimentos. | 15h |
| **Backend Engineer** (2) | API, job scheduler, modelo ML, cache. | 40h/semana cada |
| **Frontend Engineer** (1) | Página única, temas, export PNG, geolocalização. | 30h |
| **Data Scientist** (1) | Treinamento XGBoost, validação de modelos. | 20h |
| **DevOps / SRE** (1) | Infraestrutura Docker/K8s, CI/CD, monitoramento. | 25h |
| **QA Engineer** (1) | Testes unitários, integração, performance, acessibilidade. | 15h |
| **Technical Writer** (0.5) | Documentação interna e externa. | 10h |

### 4.2 Ferramentas & Licenças
- **Infraestrutura Cloud**: AWS region `sa-east-1` – EC2 t3.medium, ECR, Elastic Container Service, RDS ElastiCache Redis.
- **CI/CD**: GitHub Actions (free) + Docker Hub (public).
- **Observabilidade**: Prometheus + Grafana (open source), Loki para logs.
- **ML Framework**: XGBoost 1.7 (Python).
- **Frontend**: React 18, Tailwind CSS, html2canvas.
- **Bibliotecas de Geolocalização**: `ipinfo.io` (gratuito) para IP lookup.

### 4.3 Infraestrutura de Rede
- CDN via CloudFront para servir a página estática em cache global.
- HTTPS via ACM (AWS Certificate Manager).
- IAM roles restritos; secrets no AWS Secrets Manager.

## 5. Orçamento  
| Item | Custo Mensal (R$) | Duração (meses) | Total (R$) |
|------|------------------|-----------------|------------|
| **Infraestrutura Cloud** | 1 200,00 | 8 | 9 600,00 |
| **Licenças de Software** | 300,00 | 8 | 2 400,00 |
| **Equipe Técnica (salários)** | 70 000,00 | 8 | 560 000,00 |
| **Despesas Operacionais** (domínio, backup, etc.) | 200,00 | 8 | 1 600,00 |
| **Contingência 10%** | - | - | 56 400,00 |
| **Total Geral** | | | **629 000,00** |

*Obs.: Salários são estimativas médias de mercado (Brasil).*

## 6. Riscos  
| ID | Descrição | Probabilidade | Impacto | Mitigação |
|----|------------|--------------|---------|-----------|
| R01 | Falha na API da Marinha do Brasil (maré) | Média | Alta | Implementar retries + fallback estático; cache de última versão válida. |
| R02 | Dados meteorológicos fora de alcance (ex.: falta de previsão) | Baixa | Média | Usar fonte alternativa Open‑Meteo; validar consistência antes da inferência. |
| R03 | Sobrecarga no Redis devido a picos de acesso matutino | Média | Alta | Escalar Redis via Auto Scaling; monitorar TTL. |
| R04 | Modelo XGBoost não convergindo com poucos dados históricos | Baixa | Média | Realizar validação cruzada, usar regularização L2, fallback regra heurística. |
| R05 | Incorreta interpretação de risco (falsos positivos) | Média | Alta | Testes A/B; monitorar métricas de engajamento e feedback dos usuários. |
| R06 | Problemas de compliance LGPD na geolocalização opcional | Baixa | Média | Não armazenar IP, apenas usar para exibição instantânea; obter consentimento via modal. |
| R07 | Falha de CI/CD impedindo deploy | Baixa | Alta | Pipelines idempotentes, rollback automático. |

## 7. Comunicação  
### 7.1 Cadência de Reuniões
- **Daily Stand‑up** (online) – 15 min.  
- **Sprint Review** – ao fim de cada sprint (30 min).  
- **Sprint Retrospective** – ao fim de cada sprint (45 min).  

### 7.2 Relatórios de Status
- **Dashboard de Projeto** (Jira + Confluence) – atualização diária dos tickets.  
- **Email semanal** (para stakeholders chave: Prefeitura, ONG de mobilidade) – resumo das entregas e métricas.

### 7.3 Documentação Técnica
- **Repositório GitHub** – README, CONTRIBUTING.md, docs/ folder.  
- **Wiki Confluence** – arquitetura, decisões de design, instruções de deploy.  

## 8. Qualidade  
| Critério | Ferramenta / Processo | Meta |
|----------|------------------------|------|
| **Cobertura de testes unitários** | PyTest (backend), Jest (frontend) | ≥ 80 % |
| **Teste de performance** | k6, Locust | 95 % das requisições < 1,5 s |
| **Acessibilidade WCAG AA** | axe-core, Lighthouse | Passar todas as verificações |
| **Revisão de código** | Pull Requests no GitHub + revisão obrigatória | 2 revisores por PR |
| **Documentação** | Docstrings + Sphinx (Python), Storybook (React) | Atualizada antes do merge |

## 9. Stakeholders (Partes Interessadas)  
| Nome / Cargo | Organização | Interesses / Expectativas |
|--------------|-------------|---------------------------|
| **Maria Silva – Coordenadora de Mobilidade Urbana** | Prefeitura do Recife | Redução de incidentes, dados públicos confiáveis |
| **João Pereira – Gestor de Operações de Transporte** | Empresa de ônibus municipal | Integração opcional via webhook para ajuste de rotas |
| **Ana Costa – Diretora de Tecnologia** | Governo Regional | Segurança, compliance LGPD, infraestrutura escalável |
| **Pedro Almeida – Representante da Comunidade (Associação)** | Associação de Moradores do Bairro X | Transparência nas decisões, feedback em tempo real |
| **Equipe Técnica FEH** | Desenvolvedores internos / freelancers | Entrega dentro do prazo, qualidade técnica |
| **Usuários Finais** | Moradores e trabalhadores do Recife | Informação rápida, confiável, sem cadastro |

## 10. Gerenciamento de Mudanças  
### 10.1 Processo
1. **Proposta de mudança (Change Request – CR)** enviada via Jira Ticket “CR-xxxx”.  
2. **Avaliação Técnica** pelo Product Owner + Scrum Master: impacto no escopo, cronograma e orçamento.  
3. **Aprovação**: Se aprovado, ticket é movido para backlog do sprint atual ou futuro; se não, notificação de rejeição com justificativa.  
4. **Implementação**: Código desenvolvido em branch “feature/CR-xxxx”.  
5. **Revisão e Merge**: Revisão obrigatória por 2 peers.  
6. **Deploy**: CI/CD executa build/teste; deploy para staging, QA, depois produção após aprovação de QA.

### 10.2 Controle de Versões
- **Versionamento Semântico** (MAJOR.MINOR.PATCH).  
- Tag oficial no GitHub ao cada release (`v1.0.0`, `v1.1.0` etc.).  

### 10.3 Comunicação de Mudanças
- Atualização automática no changelog Markdown no repositório.  
- Notificação por e‑mail aos stakeholders quando um CR é aprovado/implementado.  

---  

> **Observação Final**: O plano acima foi elaborado para garantir entregas rápidas, confiáveis e de alto impacto social, respeitando as restrições de dados abertos e a necessidade de operar em infraestrutura brasileira com custo controlado. A equipe deve seguir rigorosamente o cronograma, os critérios de qualidade e o processo de mudanças para minimizar retrabalho e atrasos.

## Escopo do Projeto

### 1. Descrição do Projeto


**Descrição**

O projeto "Fico em Casa Hoje?" (FEH) é uma aplicação web ultrassimplificada, desenvolvida para a Região Metropolitana de Recife (RMR), que fornece aos usuários uma resposta instantânea – SIM ou NÃO – sobre a necessidade de permanecerem em casa no início da manhã devido ao risco de ilhamento urbano. O objetivo principal é reduzir incidentes de mobilidade urbana e aumentar a segurança pública por meio do fornecimento de informações atualizadas, confiáveis e baseadas em dados abertos meteorológicos, marítimos e fluviais. A aplicação opera sem cadastro ou login, exibindo apenas uma página única que reflete visualmente o resultado do modelo preditivo treinado com histórico local. O fluxo de decisão ocorre diariamente às 05h30 (horário de Recife), após a coleta dos dados públicos e a execução de um algoritmo XGBoost que gera um índice de risco entre 0 % e 100 %. Este índice determina se o usuário deve “Ficar em Casa” (risco >65 %) ou pode “Sair” (risco ≤65 %). A solução também disponibiliza um feed RSS diário, métricas Prometheus e logs estruturados para monitoramento. O escopo engloba a coleta de dados via APIs abertas, processamento, inferência, cache, apresentação visual, fallback estático em caso de falha externa e integração opcional com geolocalização e exportação PNG.

**Dentro do Escopo**

- Coleta automática diária das APIs Open‑Meteo (chuva), Marinha do Brasil (maré) e CEMADEN/APAC (nível fluvial);
- Treino e execução do modelo XGBoost que calcula o índice de risco;
- Persistência da decisão em cache Redis com TTL 24 h;
- Entrega de página única HTML/CSS/JS responsiva sem login;
- Mudança de tema visual baseado na decisão (neutro/azul ou alerta vermelho/orange);
- Exibição de justificativa curta (≤90 caracteres) contendo fatores críticos;
- Endpoint `/rss` gerando item diário com título e corpo;
- Fallback estático exibindo mensagem de erro em caso de falha externa;
- Exportação PNG da página atual via botão Imprimir;
- Geolocalização opcional baseada no IP do usuário com consentimento;
- Métricas Prometheus expostas em `/metrics`;
- Logs estruturados JSON gravados em bucket S3/Cloud Storage;
- Infraestrutura Docker/K8s hospedada na região brasileira (AWS/GCP);
- Integração opcional de webhook para sistemas externos via POST;
- Teste de carga, acessibilidade WCAG 2.1 AA e compatibilidade navegadores modernos.
- 

**Fora do Escopo**

- Banco relacional persistente além do cache Redis;
- Serviços pagos ou APIs proprietárias não públicas;
- Cadastro/registro de usuários ou autenticação OAuth;
- Notificações push via celular;
- Análise geoespacial avançada (ex.: mapas interativos em tempo real);
- Integração com sistemas de transporte público fora do webhook opcional;
- Armazenamento permanente de logs mais que 30 dias;
- Desenvolvimento de aplicativos móveis nativos;
- Gerenciamento de incidentes de segurança além das métricas básicas;

**Premissas**

- As APIs externas (Open‑Meteo, Marinha, CEMADEN) estarão disponíveis e em conformidade com os termos de uso;
- O modelo XGBoost pode ser treinado a partir de dados históricos acessíveis publicamente e terá performance adequada para 10k requisições simultâneas;
- Redis pode ser provisionado com TTL 24 h sem custos adicionais significativos;
- Os usuários acessarão principalmente via dispositivos móveis, então o design deve ser mobile‑first;
- O horário local de Recife (UTC−3) será considerado fixo para a execução do job diário;
- A política LGPD permite a coleta de IP apenas para geolocalização opcional sem armazenamento permanente;
- As métricas Prometheus e logs serão coletados por serviços internos sem custos extras;
- A infraestrutura escolhida (AWS/GCP) terá capacidade suficiente para 8 h de pico matutino;
- O código será open‑source sob licença MIT, permitindo livre distribuição e fork;

## Arquitetura do Projeto

### Documento de Arquitetura do Sistema "Fico em Casa Hoje?"


**Descrição**

## 1. Introdução
O projeto **Fico em Casa Hoje? (FEH)** é uma aplicação web ultrassimplificada que fornece, sem cadastro e sem login, a decisão diária de **SIM** ou **NÃO** sobre se os cidadãos da Região Metropolitana do Recife devem permanecer em casa no início da manhã devido ao risco de ilhamento urbano. O documento descreve a arquitetura proposta, justificando cada escolha técnica, alinhada aos requisitos funcionais, não‑funcionais e restrições apresentadas.

## 2. Visão Geral da Arquitetura
A solução segue um padrão **Microserviço + Serverless** híbrido, composto por três camadas principais: **Apresentação**, **Domínio** e **Infraestrutura**. A camada de apresentação hospeda a página única em CDN, enquanto os domínios de negócio são implementados como funções serverless (AWS Lambda) que consomem APIs públicas, executam o modelo XGBoost e interagem com Redis para cache.

- **Front‑end**: SPA React hospedada no CloudFront + S3. 
- **API Gateway**: Enfileira requisições HTTP, valida rate limits e autentica webhooks opcionalmente. 
- **Lambda Functions**: `DataFetcher`, `RiskPredictor`, `RSSGenerator` e `StaticFallback`. 
- **Redis ElastiCache**: Armazena a decisão diária (TTL 24 h). 
- **S3 / CloudWatch Logs**: Guarda logs estruturados JSON, histórico de decisões por 30 dias. 
- **Prometheus + Grafana**: Métricas expostas em `/metrics`. 

A comunicação interna utiliza REST sobre HTTPS com payloads JSON e Webhooks POST (opcional). A integração externa (APIs públicas) respeita limites via `Retry‑After` headers, backoff exponencial e circuit breaker.

## 3. Diagrama de Componentes
1. **User Interface (React SPA)** – Servida por CloudFront/S3, consome `/api/decision`. 
2. **API Gateway** – Endpoint único (`/api/*`) que roteia para Lambda apropriado, aplica throttling e captura logs. 
3. **Lambda DataFetcher** – Busca dados de Open‑Meteo (chuva), Marinha do Brasil (maré) e CEMADEN/APAC (nível fluvial). Utiliza `httpx` async com timeouts 5s e retry policy.
4. **Lambda RiskPredictor** – Recebe payload JSON, carrega modelo XGBoost serializado em S3, calcula risco, decide tema e salva no Redis (`feh:decision:{date}`).
5. **Lambda RSSGenerator** – Executado por CloudWatch Events (05:30), lê decisão do Redis, gera XML RSS e grava em S3.
6. **StaticFallback Lambda** – Servidor de página estática para erros externos; retorna 200 com mensagem amigável.
7. **Redis ElastiCache** – Armazenamento chave‑valor TTL 86400s.
8. **S3 Buckets** – `feh-static` (HTML, JS), `feh-logs`, `feh-models`, `feh-rss`.
9. **CloudWatch / Prometheus** – Métricas de latência, erro, volume de chamadas.

## 4. Interface do Usuário (UI)
*Descrição:* SPA React com abordagem mobile‑first, renderizando a decisão e justificativa em um layout minimalista. A transição de tema é gerenciada por CSS custom properties e animações CSS3 de 0.3s.

*Tecnologias:* 
- **React 18** (hooks, context) + **TypeScript**
- **Tailwind CSS v3** (utility‑first, dark mode alternativo)
- **html2canvas** para exportação PNG
- **react-router-dom** (única rota `/`)
- **Axios** para chamada à API de decisão.

*Funcionalidades:* 
1. Exibição instantânea da resposta (`SIM/NÃO`) em fonte grande 48 px.
2. Tema dinâmico: azul neutro (Sair) vs vermelho/alaranjado (Ficar).
3. Justificativa curta ≤90 caracteres.
4. Botão “Imprimir” que gera PNG via `html2canvas` e abre download.
5. Ícone RSS que direciona a `/rss`.
6. Prompt de geolocalização opcional (IP lookup) com consentimento modal.
7. Acessibilidade WCAG 2.1 AA: contraste 4.5:1, navegação por teclado, ARIA labels.

## 5. Controladores (Controllers)
*Descrição:* Camada de controle em API Gateway + Lambda, responsável por receber HTTP requests, validar payloads, invocar serviços e montar respostas.

*Tecnologias:* 
- **AWS API Gateway v2** (HTTP APIs) – roteamento, throttling 200 rps.
- **Python 3.12** Lambdas com `FastAPI` para handlers leves.
- **Pydantic** para validação de entrada/saída JSON.

*Funcionalidades:* 
1. `/api/decision` – GET: devolve JSON `{ decision, justification }`. Invoca `RiskPredictor` via cache.
2. `/api/rss` – GET: proxy para bucket S3.
3. `/api/webhook/notify` – POST opcional, valida token via Cognito Identity.
4. Fallback 404 → chama `StaticFallback`.

## 6. Serviços (Services)
*Descrição:* Camada de negócio encapsulada em Lambdas independentes que executam lógica específica.

*Tecnologias:* 
- **Python 3.12** com `scikit-learn`, `xgboost`.
- **Boto3** para acesso S3, Redis.
- **httpx** async HTTP client.

*Funcionalidades:* 
1. **DataFetcherService** – Coleta dados das APIs externas, normaliza em dict.
2. **RiskPredictionService** – Carrega modelo XGBoost (`model.pkl`), faz inferência, calcula risco percentagem, retorna decisão e justificativa.
3. **CacheService** – Interface Redis wrapper; set/get TTL 86400.
4. **RSSService** – Gera XML RSS a partir da decisão diária.
5. **FallbackService** – Gera HTML estático de erro.

## 7. Banco de Dados (Database)
*Descrição:* Armazenamento em Redis ElastiCache para alta performance e TTL automático; logs em S3; modelo XGBoost persistido em S3.

*Tecnologias:* 
- **Redis 6** – chave‑valor, TTL 24 h.
- **Amazon S3** – buckets `feh-models`, `feh-logs`, `feh-rss`.
- **CloudWatch Logs** – coleta logs estruturados JSON.

*Funcionalidades:* 
1. Armazenar decisão diária (`key: feh:decision:{date}`) com TTL.
2. Persistir modelo e métricas de treino (pasta `feh-models`).
3. Rotina de limpeza automática dos logs antigos via Lambda Scheduler.

## 8. Visão de Implantação
A implantação segue **IaC** usando Terraform (AWS provider). Estratégia:
1. **CI/CD Pipeline**: GitHub Actions → lint, test, build Docker image (Lambda layers), push para ECR.
2. **Deployment**: CloudFormation stack ou Terraform module atualiza Lambdas e API Gateway.
3. **Canary Rollout**: 10% traffic → monitor métricas → roll‑back automático em caso de erro >5%.
4. **Blue/Green**: Mantém versão estável enquanto a nova é testada.
5. **Observability**: Prometheus via CloudWatch exporter; Grafana dashboards internos.
6. **Backup e Disaster Recovery**: Snapshots do Redis (RDB) diariamente, cópia de S3 em outra região.

Estratégia de escalabilidade horizontal: Lambda auto‑scaling (concurrency 1000), API Gateway throttling, CloudFront caching 1h.

## Decisões Arquiteturais Relevantes
- **Serverless vs. VM**: Escolha Lambda para redução de custos operacionais e escala automática; mitigado risco de cold start via provisioned concurrency 50.
- **Redis como cache**: Evita chamadas repetidas a APIs externas, garante resposta <1s.
- **S3 para estático + logs**: Custo baixo e durabilidade garantida.
- **React SPA**: Único ponto de entrada, reduz necessidade de SSR, melhor performance mobile.
- **API Gateway**: Centraliza throttling, autenticação opcional via Cognito, facilita versionamento.
- **XGBoost**: Escolha modelo leve, alto desempenho em Python; serializado com joblib.
- **Política de fallback**: Garantia de experiência mesmo quando APIs externas falham.
- **Geolocalização IP**: Opcional, não persiste dados, cumpre LGPD.
- **RSS feed**: Implementado como Lambda Scheduler + S3, mantém compatibilidade com leitores.

Este documento fornece a base para implementação detalhada, garantindo que todos os requisitos sejam atendidos de forma segura, escalável e de alta disponibilidade.

**Componentes**


#### User Interface (React SPA)

SPA minimalista renderizando decisão e justificativa.

#### API Gateway (HTTP API)

Roteador de requisições HTTP para Lambdas, throttling e logs.

#### Lambda DataFetcher

Coleta dados das APIs externas via httpx.

#### Lambda RiskPredictor

Carrega modelo XGBoost, calcula risco e armazena em Redis.

#### Lambda RSSGenerator

Cria feed RSS diário e grava em S3.

#### Lambda StaticFallback

Serviço de página estática em caso de falha externa.

#### Redis ElastiCache

Armazenamento chave‑valor TTL 24h para decisão diária.

#### S3 Buckets (static, logs, models, rss)

Persistência de arquivos estáticos, logs estruturados e modelo serializado.

#### CloudWatch & Prometheus Exporter

Coleta métricas de latência, erro e volume de chamadas.

**Decisões de Arquitetura**

- Escolha Serverless (Lambda) para reduzir custos operacionais; mitigado risco de cold start com provisioned concurrency 50.
- Utilização de Redis como cache para evitar chamadas repetidas a APIs externas, garantindo resposta <1s.
- Armazenamento de estático e logs em S3 devido à durabilidade garantida e baixo custo.
- React SPA escolhido pela simplicidade, performance mobile e menor overhead comparado a SSR.
- API Gateway centraliza throttling, autenticação opcional e facilita versionamento das APIs.
- XGBoost selecionado pelo desempenho em classificação binária com poucos recursos de hardware; serializado com joblib para carga rápida.
- Implementação de fallback estático garante experiência do usuário mesmo quando APIs externas falham.
- Geolocalização baseada em IP opcional, sem persistência, cumprindo LGPD.
- RSS feed gerado por Lambda Scheduler + S3 mantém compatibilidade com leitores e automações.

## Épicos

### Tela Inicial – Decisão Única

Página única que exibe a decisão do dia (SIM ou NÃO) e justificativa curta, sem login nem navegação.

**Funcionalidades**

- Exibição da decisão em fonte grande 48 px centralizada.
- Tema dinâmico baseado na decisão: azul neutro para "Sair" e vermelho/laranja para "Ficar".
- Transição suave de tema (0.3 s) ao carregar a página ou após alteração de decisão.
- Justificativa curta (≤90 caracteres) abaixo da decisão, com fonte 18 px.
- Botão “Imprimir” que gera PNG via html2canvas e abre download.
- Ícone RSS que redireciona para `/rss`.
- Prompt de geolocalização opcional via IP (consentimento modal).
- Fallback estático em caso de falha das APIs externas.

**BDD**

{"features":[{"name":"Exibir Decisão do Dia","scenarios":[{"title":"Decisão SIM exibida corretamente com tema azul neutro","given":["Usuário acessa a página sem parâmetros de consulta"],"when":["A API interna retorna decisão 'SIM' e justificativa curta"],"then":["Página exibe texto 'SIM' em fonte 48px centralizado","Tema da página tem cor base #3498db (azul neutro)","Transição CSS de 0.3s ocorre ao carregar a página"]},{"title":"Decisão NÃO exibida corretamente com tema vermelho/laranja","given":["Usuário acessa a página sem parâmetros"],"when":["A API interna retorna decisão 'NÃO' e justificativa curta"],"then":["Página exibe texto 'NÃO' em fonte 48px centralizado","Tema da página tem cor base #e67e22 (laranja) ou #c0392b (vermelho)","Transição CSS de 0.3s ocorre ao carregar a página"]},{"title":"Justificativa curta exibida abaixo da decisão","given":["A API retorna justificativa 'Evite sair para evitar risco']"],"when":["Página renderiza decisão"],"then":["Texto abaixo do título tem tamanho 18px e não excede 90 caracteres","Centralizado horizontalmente"]},{"title":"Botão Imprimir gera PNG via html2canvas","given":["Usuário clica no botão Imprimir"],"when":["Script html2canvas captura o DOM da página"],"then":["Gera arquivo PNG de 800x600 px contendo a decisão e justificativa","Inicia download automático com nome 'decisao-dia.png'"]},{"title":"Ícone RSS redireciona para /rss","given":["Usuário clica no ícone RSS"],"when":["Evento click é disparado"],"then":["Navega para URL '/rss' sem recarregar a página"]},{"title":"Geolocalização opcional via IP com modal de consentimento","given":["A API de geolocalização por IP falha ou usuário não aceita"],"when":["Usuário clica no botão 'Localizar-me'"],"then":["Exibe modal pedindo permissão para usar IP","Se aceito, faz chamada à API e exibe mensagem 'Localizado em São Paulo'"]},{"title":"Fallback estático quando APIs externas falham","given":["API de decisão do dia está indisponível"],"when":["Página carrega"],"then":["Exibe decisão padrão 'NÃO' com justificativa curta 'Falha na API'"]}]}]}

**User Stories**


#### US-03: Tema dinâmico baseado na decisão

Como visitante da página, quero que o tema (cores) mude automaticamente de acordo com a decisão para reforçar visualmente o resultado.

_Critérios de Aceite_

- Quando `value` for "SIM", aplicar esquema de cores neutro (azul #3b82f6) como fundo principal.
- Quando `value` for "NÃO", aplicar esquema laranja/vermello (#ff9c00). O contraste mínimo WCAG AA deve ser garantido para texto e ícones.
- A transição entre temas deve durar 0.3 s, usando CSS transition.
- Tema deve ser aplicado logo após a decisão ser carregada, sem flicker.

_Subtarefas_

- Definir variáveis CSS: --primary-bg, --primary-text
- Criar efeito de transição no body

#### US-07: Fallback estático em caso de falha das APIs externas

Como usuário, quero que a página exiba conteúdo estático quando as APIs externas (decisão, localização) falharem para garantir disponibilidade.

_Critérios de Aceite_

- Se `/api/decision` retornar erro 5xx ou timeout > 3s, usar JSON estático: `{ "value": "SIM", "justification": "Decisão padrão." }`.
- Se `/api/location` falhar, ignorar localização e continuar com decisão global.
- O fallback deve ser documentado no log console (console.warn).
- Usuário deve ver mensagem discreta “Utilizando dados estáticos” se não houver API.

_Subtarefas_

- Implementar retry logic 3 vezes
- Criar arquivo `fallback.json`

#### US-05: Ícone RSS para feed de decisões

Como usuário interessado em acompanhar histórico, quero um ícone RSS que redirecione para `/rss` ao ser clicado.

_Critérios de Aceite_

- Ícone deve ser visível no canto superior esquerdo.
- O link deve abrir a URL `/rss` em nova aba (`target="_blank"`).
- Tooltip “Feed RSS” aparecerá ao hover.
- Icone usar SVG de cor compatível com tema atual.

_Subtarefas_

- Adicionar componente RssIcon
- Configurar rota `/rss` no servidor

#### US-02: Exibir justificativa curta abaixo da decisão

Como usuário, quero ver uma justificativa breve (≤90 caracteres) logo abaixo da decisão para entender o raciocínio sem sobrecarregar a página.

_Critérios de Aceite_

- A justificativa deve aparecer em fonte de 18 px, alinhada ao centro.
- O texto exibido não pode exceder 90 caracteres; se a resposta da API for maior, truncar e adicionar "…" no final.
- Se a justificativa for vazia ou nula, exibir “Justificativa indisponível”.
- O componente deve ter espaçamento vertical de 20 px entre decisão e justificativa.

_Subtarefas_

- Criar utilitário truncateString(str, maxLen)

#### US-01: Exibir a decisão do dia em fonte grande e centralizada

Como usuário que acessa a página única, quero ver a decisão (SIM ou NÃO) exibida em fonte de 48 px centralizada na tela, para compreender rapidamente o resultado sem precisar procurar informações.

_Critérios de Aceite_

- O texto da decisão deve ser renderizado em fonte de 48 px.
- A decisão deve estar horizontal e verticalmente centralizada dentro do viewport.
- A página deve funcionar em dispositivos desktop (≥1024 px) e mobile (≤768 px) mantendo a centralização sem scroll horizontal.
- O conteúdo da decisão deve ser carregado via fetch de `/api/decision` que retorna `{ "value": "SIM" | "NÃO", "justification": "..." }`.
- Se o endpoint falhar, o componente deve exibir “DECISÃO NÃO DISPONÍVEL” em negrito como fallback.

_Subtarefas_

- Implementar fetch de `/api/decision` com tratamento de erro
- Criar componente DecisionDisplay que aplica estilo 48 px e centralização

#### US-06: Prompt de geolocalização opcional via IP

Como visitante, quero ser oferecido um modal que pergunta se deseja usar a localização baseada em IP para personalizar a decisão.

_Critérios de Aceite_

- Modal deve aparecer somente na primeira visita (usando cookie `geo_prompt_shown`).
- Mensagem: “Deseja que usamos sua localização aproximada via IP para exibir decisões locais?”
- Botões: "Sim" e "Não".
- Se selecionar "Sim", chamar API `/api/location` com header `Accept-Language` e usar coordenadas retornadas no request de decisão.
- Se selecionar "Não" ou fechar, continuar sem localização.
- O modal deve ser acessível (aria-modal=true, foco inicial nos botões).

_Subtarefas_

- Criar hook useGeolocationPrompt()
- Implementar cookie tracking

#### US-04: Imprimir decisão e justificativa como PNG

Como usuário que deseja compartilhar a decisão offline, quero clicar em um botão “Imprimir” para gerar uma imagem PNG da tela atual e iniciar o download.

_Critérios de Aceite_

- Botão deve estar visível no canto inferior direito.
- Ao clicar, usar `html2canvas` para capturar todo o conteúdo dentro de `<div id="decision-container">`.
- Gerar arquivo PNG com nome padrão `decisão_<timestamp>.png` e iniciar download automaticamente.
- Se a captura falhar (ex.: erro de CORS), exibir alerta modal informando “Falha ao gerar imagem. Tente novamente.”

_Subtarefas_

- Instalar html2canvas via npm
- Criar função captureAndDownload()
- Adicionar fallback error handling

### Feed RSS – Página de Exibição

Página que apresenta o último item do feed RSS gerado diariamente, útil para usuários que preferem leitores de feed.

**Funcionalidades**

- Lista com título, link e snippet da justificativa.
- Botão “Download RSS” que baixa o arquivo XML.
- Estilo minimalista em branco com ícone RSS.
- Acessibilidade WCAG 2.1 AA.

**BDD**

{"features":[{"name":"Exibir último item do feed RSS","scenarios":[{"title":"Verificar exibição correta do título, link e snippet da justificativa do último item do feed RSS","given":["A aplicação está em execução no ambiente de produção"],"when":["O usuário navega até a página dedicada ao último item do feed RSS"],"then":["A página exibe o título completo do último artigo publicado na fonte de dados RSS","O link exibido corresponde exatamente à URL do artigo original e abre em uma nova aba quando clicado","Um snippet da justificativa, contendo no mínimo 200 caracteres e máximo 400 caracteres, é mostrado abaixo do título","A estrutura visual segue um estilo minimalista com fundo branco e ícone RSS visível no cabeçalho"]}]}]}

**User Stories**


#### Estilo minimalista branco com ícone RSS

Como usuário que aprecia design limpo, desejo que a página siga um estilo minimalista com fundo branco e o ícone RSS visível.

_Critérios de Aceite_

Fundo branco (#FFFFFF). Fonte sans-serif. Ícone RSS (SVG) no cabeçalho à esquerda do título, tamanho 32x32px, cor #000. Todos os textos em contraste mínimo AA contra fundo.

_Subtarefas_

- Adicionar CSS variables
- Integrar SVG icon

#### Conformidade WCAG 2.1 AA para acessibilidade

Como usuário com necessidades de acessibilidade, quero que a página atenda ao padrão WCAG 2.1 AA.

_Critérios de Aceite_

Contrast ratio mínimo 4.5:1 entre texto e fundo; todos os elementos interativos têm foco visível; uso correto de aria-labels; estrutura semântica adequada (header, main, footer).

_Subtarefas_

- Implementar role="navigation" no header
- Adicionar tabindex nos links

#### Exibir link funcional e abrindo em nova aba

Como usuário que deseja ler o artigo completo, quero que o link do último item esteja correto e abra em uma nova aba para manter minha navegação.

_Critérios de Aceite_

O link exibido deve ser exatamente a URL do <link> no feed RSS.
Ao clicar, abre em nova aba (_blank) com atributo rel="noopener noreferrer". A href deve passar validação de URL absoluta.

_Subtarefas_

- Renderizar link em <a> com target="_blank"
- Adicionar atributos de segurança

#### Mostrar snippet da justificativa entre 200 e 400 caracteres

Como usuário que quer ter uma visão rápida do conteúdo, preciso ver um trecho (snippet) da justificativa do artigo com tamanho controlado.

_Critérios de Aceite_

O snippet extraído deve conter no mínimo 200 e no máximo 400 caracteres.
Não deve cortar palavras ao meio; corte em espaços próximos. Exemplo: "Este artigo aborda..."

_Subtarefas_

- Parsear campo <description> ou <content> do feed
- Aplicar lógica de corte com regex

#### Exibir título completo do último item do feed RSS

Como usuário que prefere leitores de feed, quero ver o título completo do último artigo publicado para saber rapidamente sobre o conteúdo.

_Critérios de Aceite_

O título exibido corresponde exatamente ao campo <title> do XML do feed e é truncado apenas se exceder 100 caracteres com ellipsis. Deve ser responsivo em dispositivos móveis.
A página deve carregar o título dentro de 2 segundos após navegação.

_Subtarefas_

- Buscar feed RSS via endpoint /api/rss/latest
- Renderizar título em <h1> com classe .rss-title

#### Botão Download RSS funcional

Como usuário que usa leitores externos, quero um botão para baixar o arquivo XML completo do feed.

_Critérios de Aceite_

Ao clicar no botão "Download RSS", inicia download automático do arquivo XML (.xml). O nome sugerido deve ser rss-YYYYMMDD.xml. O cabeçalho Content-Disposition correto deve ser enviado pelo servidor.

_Subtarefas_

- Implementar endpoint /api/rss/download
- Adicionar botão <button> com aria-label

### Dashboard de Métricas (Interno)

Página interna para monitoramento do backend, exibindo métricas Prometheus e logs estruturados.

**Funcionalidades**

- Gráficos de latência das chamadas externas (Open‑Meteo, Marinha, CEMADEN).
- Taxa de sucesso vs falha por fonte.
- Contagem diária de requisições API `/decision`.
- Log viewer com filtro por data/hora e nível.
- Autenticação básica via token JWT (não exposto ao público).

**BDD**

{"features":[{"name":"Dashboard de Monitoramento","scenarios":[{"title":"Exibir métricas de latência das chamadas externas","given":["O sistema está em produção e o endpoint /dashboard está acessível via HTTPS"],"when":["Um usuário autenticado com token JWT válido navega para a URL /dashboard"],"then":["A página carrega em menos que 2 segundos","Os gráficos de latência mostram valores reais dos últimos 24h para Open‑Meteo, Marinha e CEMADEN","Cada gráfico exibe título, eixo X (tempo) e eixo Y (latência ms)","Há legendas claras indicando cada fonte"]},{"title":"Mostrar taxa de sucesso vs falha por fonte","given":["O sistema coleta métricas Prometheus em tempo real"],"when":["O usuário acessa a seção 'Taxa de Sucesso' no dashboard"],"then":["Um gráfico de barras apresenta, para cada fonte externa (Open‑Meteo, Marinha, CEMADEN), a porcentagem de requisições bem-sucedidas e falhas nas últimas 24h","A legenda indica cores verde (sucesso) e vermelho (falha)","Os valores são atualizados automaticamente a cada minuto"]},{"title":"Exibir contagem diária de requisições API /decision","given":["O endpoint /decision está sendo chamado por usuários externos"],"when":["Um usuário acessa a aba 'Requisições diárias' no dashboard"],"then":["Um gráfico de linha mostra o número total de chamadas ao /decision para cada dia das últimas 7 semanas","O eixo X exibe datas, o eixo Y exibe contagem","Há um tooltip que revela o valor exato ao passar o mouse"]},{"title":"Filtrar logs estruturados por data/hora e nível","given":["Logs são armazenados em formato JSON no Loki"],"when":["Um usuário entra na visualização de logs e define filtro 'data = 2026‑09‑15' e 'nível = ERROR'"],"then":["A tabela exibe apenas registros correspondentes ao dia e nível selecionado","Cada linha mostra timestamp, nível, mensagem e campo adicional 'service'"]},{"title":"Verificar autenticação JWT na API de dashboard","given":["Um token JWT inválido ou expirado é usado para acessar /dashboard"],"when":["O usuário tenta navegar para a página"],"then":["O servidor responde com status 401 Unauthorized e corpo JSON explicando o motivo"]}]}]}

**User Stories**


#### Exibir métricas de latência das chamadas externas

Como administrador do sistema, quero que a página de dashboard mostre gráficos de latência em milissegundos para as chamadas externas (Open‑Meteo, Marinha e CEMADEN) nos últimos 24 h, para que eu possa identificar rapidamente qualquer degradação no tempo de resposta.

_Critérios de Aceite_

/dashboard

_Subtarefas_

- Criar endpoint `/api/metrics/latency` que consulta Prometheus por métricas `http_request_duration_seconds{service=~"open-meteo|marinha|cemaden"}` e retorna séries temporais nos últimos 24 h.
- Desenvolver componente React (ou Vue) com chart.js que recebe os dados JSON, cria três gráficos de linha separados, cada um rotulado corretamente: "Latência Open‑Meteo", "Latência Marinha", "Latência CEMADEN".
- Adicionar eixo X como timestamp formatado (HH:mm), eixo Y em milissegundos.
- Garantir que o endpoint seja protegido por JWT; requisição sem token retorna 401.
- Implementar teste unitário de serviço que verifica retorno de dados corretos e tratamento de erros.
- Testes E2E: navegar até `/dashboard`, esperar que gráficos carreguem em <2 s, validar presença de legendas e títulos.

#### Filtrar logs estruturados por data/hora e nível

Como operador de suporte, quero filtrar os logs JSON armazenados no Loki por data (ou intervalo) e nível de severidade (INFO, WARN, ERROR), para que eu possa localizar rapidamente ocorrências críticas.

_Critérios de Aceite_

/dashboard/logs

_Subtarefas_

- Criar endpoint `/api/logs` que aceita parâmetros `date=YYYY-MM-DD`, `level=ERROR|WARN|INFO` e consulta Loki via promtail ou Loki API, retornando registros JSON com campos: timestamp, level, message, service.
- Desenvolver interface de filtro com campo de data (datepicker) e dropdown de nível. Ao submeter, a tabela atualiza.
- Garantir que a tabela exiba colunas: Timestamp, Nível, Mensagem, Service.
- Proteger endpoint por JWT; retorno 401 se token inválido ou expirado.
- Testes unitários para filtragem correta e tratamento de parâmetros inválidos, testes E2E para UI.

#### Verificar autenticação JWT na API de dashboard

Como administrador do sistema, quero que a página `/dashboard` exija um token JWT válido antes de renderizar qualquer conteúdo, para garantir que apenas usuários autorizados acessem métricas sensíveis.

_Critérios de Aceite_

/dashboard

_Subtarefas_

- Implementar middleware de autenticação no backend (Express/Go/Ktor) que verifica cabeçalho `Authorization: Bearer <token>`.
- Configurar algoritmo HMAC SHA‑256 e chave secreta para assinatura do token, com expiração de 30 minutos.
- Caso o token seja inválido ou expirado, retornar HTTP 401 com corpo JSON `{"error":"Unauthorized","message":"Token inválido ou expirado."}`.
- Adicionar teste de unidade que envia requisição sem token e valida resposta 401.
- Testar fluxo completo: usuário obtém token via `/auth/login`, navega para `/dashboard` e recebe conteúdo; token expira → tenta acessar novamente → 401.

#### Exibir contagem diária de requisições API /decision

Como administrador do sistema, quero visualizar um gráfico de linha que mostra o número total de chamadas ao endpoint `/decision` por dia nas últimas 7 semanas, para que eu possa analisar tendências e picos de uso.

_Critérios de Aceite_

/dashboard

_Subtarefas_

- Criar endpoint `/api/metrics/daily-decisions` que consulta Loki ou Prometheus para a métrica `decision_requests_total` agrupada por dia (histograma).
- Desenvolver componente gráfico de linha com eixo X como datas (dd/mm) e eixo Y como contagem.
- Adicionar tooltip que exibe o valor exato ao passar o mouse sobre cada ponto.
- Garantir a proteção via JWT; retorno 401 caso token inválido.
- Testes unitários para agregação diária correta, testes E2E para visualização e tooltip.

#### Mostrar taxa de sucesso vs falha por fonte

Como administrador do sistema, quero ver um gráfico de barras que exiba a porcentagem de requisições bem‑sucedidas e falhas para cada fonte externa nos últimos 24 h, para que eu possa monitorar a confiabilidade dos serviços externos.

_Critérios de Aceite_

/dashboard

_Subtarefas_

- Criar endpoint `/api/metrics/success-failure` que consulta Prometheus por métricas `http_requests_total{status=~"2..|5..", service=~"open-meteo|marinha|cemaden"}` e calcula porcentagens de sucesso (200‑299) e falha (500‑599).
- Desenvolver componente gráfico de barras com duas cores: verde (#28a745) para sucesso, vermelho (#dc3545) para falha.
- Adicionar legenda automática que indica a cor correspondente a cada estado.
- Configurar atualização automática do gráfico a cada 60 s via polling ou WebSocket.
- Garantir que o endpoint seja protegido por JWT e retorne 401 em caso de token inválido/expirado.
- Testes unitários para cálculo de porcentagens, testes E2E para validação visual e tempo de atualização.

### Modal de Geolocalização Opcional

Prompt que solicita consentimento para usar IP do usuário a fim de exibir vias críticas próximas na justificativa.

**Funcionalidades**

- Texto: “Deseja exibir vias críticas próximas?”
- Botões: “Sim” e “Não”.
- Se aprovado, consulta serviço `ipinfo.io` e obtém cidade/estado; exibe via crítica (ex.: Agamenon Magalhães) na justificativa.
- Persistência do consentimento em localStorage por 30 dias.
- Acessibilidade: foco automático no modal, rolagem bloqueada.

**BDD**

{"features":[{"name":"Exibir Vias Críticas Próximas com Consentimento de IP","scenarios":[{"title":"Cenário: Usuário aceita consentimento e via crítica é exibida","given":["O usuário está na página principal do aplicativo"],"when":["O modal de consentimento aparece e o usuário clica em 'Sim'"],"then":["A aplicação armazena a decisão no localStorage com validade de 30 dias","A aplicação consulta ipinfo.io para obter cidade e estado","Com base nos dados obtidos, a aplicação exibe a via crítica mais próxima (ex.: Agamenon Magalhães) na justificativa"]}]}]}

**User Stories**


#### Exibir Modal de Consentimento para Vias Críticas Próximas

Como usuário que visita a página principal do aplicativo, quero ver um modal perguntando se desejo exibir vias críticas próximas, para que eu possa decidir compartilhar meu IP.

_Critérios de Aceite_

O modal aparece automaticamente ao carregar a página principal. O texto exibido é "Deseja exibir vias críticas próximas?" com botões "Sim" e "Não". O foco inicial está no botão "Sim". Ao clicar em qualquer botão, o modal desaparece. Se o usuário não tiver decisão armazenada em localStorage, o modal deve aparecer; caso contrário, ele não aparece.

_Subtarefas_

- Implementar componente modal reativo com texto e botões
- Garantir que o modal bloqueie rolagem do fundo
- Definir foco automático no botão "Sim" ao renderizar

#### Exibição da Via Crítica Mais Próxima na Justificativa

Como usuário que aceitou consentimento, quero ver a via crítica mais próxima (ex.: Agamenon Magalhães) exibida na justificativa, para que eu tenha informações relevantes ao local.

_Critérios de Aceite_

Com base na cidade e estado obtidos de ipinfo.io, o aplicativo consulta a base de dados interna de vias críticas. Se houver uma via no mesmo município, exibe seu nome em destaque dentro da seção de justificativas. Caso não haja via local, exibe mensagem "Nenhuma via crítica próxima disponível.".

_Subtarefas_

- Mapear cidades para vias críticas na base
- Implementar lógica de busca e fallback
- Renderizar via ou mensagem no componente Justificativa

#### Persistência da Decisão de Consentimento em localStorage

Como desenvolvedor, quero armazenar a escolha do usuário (sim ou não) no localStorage com validade de 30 dias, para que o modal não reapareça enquanto a decisão for válida.

_Critérios de Aceite_

Ao clicar em "Sim" ou "Não", a aplicação grava um objeto JSON { consent: true/false, expiresAt: timestamp } em localStorage. A expiração é calculada como 30 dias a partir da data atual. Em carregamento subsequente, se a data atual for menor que expiresAt, o modal não será exibido.

_Subtarefas_

- Criar função setConsent(value:boolean)
- Criar função getConsent() que verifica validade
- Adicionar lógica de remoção após expiração

#### Consulta ao Serviço ipinfo.io para Obter Cidade e Estado

Como usuário que aceitou consentimento, quero que o aplicativo consulte o serviço ipinfo.io para obter minha cidade e estado, para que a via crítica mais próxima seja exibida.

_Critérios de Aceite_

Após confirmação de consentimento, a aplicação faz uma requisição GET a https://ipinfo.io/json?token=SEU_TOKEN. A resposta JSON contém campos city e region. Se a chamada falhar, exibe mensagem de erro genérica e não mostra via crítica.

_Subtarefas_

- Implementar wrapper fetchIpInfo()
- Tratar erros HTTP e timeout
- Armazenar resultado temporariamente para uso posterior

#### Acessibilidade do Modal – Foco Automático e Rolagem Bloqueada

Como usuário com necessidades de acessibilidade, quero que o modal capture foco automaticamente e bloqueie rolagem ao abrir, para garantir navegação adequada.

_Critérios de Aceite_

Ao abrir o modal, focus() é chamado no elemento principal. O evento keydown ESC fecha o modal. A rolagem do body fica disabled enquanto modal aberto e restaurada ao fechar.

_Subtarefas_

- Adicionar atributo aria-modal=true
- Gerenciar escopo de foco com trapFocus()
- Controlar overflow hidden no body

### Tela de Fallback Estático

Página exibida quando qualquer fonte externa não pode ser alcançada, informando que a decisão não pôde ser calculada.

**Funcionalidades**

- Mensagem centralizada: “Não foi possível obter dados hoje. Por favor, tente novamente amanhã.”
- Botão “Tentar Novamente” que recarrega a página.
- Estilo neutro (cinza claro) sem temas de alerta.
- Acessibilidade WCAG 2.1 AA (contraste 4.5:1).

**BDD**

{"features":[{"name":"Exibição da página de erro de dados externos indisponíveis","scenarios":[{"title":"Página exibe mensagem padrão quando fonte externa falha","given":["O usuário acessa a aplicação e a API externa retorna status 503"],"when":["A aplicação tenta recuperar dados da API externa"],"then":["A aplicação detecta falha na requisição e renderiza a página de erro com o texto centralizado \"Não foi possível obter dados hoje. Por favor, tente novamente amanhã.\"","O layout tem fundo cinza claro (#f5f5f5) e contraste 4.5:1 conforme WCAG 2.1 AA","A mensagem está no centro vertical e horizontal da tela"]}]}]}

**User Stories**


#### US-1: Exibir página de erro quando a API externa está indisponível

Como usuário que tenta acessar dados da aplicação, quero ver uma mensagem clara indicando que os dados não puderam ser carregados, para que eu saiba que o problema não é meu e possa tentar novamente mais tarde.

_Critérios de Aceite_

- A página de erro deve aparecer automaticamente quando a API externa retornar status 503 (Service Unavailable) ou qualquer outro código de erro HTTP 5xx.
- O texto centralizado na tela deve ser exatamente: "Não foi possível obter dados hoje. Por favor, tente novamente amanhã.".
- O fundo da página deve ter cor #f5f5f5 (cinza claro). A fonte utilizada para a mensagem deve garantir contraste mínimo de 4.5:1 contra esse fundo conforme WCAG 2.1 AA.
- A mensagem deve estar alinhada vertical e horizontalmente ao centro da janela, ocupando no máximo 60% da largura disponível em telas maiores que 1024 px; em dispositivos móveis a margem lateral deve ser de 16 px.
- O layout deve se adaptar a resoluções entre 320 px e 1920 px sem cortar conteúdo nem introduzir barras de rolagem desnecessárias.
- A página deve não apresentar nenhum elemento de estilo que remeta a alertas (ex.: cores vermelhas, ícones de aviso).
- O botão "Tentar Novamente" deve ser visível abaixo da mensagem centralizada e deve ter o mesmo contraste mínimo de 4.5:1 contra o fundo.
- Ao clicar no botão ou ao pressionar Enter enquanto ele está focado, a página deve recarregar (HTTP GET para a rota inicial).

_Subtarefas_

- Criar componente ErrorPage com estrutura HTML/CSS adequada.
- Implementar lógica de captura de erro HTTP 5xx na camada de serviço que chama a API externa.
- Adicionar fallback que renderiza ErrorPage quando erro detectado.
- Garantir responsividade e alinhamento centralizado usando Flexbox ou Grid.
- Aplicar estilos com variáveis CSS para facilitar manutenção futura.
- Testar contraste visual em navegadores Chrome, Firefox e Edge.

#### US-3: Garantir acessibilidade WCAG 2.1 AA para a página de erro

Como usuário com necessidades especiais, quero que a página de erro cumpra os padrões WCAG 2.1 AA, garantindo legibilidade e navegação adequada.

_Critérios de Aceite_

- O contraste entre texto (título + mensagem) e fundo deve ser no mínimo 4.5:1.
- Todos os elementos interativos devem ter foco visível (outline de cor #0066cc ou equivalente).
- A página deve usar tags semânticas corretas (`<main>`, `<h1>`, `<p>`, `<button>`).

_Subtarefas_

- Calcular contraste entre fontes e fundo usando ferramenta automática (axe-core, Lighthouse).
- Adicionar atributos `aria-live="polite"` na mensagem para leitores de tela.
- Implementar foco visível no botão com CSS `:focus-visible`.
- Testar navegação por teclado apenas (Tab/Shift+Tab) e leitores de tela NVDA/VoiceOver.

#### US-5: Testes automatizados da página de erro

Como QA, quero que haja testes automatizados que garantam a correta exibição e funcionalidade da página de erro.

_Critérios de Aceite_

- Pelo menos 3 testes unitários para o componente ErrorPage (ex.: renderização do texto, verificação de estilos). 
- Um teste de integração que simula uma falha na API externa e verifica se a página de erro é exibida.
- Um teste E2E que clica no botão "Tentar Novamente" e assegura que a página recarregue sem erros.

_Subtarefas_

- Implementar testes unitários com Jest/React Testing Library.
- Criar cenário de falha da API usando MSW (Mock Service Worker).
- Escrever teste Cypress/E2E para fluxo completo.

#### US-2: Implementar funcionalidade de recarga da página via botão "Tentar Novamente"

Como usuário que está na página de erro, quero ter um botão que recarregue a aplicação para tentar recuperar os dados novamente, evitando precisar usar o botão voltar do navegador.

_Critérios de Aceite_

- O botão deve possuir texto visível "Tentar Novamente" e estar abaixo da mensagem centralizada.
- Ao clicar no botão, a ação de recarga deve ser equivalente ao evento `window.location.reload(true)` (forçando cache bypass).

_Subtarefas_

- Adicionar evento onClick ao botão que dispara `location.reload(true)`.
- Garantir que o foco automático seja retornado para o botão após a recarga, facilitando navegação por teclado.
- Incluir tratamento de erro em caso de falha na recarga (ex.: mensagem emergente "Falha ao tentar recarregar. Por favor, tente novamente."), embora não obrigatório.

#### US-4: Logar ocorrências de falha da API externa

Como administrador, quero que cada falha da API externa seja registrada para diagnóstico futuro.

_Critérios de Aceite_

- Quando a API retorna erro 5xx, o sistema deve registrar um log com nível `error` contendo: timestamp, URL solicitada, status HTTP e mensagem de exceção.
- O log deve ser enviado tanto ao console (para desenvolvimento) quanto a serviço de monitoramento externo (ex.: Sentry, Logstash).

_Subtarefas_

- Criar middleware ou interceptor que capture erros HTTP 5xx.
- Formatar payload do log em JSON com campos: `timestamp`, `url`, `statusCode`, `errorMessage`.
- Enviar via API REST ao serviço de monitoramento configurado.

### Botão Imprimir – Exportação PNG

Funcionalidade que captura a tela da decisão atual e gera uma imagem PNG para download ou impressão.

**Funcionalidades**

- Uso de `html2canvas` com escala 1.5 para qualidade alta.
- Popup “Download” com nome padrão: `decisão-recife-<data>.png`.
- Suporte a navegadores modernos (Chrome, Firefox, Edge).
- Fallback em caso de falha da biblioteca: exibe mensagem “Não foi possível gerar imagem.”

**BDD**

{"features":[{"name":"Captura da tela da decisão atual","scenarios":[{"title":"Cenário: Gerar imagem PNG de alta qualidade com sucesso","given":["O usuário está na página de decisão que deseja capturar","html2canvas está carregado corretamente no navegador"],"when":["O usuário clica no botão 'Download'"],"then":["A função html2canvas é chamada com escala 1.5","Um objeto canvas contendo a captura da tela é criado","Uma imagem PNG é gerada a partir do canvas","O nome padrão do arquivo segue o formato decisão-recife-<data>.png onde <data> está no formato DDMMYYYY"]},{"title":"Cenário: Falha na geração de imagem devido à falha da biblioteca html2canvas","given":["O usuário está na página de decisão que deseja capturar","html2canvas não pode ser carregado ou lança exceção"],"when":["O usuário clica no botão 'Download'"],"then":["A aplicação captura a exceção lançada pela biblioteca","Exibe uma mensagem ao usuário: \"Não foi possível gerar imagem.\"","Nenhum arquivo de download é iniciado"]},{"title":"Cenário: Suporte a navegadores modernos (Chrome, Firefox, Edge) na geração da imagem","given":["O usuário está utilizando Chrome 120 ou superior"],"when":["O usuário clica no botão 'Download'"],"then":["A captura da tela é realizada com sucesso e o arquivo PNG é baixado"]},{"title":"Cenário: Navegador sem suporte a html2canvas (ex.: Safari antigo)","given":["O usuário está utilizando um navegador que não suporta html2canvas"],"when":["O usuário clica no botão 'Download'"],"then":["A aplicação exibe mensagem de erro \"Não foi possível gerar imagem.\" e sugere atualizar o navegador"]}]}]}

**User Stories**


#### US-2: Tratar falhas ao gerar imagem por falta da biblioteca

Como usuário, quero receber uma mensagem clara caso a captura não seja possível devido à falha no carregamento ou execução de html2canvas, para saber que o recurso está indisponível e tentar novamente mais tarde.

_Critérios de Aceite_

[ ] Quando html2canvas lança exceção ou não está definido, a aplicação captura a exceção.
[ ] Exibe um modal/alert com texto 'Não foi possível gerar imagem.'
[ ] Nenhum arquivo de download é iniciado.
[ ] O erro é logado no console para depuração.

_Subtarefas_

- Adicionar try/catch ao fluxo de captura.
- Implementar componente de mensagem de erro.
- Registrar erro no console.

#### US-1: Capturar tela de decisão e gerar PNG com alta qualidade

Como usuário da página de decisões, quero capturar a tela atual em um arquivo PNG de alta resolução para download ou impressão, garantindo que o arquivo tenha nome padrão contendo a data atual no formato DDMMYYYY.

_Critérios de Aceite_

[ ] O botão 'Download' dispara a captura usando html2canvas com escala 1.5.
[ ] A imagem resultante é salva como PNG.
[ ] O nome do arquivo segue 'decisão-recife-<data>.png', onde <data> está no formato DDMMYYYY (ex.: decisão-recife-01092026.png).
[ ] O download inicia automaticamente sem intervenção adicional.
[ ] O processo funciona em navegadores modernos: Chrome 120+, Firefox 115+, Edge 120+.

_Subtarefas_

- Implementar botão 'Download' na UI.
- Integrar html2canvas com escala 1.5.
- Gerar blob PNG e criar link de download programaticamente.
- Formatar nome do arquivo conforme especificação.

#### US-3: Suporte a navegadores modernos na geração da imagem

Como usuário que utiliza um navegador moderno, quero que a funcionalidade de captura funcione sem problemas para poder salvar minha decisão.

_Critérios de Aceite_

[ ] Em Chrome 120+, Firefox 115+ e Edge 120+, ao clicar 'Download', a captura ocorre e o arquivo PNG é baixado.
[ ] O teste de integração confirma que html2canvas retorna um canvas válido nesses navegadores.

_Subtarefas_

- Configurar testes de CI para esses browsers.
- Verificar compatibilidade da API do html2canvas.

#### US-4: Exibir mensagem em navegadores sem suporte a html2canvas

Como usuário em um navegador antigo que não suporta html2canvas, quero receber uma orientação para atualizar o navegador ao tentar baixar a captura.

_Critérios de Aceite_

[ ] Se o navegador não tem suporte à API usada por html2canvas (ex.: Safari antigo), a aplicação detecta falha.
[ ] Exibe mensagem 'Não foi possível gerar imagem. Atualize seu navegador.'
[ ] Sugere a versão mínima suportada: Chrome 80+, Firefox 75+, Edge 79+.

_Subtarefas_

- Detectar ausência de suporte via feature detection.
- Mostrar modal com sugestão de atualização.