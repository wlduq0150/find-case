import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignUpDto } from "./dto/sign-up.dto";
import { SignInDto } from "./dto/sign-in.dto";
import { AccessTokenGuard } from "./guards/access-token.guard";
import { RefreshTokenGuard } from "./guards/refresh-token.guard";
import { Request, Response } from "express";
import { Payload } from "./interfaces/payload.interface";
import { ApiBearerAuth } from "@nestjs/swagger";
import { UserId } from "./decorators/user-id.decorator";
import { KakaoAuthGuard } from "./guards/kakao-auth.guard";
import { KakaoAuthService } from "./kakao-auth.service";
import { User } from "src/user/entities/user.entity";
import { ConfigService } from "@nestjs/config";
import { GoogleAuthGuard } from "./guards/google-auth.guard";
import { GoogleAuthService } from "./google-auth.service";
import { NaverAuthGuard } from "./guards/naver-auth.guard";
import { NaverAuthService } from "./naver-auth.service";

@Controller("/api/auth")
export class AuthController {
    constructor(
        private readonly configService: ConfigService,
        private readonly authService: AuthService,
        private readonly kakaoAuthService: KakaoAuthService,
        private readonly naverAuthService: NaverAuthService,
        private readonly googleAuthService: GoogleAuthService,
    ) {}

    // 인증 확인
    @ApiBearerAuth("accessToken")
    @UseGuards(AccessTokenGuard)
    @Get("check")
    authCheck(@UserId() userId: number) {
        return userId;
    }

    // 회원가입
    @Post("sign-up")
    signUp(@Body() singUpDto: SignUpDto) {
        return this.authService.signUp(singUpDto);
    }

    // 로그인(일반)
    @Post("sign-in")
    signIn(@Body() signInDto: SignInDto) {
        return this.authService.signIn(signInDto);
    }

    // 로그인(카카오);
    @Get("kakao")
    @UseGuards(KakaoAuthGuard)
    async kakaoLogin() {}

    // 로그인 콜백(카카오)
    @Get("kakao/callback")
    @UseGuards(KakaoAuthGuard)
    async kakaoLoginCallback(@Req() req: Request & { user: User }, @Res() res: Response) {
        const { accessToken, refreshToken } = await this.kakaoAuthService.kakaoSignIn(req.user);

        const redirectUrl =
            this.configService.get<string>("REDIRECT_URL") + `?accessToken=${accessToken}&refreshToken=${refreshToken}`;

        return res.redirect(redirectUrl);
    }

    // 로그인(구글)
    @Get("google")
    @UseGuards(GoogleAuthGuard)
    async googleLogin() {}

    // 로그인 콜백(구글)
    @Get("google/callback")
    @UseGuards(GoogleAuthGuard)
    async googleLoginCallback(@Req() req: Request & { user: User }, @Res() res: Response) {
        const { accessToken, refreshToken } = await this.googleAuthService.googleSignIn(req.user);

        const redirectUrl =
            this.configService.get<string>("REDIRECT_URL") + `?accessToken=${accessToken}&refreshToken=${refreshToken}`;

        return res.redirect(redirectUrl);
    }

    // 로그인(네이버)
    @Get("naver")
    @UseGuards(NaverAuthGuard)
    async naverLogin() {}

    // 로그인 콜백(네이버)
    @Get("naver/callback")
    @UseGuards(NaverAuthGuard)
    async naverLoginCallback(@Req() req: Request & { user: User }, @Res() res: Response) {
        const { accessToken, refreshToken } = await this.naverAuthService.naverSignIn(req.user);

        const redirectUrl =
            this.configService.get<string>("REDIRECT_URL") + `?accessToken=${accessToken}&refreshToken=${refreshToken}`;

        return res.redirect(redirectUrl);
    }

    // 로그아웃
    @ApiBearerAuth("accessToken")
    @UseGuards(AccessTokenGuard)
    @Post("sign-out")
    signOut() {
        return this.authService.signOut();
    }

    // 토큰 재발급
    @ApiBearerAuth("refreshToken")
    @UseGuards(RefreshTokenGuard)
    @Post("refresh")
    refresh(@Req() req: Request) {
        const payload = req["payload"] as Payload;
        return this.authService.refresh(payload);
    }
}
