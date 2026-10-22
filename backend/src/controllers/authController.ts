import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { logger } from "../utils/logger.js";

export class AuthController {
  public login(req: Request, res: Response): void {
    const { username, password } = req.body || {};

    const validUser = process.env.ADMIN_USER || "admin";
    const validPass = process.env.ADMIN_PASSWORD || "adminrecife";

    if (username === validUser && password === validPass) {
      const secret = process.env.JWT_SECRET || "feh-jwt-secret-key-recife-2026";
      // Token expira em 30 minutos (1800 segundos) conforme US-06
      const token = jwt.sign({ username, role: "admin" }, secret, {
        expiresIn: "30m",
      });

      logger.info(
        `🔐 Login realizado com sucesso para o usuário [${username}]`,
      );

      res.json({
        token,
        tokenType: "Bearer",
        expiresIn: 1800,
        user: { username, role: "admin" },
      });
      return;
    }

    logger.warn(` Tentativa de login inválida com usuário: ${username}`);
    res.status(401).json({
      error: "Unauthorized",
      message: "Usuário ou senha inválidos.",
    });
  }
}

export const authController = new AuthController();
