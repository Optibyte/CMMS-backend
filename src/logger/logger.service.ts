import { Injectable } from '@nestjs/common';
import Config from "../config/app";
const winston = require('winston');

@Injectable()
export class LoggerService {
    private readonly loggerType = ['info', 'error', 'debug']
    async loggerService(errorBody: { level?: string, message: string }) {
        errorBody = this.loggerType.includes(errorBody?.level) ? errorBody : { ...errorBody, level: 'info' };
        const options = {
            file: {
                filename: Config().logPath,
                handleExceptions: true,
                json: true,
                maxsize: 9999999, // 5MB
                maxFiles: 5,
                colorize: true,
                prettyPrint: true
            }
        };
        const winstonlogger = new winston.createLogger({
            transports: [
                new winston.transports.Console(),
                new winston.transports.File(options.file)
            ],
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            ),
            exitOnError: false // do not exit on handled exceptions
        });
        return winstonlogger.log(errorBody);
    };
}
