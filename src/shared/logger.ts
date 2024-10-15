import fs from 'fs';
import path from 'path'; // Mantendo a importação correta para o caminho
import { formatDateTime } from './utils';

// Função para criar o logger
export const logger = (() => {
  const logFilePath = path.join(__dirname, '../logs.txt');

  // Função para gravar no arquivo de log
  const logToFile = (level, message) => {
    const timestamp = formatDateTime(new Date());
    const logMessage = `${timestamp} [${level}]: ${message}\n`;

    // Adiciona ao final do arquivo de log
    fs.appendFile(logFilePath, logMessage, (err) => {
      if (err) throw err;
    });
  };

  // Função para logar na console
  const logToConsole = (level, message) => {
    const timestamp = formatDateTime(new Date());
    console[level](`${timestamp} [${level}]: ${message}`);
  };

  // Função principal de log
  const log = (level, message) => {
    logToFile(level, message);
    logToConsole(level, message);
  };

  return {
    info: (message) => log('info', message),
    warn: (message) => log('warn', message),
    error: (message) => log('error', message),
  };
})();
