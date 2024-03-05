import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

export const WinstonConfig = {
    format: winston.format.combine(
        winston.format.splat(),
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.printf(
            log => {
                // if error show stack trace else show log message
                if (log.stack) return `[${log.timestamp}] [${log.level}] ${log.stack}`;
                return `[${log.timestamp}] [${log.level}] ${log.message}`;
            },
        ),
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.colorize({
                all: true,
                colors: {
                    info: 'green',
                    error: 'red'
                }
            }),
        }),
        new DailyRotateFile({
            level: 'error',
            filename: './src/logs/error/error.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: false,
            maxSize: '20m',
            maxFiles: '14d'
        })
    ],
}