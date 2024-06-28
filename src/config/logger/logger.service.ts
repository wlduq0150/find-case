import { Injectable, LoggerService as NestLoggerService } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Log } from "./entities/log.entity";
import { Repository } from "typeorm";
import * as winston from "winston";
import "winston-daily-rotate-file";
import * as path from "path";
import * as fs from "fs";
import * as readline from "readline";
import * as moment from "moment-timezone";

@Injectable()
export class LoggerService implements NestLoggerService {
    private readonly logger: winston.Logger;

    constructor(
        @InjectRepository(Log)
        private readonly logRepository: Repository<Log>,
        private readonly configService: ConfigService,
    ) {
        const logDirectory = path.join(__dirname, "../../../logs");
        if (!fs.existsSync(logDirectory)) {
            fs.mkdirSync(logDirectory);
        }

        const transports: winston.transport[] = [
            new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.colorize(),
                    winston.format.timestamp({ format: () => moment().tz("Asia/Seoul", true).format() }),
                    winston.format.printf(({ timestamp, level, message }) => {
                        return `${timestamp} ${level}: ${message}`;
                    }),
                ),
            }),
        ];

        if (configService.get<string>("NODE_ENV") === "production") {
            transports.push(
                new winston.transports.DailyRotateFile({
                    dirname: logDirectory,
                    datePattern: "",
                    filename: "application.log",
                    zippedArchive: true,
                    maxSize: "20m",
                    maxFiles: "14d",
                }),
            );

            setInterval(this.transferLogsToDatabase.bind(this), 20000); // 주기적으로 로그를 전송
        }

        this.logger = winston.createLogger({
            level: "info",
            format: winston.format.combine(
                winston.format.timestamp({ format: () => moment().tz("Asia/Seoul", true).format() }),
                winston.format.json(),
            ),
            transports,
        });
    }

    private async transferLogsToDatabase() {
        const logDirectory = path.join(__dirname, "../../../logs");
        const logFiles = fs.readdirSync(logDirectory);

        for (const file of logFiles) {
            const filePath = path.join(logDirectory, file);
            const fileStream = fs.createReadStream(filePath);
            const rl = readline.createInterface({
                input: fileStream,
                crlfDelay: Infinity,
            });

            for await (const line of rl) {
                try {
                    if (line.trim().startsWith("{") && line.trim().endsWith("}")) {
                        const logEntry = JSON.parse(line);
                        if (logEntry.level && logEntry.message && logEntry.timestamp) {
                            const log = new Log();
                            log.level = logEntry.level;
                            log.message = logEntry.message;
                            log.meta = logEntry.meta ? JSON.stringify(logEntry.meta) : null;
                            await this.logRepository.save(log);
                        }
                    }
                } catch (err) {
                    this.logger.error(`Failed to parse log entry: ${line}`, { trace: err });
                }
            }

            fs.writeFileSync(filePath, "");
        }
    }

    log(message: string, context?: string) {
        this.logger.info(message, { context });
    }

    error(message: string, trace: string, context?: string) {
        this.logger.error(message, { trace, context });
    }

    warn(message: string, context?: string) {
        this.logger.warn(message, { context });
    }

    debug(message: string, context?: string) {
        this.logger.debug(message, { context });
    }

    verbose(message: string, context?: string) {
        this.logger.verbose(message, { context });
    }
}
