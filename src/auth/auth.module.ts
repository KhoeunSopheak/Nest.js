// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from '../users/users.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import {JWT_SECRET} from 'src/configs/jwt-secret';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UsersService],
  imports: [
    UsersModule,
    JwtModule.register({
      global:true,
      secret: JWT_SECRET,
      signOptions: {expiresIn: '1d'},
    }),
  ],
})
export class AuthModule {}
