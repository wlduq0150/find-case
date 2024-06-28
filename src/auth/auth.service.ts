import { BadRequestException, Injectable } from "@nestjs/common";
import { SignUpDto } from "./dto/sign-up.dto";
import { SignInDto } from "./dto/sign-in.dto";
import { UserService } from "src/user/user.service";
import { User } from "src/user/entities/user.entity";
import { Payload } from "./interfaces/payload.interface";
import { JwtService, JwtSignOptions } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    // 회원가입
    async signUp(signUpDto: SignUpDto): Promise<User> {
        const saltRounds = +this.configService.get("SALT_ROUNDS");
        const hashedPassword = await bcrypt.hash(signUpDto.password, saltRounds);

        return this.userService.createUser({
            ...signUpDto,
            password: hashedPassword,
        });
    }

    // 로그인
    async signIn(signInDto: SignInDto): Promise<{ accessToken: string; refreshToken: string }> {
        const { email, password } = signInDto;

        const user = await this.userService.verifyUser(email, password);

        const payload: Payload = { username: user.name, sub: user.id, role: user.role };
        const accessToken = this.genAccessToken(payload);
        const refreshToken = this.genRefreshToken(payload);

        await this.userService.updateRefreshToken(user, refreshToken);

        return { accessToken, refreshToken };
    }

    // 토큰 재발급
    async refresh(payload: Payload): Promise<{ accessToken: string }> {
        const accessToken = this.genAccessToken(payload);
        return { accessToken };
    }

    // 로그아웃
    async signOut(): Promise<boolean> {
        return true;
    }

    // access 토큰 발급
    genAccessToken(payload: Payload): string {
        const jwtSignOption: JwtSignOptions = {
            secret: this.configService.get<string>("JWT_ACCESS_TOKEN_SECRET"),
            expiresIn: this.configService.get<string>("JWT_ACCESS_TOKEN_EXP"),
        };

        const token = "Bearer " + this.jwtService.sign(payload, jwtSignOption);
        return token;
    }

    // refresh 토큰 발급
    genRefreshToken(payload: Payload): string {
        const jwtSignOption: JwtSignOptions = {
            secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET"),
            expiresIn: this.configService.get<string>("JWT_REFRESH_TOKEN_EXP"),
        };

        const token = "Bearer " + this.jwtService.sign(payload, jwtSignOption);
        return token;
    }
}
