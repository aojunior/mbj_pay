import winston from 'winston';
import path from 'node:path'; // Usando a importação correta

// Configuração do logger
export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level}]: ${message}`;
        })
    ),
    transports: [
        new winston.transports.File({
            filename: path.join(__dirname, 'logs.txt'),
            options: { flags: 'a' } // Adiciona ao final do arquivo            
        }),
        new winston.transports.Console()
    ]
});