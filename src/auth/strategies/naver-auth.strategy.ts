import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile } from "passport-naver";
import { AuthService } from "../auth.service";
import { ConfigService } from "@nestjs/config";
import { User } from "src/user/entities/user.entity";
import { UserService } from "src/user/user.service";
import { CreateUserDto } from "src/user/dto/create-user.dto";

@Injectable()
export class NaverAuthStrategy extends PassportStrategy(Strategy, "naver-auth") {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
        private readonly configService: ConfigService,
    ) {
        super({
            clientID: configService.get<string>("NAVER_CLIENT_ID"),
            clientSecret: configService.get<string>("NAVER_CLIENT_SECRET"),
            callbackURL: configService.get<string>("NAVER_CALLBACK_URL"),
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: (error: any, user?: any) => void,
    ): Promise<any> {
        const { id: naverId, displayName, emails } = profile;
        const createUserDto: CreateUserDto = {
            naverId,
            name: displayName,
            email: emails[0].value,
            agreeToMarketing: 0,
            role: 0,
        };

        const user = await this.userService.findUserByNaverId(naverId);
        if (!user) {
            const newUser = await this.userService.createUser(createUserDto);
            return done(null, newUser);
        }
        return done(null, user);
    }
}
