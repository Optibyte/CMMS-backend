import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/app/api/users/user.module';
import { RedisCacheModule } from 'src/redis-cache/redis-cache.module';
import { AuthMiddleware } from './auth.middleware';

const jwtFactory = {
    useFactory: async (configService: ConfigService) => ({
        secret: configService.get('jwtSecret'),
        signOptions: {
            expiresIn: configService.get('jwtTokenExpire'),
        },
    }),
    inject: [ConfigService]
};

@Module({
    imports: [
        UsersModule,
        RedisCacheModule,
        PassportModule.register({
            defaultStrategy: 'jwt',
            property: 'user',
            session: true,
        }),
        
        JwtModule.registerAsync(jwtFactory),
    ],
    providers: [AuthService, LocalStrategy, JwtStrategy, AuthMiddleware, RedisCacheModule],
    controllers: [AuthController],
    exports: [AuthService, PassportModule, JwtModule],

})
export class AuthModule { }
