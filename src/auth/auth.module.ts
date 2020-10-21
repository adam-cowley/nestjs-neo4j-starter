import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { Neo4jService } from 'nest-neo4j';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EncryptionService } from './encryption/encryption.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { UserService } from './user/user.service';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            imports: [ ConfigModule ],
            inject: [ ConfigService ],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: {
                    expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
                },
            })
        }),
    ],
    providers: [
        EncryptionService,
        UserService,
        AuthService,
        LocalStrategy,
        JwtStrategy
    ],
    controllers: [
        AuthController,
        // UserController, UsersController, ProfileController
    ],
    exports: [],
})
export class AuthModule {

    constructor(private readonly neo4jService: Neo4jService) { }

}
