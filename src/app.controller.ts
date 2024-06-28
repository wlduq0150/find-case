import { Controller, Get } from "@nestjs/common";
import { LoggerService } from "./config/logger/logger.service";

@Controller()
export class AppController {
    constructor(private readonly loggerService: LoggerService) {}

    @Get("/api/health-check")
    healthCheck(): boolean {
        this.loggerService.log("로그 테스트");
        return true;
    }
}
