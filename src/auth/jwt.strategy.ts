import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserService } from "./user/user.service";
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
      private readonly configService: ConfigService,
      private readonly userService: UserService

    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Token'),
            ignoreExpiration: configService.get('JWT_IGNORE_EXPIRATION') == 'true',
            secretOrKey: configService.get('JWT_SECRET'),
        })
    }
    async validate(payload: any) {
        return this.userService.find(payload.email)
    }
}