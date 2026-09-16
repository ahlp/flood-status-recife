import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { logger } from './utils/logger.js';
import { register, httpRequestCounter, httpRequestDuration } from './utils/metrics.js';
import { apiRouter } from './routes/apiRoutes.js';
import { rssController } from './controllers/rssController.js';
import { schedulerService } from './services/schedulerService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet({
  crossOriginResourcePolicy: false
}));
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(express.json());

// Middleware de métricas HTTP e Logging
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const routePath = req.route?.path || req.path;

  res.on('finish', () => {
    const durationSec = (Date.now() - start) / 1000;
    const statusCode = res.statusCode.toString();

    httpRequestCounter.labels(req.method, routePath, statusCode).inc();
    httpRequestDuration.labels(req.method, routePath, statusCode).observe(durationSec);

    logger.info(`HTTP ${req.method} ${req.originalUrl} - ${statusCode} (${(durationSec * 1000).toFixed(0)}ms)`);
  });

  next();
});

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'UP',
    name: 'Flood Status Recife (Fico em Casa Hoje?)',
    timestamp: new Date().toISOString()
  });
});

// Endpoint oficial do Prometheus
app.get('/metrics', async (_req: Request, res: Response) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    res.status(500).end((err as Error).message);
  }
});

// Root RSS endpoint para compatibilidade direta (RF-05)
app.get('/rss', (req: Request, res: Response) => rssController.getRss(req, res));

// Rotas da API REST (/api/*)
app.use('/api', apiRouter);

// Handler de fallback para 404
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `A rota ${req.method} ${req.originalUrl} não foi encontrada.`
  });
});

// Inicialização do Servidor e Scheduler
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    logger.info(`🚀 Backend Flood Status Recife rodando na porta ${PORT}`);
    schedulerService.start();
  });
}

export { app };
