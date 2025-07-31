import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { Transaction } from '../models/transaction.model';
import { User } from '../models/user.model';

@Module({
  imports: [SequelizeModule.forFeature([Transaction, User])],
  providers: [TransactionsService],
  controllers: [TransactionsController],
})
export class TransactionsModule {}
