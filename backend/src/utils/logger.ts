import winston from 'winston';
import { LogEntry } from '../types/index.js';

// Memória circular para logs recentes consultáveis via /api/logs
const inMemoryLogs: LogEntry[] = [];
const MAX_IN_MEMORY_LOGS = 500;

export function addInMemoryLog(entry: LogEntry): void {
  inMemoryLogs.unshift(entry);
  if (inMemoryLogs.length > MAX_IN_MEMORY_LOGS) {
    inMemoryLogs.pop();
  }
}

export function getInMemoryLogs(filter?: { date?: string; level?: string }): LogEntry[] {
  return inMemoryLogs.filter((log) => {
    let matches = true;
    if (filter?.date) {
      matches = matches && log.timestamp.startsWith(filter.date);
    }
    if (filter?.level) {
      matches = matches && log.level.toLowerCase() === filter.level.toLowerCase();
    }
    return matches;
  });
}

const customFormat = winston.format.printf(({ level, message, timestamp, service, ...metadata }) => {
  const logObj: LogEntry = {
    timestamp: (timestamp as string) || new Date().toISOString(),
    level: level as 'info' | 'warn' | 'error',
    message: String(message),
    service: (service as string) || 'flood-status-backend',
    metadata: Object.keys(metadata).length > 0 ? metadata : undefined
  };

  addInMemoryLog(logObj);
  return JSON.stringify(logObj);
});

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    customFormat
  ),
  defaultMeta: { service: 'flood-status-backend' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ all: false }),
        winston.format.simple()
      )
    })
  ]
});
