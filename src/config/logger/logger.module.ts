import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { LoggerService } from "./logger.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Log } from "./entities/log.entity";

@Module({
    imports: [ConfigModule, TypeOrmModule.forFeature([Log])],
    providers: [LoggerService],
    exports: [LoggerService],
})
export class LoggerModule {}
