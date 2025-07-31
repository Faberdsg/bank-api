// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../models/user.model';
import { UsersService } from './users.service';
import { UsersController } from './users.controller'; // Asegúrate de que esté importado

@Module({
  imports: [SequelizeModule.forFeature([User])],
  providers: [UsersService],
  controllers: [UsersController], // <--- ¡VERIFICA QUE UsersController ESTÉ AQUÍ!
  exports: [UsersService],
})
export class UsersModule {}
