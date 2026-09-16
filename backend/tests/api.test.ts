import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/server.js';

describe('API Endpoints Test Suite', () => {
  it('GET /health deve retornar status UP', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('UP');
  });

  it('GET /api/decision deve responder com a decisão do dia (SIM ou NÃO) e justificativa <= 90 chars', async () => {
    const res = await request(app).get('/api/decision');
    expect(res.status).toBe(200);
    expect(['SIM', 'NÃO']).toContain(res.body.value);
    expect(typeof res.body.justification).toBe('string');
    expect(res.body.justification.length).toBeLessThanOrEqual(90);
    expect(res.body.factors).toBeDefined();
    expect(res.body.criticalRoads.length).toBeGreaterThan(0);
  });

  it('GET /api/location deve retornar informações de geolocalização e vias críticas', async () => {
    const res = await request(app).get('/api/location');
    expect(res.status).toBe(200);
    expect(res.body.city).toBe('Recife');
    expect(res.body.nearestCriticalRoad).toBeDefined();
  });

  it('GET /rss e GET /api/rss devem retornar feed RSS XML válido', async () => {
    const resRoot = await request(app).get('/rss');
    expect(resRoot.status).toBe(200);
    expect(resRoot.headers['content-type']).toContain('xml');
    expect(resRoot.text).toContain('<rss version="2.0"');

    const resApi = await request(app).get('/api/rss');
    expect(resApi.status).toBe(200);
    expect(resApi.text).toContain('<title>Decisão do dia: Ficar em casa?');
  });

  it('GET /api/rss/latest deve retornar JSON do último item', async () => {
    const res = await request(app).get('/api/rss/latest');
    expect(res.status).toBe(200);
    expect(res.body.title).toContain('Decisão do dia: Ficar em casa?');
    expect(res.body.link).toBe('https://ficoemcasa.com.br/');
    expect(res.body.description.length).toBeGreaterThan(50);
  });

  it('GET /api/rss/download deve fornecer cabeçalho de anexo correto', async () => {
    const res = await request(app).get('/api/rss/download');
    expect(res.status).toBe(200);
    expect(res.headers['content-disposition']).toMatch(/attachment; filename="rss-\d{8}\.xml"/);
  });

  it('POST /api/auth/login deve rejeitar credenciais inválidas com 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'fake', password: 'wrongpassword' });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Unauthorized');
  });

  it('POST /api/auth/login deve autenticar com sucesso e retornar token JWT', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'adminrecife' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.tokenType).toBe('Bearer');
  });

  it('GET /api/metrics/latency deve exigir token e retornar 401 sem Authorization', async () => {
    const res = await request(app).get('/api/metrics/latency');
    expect(res.status).toBe(401);
  });

  it('GET /api/metrics/latency deve retornar dados quando autenticado', async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'adminrecife' });

    const token = loginRes.body.token;

    const res = await request(app)
      .get('/api/metrics/latency')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('GET /metrics deve expor métricas no formato Prometheus', async () => {
    const res = await request(app).get('/metrics');
    expect(res.status).toBe(200);
    expect(res.text).toContain('feh_http_requests_total');
  });

  it('POST /api/webhook/notify deve aceitar notificações externas', async () => {
    const res = await request(app)
      .post('/api/webhook/notify')
      .send({ decision: 'SIM', source: 'test' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
