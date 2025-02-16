import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    SequelizeModule.forRoot({
    dialect: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'admin',
    database: 'moderta_esm',
    autoLoadModels: true,
    synchronize: true, // Set to false in production
  }),
  UsersModule,
  AuthModule,
  ConfigModule.forRoot({ isGlobal: true }),
],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
