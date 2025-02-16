import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
// import { AuthService } from './auth.service';
import { User } from './users.model';
import { UsersService } from './services/users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserQueryService } from './services/user-query.service';
// import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    UsersService,
    UserQueryService,
    // AuthService,
    // {
    //   provide: APP_INTERCEPTOR,
    //   // useClass: CurrentUserInterceptor,
    // },
  ],
  exports: [UsersService],
})
export class UsersModule {}
