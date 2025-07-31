// src/transactions/transactions.module.ts
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { Transaction } from '../models/transaction.model'; // RUTA CRÍTICA: Ajusta si tu modelo no está en ../models/
import { User } from '../models/user.model'; // Necesitas importar el modelo User también

@Module({
  imports: [
    SequelizeModule.forFeature([Transaction, User]), // Registra ambos modelos para este módulo
  ],
  providers: [TransactionsService],
  controllers: [TransactionsController],
  // No necesitas exportar nada si otros módulos no inyectarán TransactionsService directamente
})
export class TransactionsModule {}
