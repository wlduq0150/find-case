import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "../auth.service";
import { UserService } from "src/user/user.service";
import { Payload } from "../interfaces/payload.interface";
import { User } from "src/user/entities/user.entity";
import { Request } from "express";

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, "refresh_token") {
    constructor(
        private authService: AuthService,
        private userService: UserService,
        private configService: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get<string>("JWT_REFRESH_TOKEN_SECRET"),
            ignoreExpiration: false,
            passReqToCallback: true,
        });
    }

    async validate(req: Request, payload: Payload & { iat: any; exp: any }): Promise<Payload> {
        const { iat, exp, ...payloadData } = payload;

        const refreshToken = req.headers.authorization ?? "none";

        const isValid = await this.userService.verifyUserRefreshToken(payload.sub, refreshToken);
        if (!isValid) {
            throw new UnauthorizedException("Invalid Refresh Token");
        }

        req["payload"] = payloadData;
        return payload;
    }
}
