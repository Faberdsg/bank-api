import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  UseGuards,
  Request,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DepositFundsDto } from './dto/deposit-funds.dto';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyProfile(@Request() req) {
    console.log(
      'DEBUG: getMyProfile - Contenido COMPLETO de req.user:',
      req.user,
    );
    const userId = req.user.id;
    console.log('DEBUG: getMyProfile - ID extraído (userId):', userId);

    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('deposit')
  async depositFunds(@Request() req, @Body() depositFundsDto: DepositFundsDto) {
    console.log(
      'DEBUG: depositFunds - Contenido COMPLETO de req.user:',
      req.user,
    );
    const userId = req.user.id;
    console.log('DEBUG: depositFunds - ID extraído (userId):', userId);

    const amount = depositFundsDto.amount;
    return this.usersService.depositFunds(userId, amount);
  }
}
