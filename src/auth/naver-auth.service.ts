import { Injectable } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { User } from "src/user/entities/user.entity";
import { Payload } from "./interfaces/payload.interface";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "src/user/dto/create-user.dto";

@Injectable()
export class NaverAuthService {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
    ) {}

    async naverSignUp(createUserDto: CreateUserDto): Promise<User> {
        return this.userService.createUser(createUserDto);
    }

    // 카카오 로그인시 토큰 발급
    async naverSignIn(user: User): Promise<{ accessToken: string; refreshToken: string }> {
        const payload: Payload = { username: user.name, sub: user.id, role: user.role };
        const accessToken = this.authService.genAccessToken(payload);
        const refreshToken = this.authService.genRefreshToken(payload);

        await this.userService.updateRefreshToken(user, refreshToken);

        return { accessToken, refreshToken };
    }
}
