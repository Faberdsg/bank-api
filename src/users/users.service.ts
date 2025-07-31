// src/users/users.service.ts
import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../models/user.model';
import * as bcrypt from 'bcrypt';
import { generateAccountNumber } from '../utils/account-number.generator';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, name } = createUserDto;

    console.log('DEBUG: Register - Email recibido:', email);
    console.log(
      'DEBUG: Register - Contraseña en texto plano recibida:',
      password,
    );

    const existingUser = await this.userModel.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está registrado.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    console.log(
      'DEBUG: Register - Contraseña hasheada (después de bcrypt.hash):',
      hashedPassword,
    );
    if (!hashedPassword) {
      console.error(
        'DEBUG ERROR: hashedPassword es null/undefined después de bcrypt.hash. ¡Esto es un problema!',
      );
    }

    const finalAccountNumber = generateAccountNumber();

    const newUser = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
      account_number: finalAccountNumber,
      balance: 0,
    });

    console.log(
      'DEBUG: Register - Contraseña en objeto newUser (después de create):',
      newUser.password,
    );

    return newUser;
  }

  // --- ¡ESTA ES LA FIRMA CRÍTICA! ASEGÚRATE DE QUE SEA ASÍ: ---
  async findByEmail(
    email: string,
    includePassword = false,
  ): Promise<User | null> {
    const findOptions: any = { where: { email } };

    if (!includePassword) {
      findOptions.attributes = { exclude: ['password'] };
    }

    const user = await this.userModel.findOne(findOptions);

    console.log(
      'DEBUG: findByEmail - Usuario recuperado para login:',
      user ? user.email : 'null',
      'Password:',
      user ? user.password : 'N/A',
    );
    return user;
  }
  // --- FIN FIRMA CRÍTICA ---

  // src/users/users.service.ts (solo el método findById)

  async findById(id: string): Promise<User | null> {
    console.log('DEBUG: findById - Buscando usuario con ID:', id); // Log del ID que se busca
    const user = await this.userModel.findByPk(id, {
      attributes: { exclude: ['password'] },
    });
    console.log(
      'DEBUG: findById - Resultado de findByPk:',
      user ? user.toJSON() : 'null',
    ); // Log del resultado
    return user;
  }

  async depositFunds(userId: string, amount: number): Promise<User> {
    if (amount <= 0) {
      throw new BadRequestException('El monto a depositar debe ser positivo.');
    }

    const user = await this.userModel.findByPk(userId);

    if (!user) {
      throw new NotFoundException('Usuario no encontrado.');
    }

    user.balance = parseFloat(user.balance.toString()) + amount;
    await user.save();

    const updatedUser = await this.userModel.findByPk(userId, {
      attributes: { exclude: ['password'] },
    });

    if (!updatedUser) {
      throw new NotFoundException(
        'No se pudo recuperar la información del usuario actualizado después del depósito.',
      );
    }
    return updatedUser;
  }
}
