import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "../auth.service";
import { UserService } from "src/user/user.service";
import { Payload } from "../interfaces/payload.interface";
import { User } from "src/user/entities/user.entity";

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, "access_token") {
    constructor(
        private authService: AuthService,
        private userService: UserService,
        private configService: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get<string>("JWT_ACCESS_TOKEN_SECRET"),
            ignoreExpiration: false,
            passReqToCallback: true,
        });
    }

    async validate(req: any, payload: Payload): Promise<User> {
        req.user = payload;
        return this.userService.findUserById(payload.sub);
    }
}
