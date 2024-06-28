import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { TypeormModule } from "./config/typeorm.module";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { MailModule } from "./mail/mail.module";
import { ConfigProjectModule } from "./config/config.module";
import { UploadImageService } from "./config/upload-image/upload-image.service";
import { RedisModule } from "./config/redis/redis.module";
import { LoggerModule } from "./config/logger/logger.module";

@Module({
    imports: [
        TypeormModule.forRoot(),
        ConfigProjectModule,
        LoggerModule,
        RedisModule,
        UserModule,
        AuthModule,
        MailModule,
    ],
    controllers: [AppController],
    providers: [UploadImageService],
})
export class AppModule {}
