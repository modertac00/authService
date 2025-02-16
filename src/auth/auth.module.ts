import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UsersService } from "src/users/services/users.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "src/users/users.model";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./strategy/jwt.strategy";
import { RefreshJwtStrategy } from "./strategy/refresh-jwt.strategy";
import { PassportModule } from "@nestjs/passport";

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_SECRET'),
        signOptions: { expiresIn: '15m' }, // Access token expires in 15 min
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersService, JwtStrategy, RefreshJwtStrategy],
  exports: [JwtStrategy, RefreshJwtStrategy],
})
export class AuthModule {}
