// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { MailModule } from '../mail/mail.module'; // <-- ¡AÑADE ESTA LÍNEA!
import * as dotenv from 'dotenv';

dotenv.config(); // Asegúrate de cargar las variables de entorno si tu JWT_SECRET está en .env

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Asegúrate de que tu .env tenga JWT_SECRET
      signOptions: { expiresIn: '60m' }, // Token expira en 60 minutos
    }),
    MailModule, // <-- ¡AÑADE ESTO AL ARRAY DE IMPORTS!
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService], // Asegúrate de exportar AuthService si otros módulos lo usan
})
export class AuthModule {}
