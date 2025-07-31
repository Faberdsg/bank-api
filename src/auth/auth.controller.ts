// src/auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto'; // <-- ¡Asegúrate de que esta importación esté!

@Controller('api/users')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register') // <-- ¡ESTE ES EL ENDPOINT CORRECTO AHORA!
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: CreateUserDto) {
    // Este método llama a AuthService.register, que a su vez llama a UsersService.register
    // Y también se encarga de enviar el correo.
    const newUser = await this.authService.register(createUserDto);
    const { password, ...result } = newUser.toJSON();
    return result;
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    return this.authService.login(user);
  }
}
