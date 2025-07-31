import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from '../models/transaction.model';
import { User } from '../models/user.model';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Op } from 'sequelize';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction)
    private transactionModel: typeof Transaction,
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async createTransaction(
    senderId: string,
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    const { receiverAccountNumber, amount } = createTransactionDto;

    return this.userModel.sequelize!.transaction(async (t) => {
      const sender = await this.userModel.findByPk(senderId, {
        transaction: t,
      });
      if (!sender) {
        throw new NotFoundException('Usuario remitente no encontrado.');
      }

      const receiver = await this.userModel.findOne({
        where: { account_number: receiverAccountNumber },
        transaction: t,
      });

      if (!receiver) {
        throw new NotFoundException(
          'Número de cuenta del receptor no encontrado.',
        );
      }

      if (sender.id === receiver.id) {
        throw new BadRequestException(
          'No puedes transferir dinero a tu propia cuenta.',
        );
      }

      if (parseFloat(sender.balance.toString()) < amount) {
        throw new BadRequestException(
          'Saldo insuficiente para realizar la transacción.',
        );
      }

      await sender.update(
        { balance: parseFloat(sender.balance.toString()) - amount },
        { transaction: t },
      );

      await receiver.update(
        { balance: parseFloat(receiver.balance.toString()) + amount },
        { transaction: t },
      );

      const transaction = await this.transactionModel.create(
        {
          sender_id: sender.id,
          receiver_id: receiver.id,
          amount: amount,
          transaction_date: new Date(),
        },
        { transaction: t },
      );

      return transaction;
    });
  }

  async getTransactionHistory(userId: string): Promise<Transaction[]> {
    const transactions = await this.transactionModel.findAll({
      where: {
        [Op.or]: [{ sender_id: userId }, { receiver_id: userId }],
      },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'name', 'email', 'account_number'],
        },
        {
          model: User,
          as: 'receiver',
          attributes: ['id', 'name', 'email', 'account_number'],
        },
      ],
      order: [['transaction_date', 'DESC']],
    });
    return transactions;
  }

  async findTransactionById(
    transactionId: string,
  ): Promise<Transaction | null> {
    return this.transactionModel.findByPk(transactionId, {
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'name', 'email', 'account_number'],
        },
        {
          model: User,
          as: 'receiver',
          attributes: ['id', 'name', 'email', 'account_number'],
        },
      ],
    });
  }
}
