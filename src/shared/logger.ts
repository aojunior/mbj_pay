import {existsSync, mkdirSync} from 'fs';
import path from 'path';
import { createLogger, format, transports } from 'winston';

// Definir o caminho da pasta e dos arquivos de log
const logDirectory = path.join(__dirname, 'logs');

// Verificar se a pasta de logs existe, caso contrário, criar a pasta
if (!existsSync(logDirectory)) {
  mkdirSync(logDirectory, { recursive: true });
}

// Configurar o logger
export const logger = createLogger({
  level: 'info', // nível de log (info, warn, error)
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [
    // Exibir logs no console
    new transports.Console(),

    // Salvar logs em um arquivo
    new transports.File({
      filename: path.join(logDirectory, 'app.log'),
      level: 'info'
    }),

    // Arquivo separado para logs de erro
    new transports.File({
      filename: path.join(logDirectory, 'error.log'),
      level: 'error'
    })
  ]
});
