import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "../auth.service";
import { CreateUserDto } from "src/user/dto/create-user.dto";
import { UserService } from "src/user/user.service";

@Injectable()
export class GoogleAuthStrategy extends PassportStrategy(Strategy, "google-auth") {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
        private readonly configService: ConfigService,
    ) {
        super({
            clientID: configService.get<string>("GOOGLE_CLIENT_ID"),
            clientSecret: configService.get<string>("GOOGLE_CLIENT_SECRET"),
            callbackURL: configService.get<string>("GOOGLE_CALLBACK_URL"),
            scope: ["email", "profile"],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
        const { id: googleId, name, emails } = profile;
        const createUserDto: CreateUserDto = {
            googleId,
            name: name.givenName + " " + name.familyName,
            email: emails[0].value,
            agreeToMarketing: 0,
            role: 0,
        };

        const user = await this.userService.findUserByGoogleId(googleId);
        if (!user) {
            const newUser = await this.userService.createUser(createUserDto);
            return newUser;
        }
        return user;
    }
}
