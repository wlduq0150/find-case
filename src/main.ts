import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import { ValidationExceptionFilter } from "./config/custom-exception/validate.filter";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // cors 활성화
    app.enableCors({
        origin: "*",
    });

    // Dto Pipe
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            transformOptions: { enableImplicitConversion: true },
            whitelist: true,
            forbidNonWhitelisted: true,
        }),
    );

    // Filter
    app.useGlobalFilters(new ValidationExceptionFilter());

    // Swagger
    const config = new DocumentBuilder()
        .setTitle("API Test")
        .setDescription("API Test")
        .setVersion("1.0")
        .addBearerAuth({ type: "http", scheme: "bearer", bearerFormat: "Token" }, "accessToken")
        .addBearerAuth({ type: "http", scheme: "bearer", bearerFormat: "Token" }, "refreshToken")
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api", app, document);

    // 환경 변수 설정
    const configService = app.get(ConfigService);
    const port: number = configService.get("SERVER_PORT");

    await app.listen(port);
}

bootstrap();
