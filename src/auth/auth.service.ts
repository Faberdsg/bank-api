import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email, true);

    console.log(
      'DEBUG: AuthService - Usuario encontrado para validación:',
      user ? user.email : 'null',
      'Password:',
      user ? user.password : 'N/A',
    );

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (!user.password) {
      console.error(
        `Error: Usuario encontrado con email ${email} pero sin contraseña almacenada.`,
      );
      throw new UnauthorizedException(
        'Credenciales inválidas. Contacte al soporte técnico.',
      );
    }

    const isPasswordValid = await bcrypt.compare(pass, user.password);

    if (isPasswordValid) {
      const { password, ...result } = user.toJSON();
      return result;
    }

    throw new UnauthorizedException('Credenciales inválidas');
  }

  async register(createUserDto: CreateUserDto) {
    const user = await this.usersService.register(createUserDto);

    try {
      await this.mailService.sendMail(
        user.email,
        '¡Bienvenido a Tu Banco App!',
        `Hola ${user.name},\n\nGracias por registrarte en Tu Banco App. ¡Tu cuenta ha sido creada exitosamente!\n\nSaludos,\nEl equipo de Tu Banco App`,
        `<p>Hola <strong>${user.name}</strong>,</p><p>Gracias por registrarte en Tu Banco App. ¡Tu cuenta ha sido creada exitosamente!</p><p>Saludos,<br>El equipo de Tu Banco App</p>`,
      );
    } catch (error) {
      console.error(
        'No se pudo enviar el correo de bienvenida al usuario:',
        user.email,
        error,
      );
    }

    return user;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
