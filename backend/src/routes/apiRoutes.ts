import { Router } from "express";
import { decisionController } from "../controllers/decisionController.js";
import { rssController } from "../controllers/rssController.js";
import { metricsController } from "../controllers/metricsController.js";
import { authController } from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = Router();

// --- Rotas Públicas Principais ---
router.get("/decision", (req, res) => decisionController.getDecision(req, res));
router.get("/location", (req, res) =>
  decisionController.getLocationInfo(req, res),
);

// --- Rotas do Feed RSS ---
router.get("/rss", (req, res) => rssController.getRss(req, res));
router.get("/rss/latest", (req, res) => rssController.getLatestRss(req, res));

// --- Rotas de Autenticação ---
router.post("/auth/login", (req, res) => authController.login(req, res));

// --- Webhook ---
router.post("/webhook/notify", (req, res) =>
  decisionController.postWebhookNotify(req, res),
);

// --- Rotas Protegidas de Métricas e Logs (JWT Requerido) ---
router.get("/metrics/latency", authMiddleware, (req, res) =>
  metricsController.getLatency(req, res),
);
router.get("/metrics/success-failure", authMiddleware, (req, res) =>
  metricsController.getSuccessFailure(req, res),
);
router.get("/metrics/daily-decisions", authMiddleware, (req, res) =>
  metricsController.getDailyDecisions(req, res),
);
router.get("/logs", authMiddleware, (req, res) =>
  metricsController.getLogs(req, res),
);

export { router as apiRouter };
