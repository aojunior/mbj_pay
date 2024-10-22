import fs from 'fs';
import path from 'path';
import process from 'process';
import { formatDateTime, today } from './utils';

export const logger = (() => {
  const nameFile = `logs ${today}.txt`
  const logFilePath = path.join(process.cwd(), nameFile);
  console.log(logFilePath)

  const logToFile = (level, message) => {
    const timestamp = formatDateTime(new Date());
    const logMessage = `${timestamp} [${level}]: ${message}\n`;

    fs.appendFile(logFilePath, logMessage, (err) => {
      if (err) throw err;
    });
  };

  const logToConsole = (level, message) => {
    const timestamp = formatDateTime(new Date());
    console[level](`${timestamp} [${level}]: ${message}`);
  };

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
