import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import IORedis from "ioredis";

@Injectable()
export class RedisService {
    private readonly redisClient: IORedis;

    constructor(private readonly configService: ConfigService) {
        const isConnect = this.configService.get<string>("REDIS_HOST");

        if (isConnect) {
            this.redisClient = new IORedis({
                host: this.configService.get<string>("REDIS_HOST"),
                port: this.configService.get<number>("REDIS_PORT"),
                password: this.configService.get<string>("REDIS_PASSWORD"),
            });

            // Redis 연결 확인
            this.redisClient.on("connect", () => {
                console.log("Connected to Redis");
            });
            this.redisClient.on("error", (err) => {
                console.error("Redis connection error:", err);
            });
        }
    }

    getRedisClient(): IORedis {
        return this.redisClient;
    }
}
