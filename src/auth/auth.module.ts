import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserModule } from "src/user/user.module";
import { JwtModule } from "@nestjs/jwt";
import { AccessTokenGuard } from "./guards/access-token.guard";
import { AccessTokenStrategy } from "./strategies/access-token.strategy";
import { RefreshTokenGuard } from "./guards/refresh-token.guard";
import { RefreshTokenStrategy } from "./strategies/refresh-token.strategy";
import { KakaoAuthService } from "./kakao-auth.service";
import { KakaoAuthGuard } from "./guards/kakao-auth.guard";
import { KakaoAuthStrategy } from "./strategies/kakao-auth.strategy";
import { GoogleAuthGuard } from "./guards/google-auth.guard";
import { GoogleAuthService } from "./google-auth.service";
import { GoogleAuthStrategy } from "./strategies/google-auth.strategy";
import { NaverAuthService } from "./naver-auth.service";
import { NaverAuthGuard } from "./guards/naver-auth.guard";
import { NaverAuthStrategy } from "./strategies/naver-auth.strategy";

@Module({
    imports: [UserModule, JwtModule.register({})],
    exports: [
        AccessTokenGuard,
        RefreshTokenGuard,
        KakaoAuthGuard,
        NaverAuthGuard,
        GoogleAuthGuard,
        AccessTokenStrategy,
        RefreshTokenStrategy,
        KakaoAuthStrategy,
        NaverAuthStrategy,
        GoogleAuthStrategy,
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        AccessTokenGuard,
        RefreshTokenGuard,
        AccessTokenStrategy,
        RefreshTokenStrategy,
        KakaoAuthService,
        KakaoAuthGuard,
        KakaoAuthStrategy,
        GoogleAuthService,
        GoogleAuthGuard,
        GoogleAuthStrategy,
        NaverAuthService,
        NaverAuthGuard,
        NaverAuthStrategy,
    ],
})
export class AuthModule {}
