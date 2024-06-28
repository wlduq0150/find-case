import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile } from "passport-kakao";
import { AuthService } from "../auth.service";
import { ConfigService } from "@nestjs/config";
import { UserService } from "src/user/user.service";
import { CreateUserDto } from "src/user/dto/create-user.dto";

@Injectable()
export class KakaoAuthStrategy extends PassportStrategy(Strategy, "kakao-auth") {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
        private readonly configService: ConfigService,
    ) {
        super({
            clientID: configService.get<string>("KAKAO_CLIENT_ID"),
            callbackURL: configService.get<string>("KAKAO_CALLBACK_URL"),
            clientSecret: configService.get<string>("KAKAO_CLIENT_SECRET"),
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile): Promise<any> {
        const { id: kakaoId, username, _json } = profile;
        const createUserDto: CreateUserDto = {
            kakaoId,
            name: (username || _json.kakao_account.profile.nickname) ?? "유저",
            email: _json.kakao_account.email,
            agreeToMarketing: 0,
            role: 0,
        };

        const user = await this.userService.findUserByKakaoId(kakaoId);
        if (!user) {
            const newUser = await this.userService.createUser(createUserDto);
            return newUser;
        }
        return user;
    }
}
