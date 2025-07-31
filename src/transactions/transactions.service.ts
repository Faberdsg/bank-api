// src/transactions/transactions.service.ts
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from '../models/transaction.model'; // RUTA CRÍTICA: Ajusta si tu modelo no está en ../models/
import { User } from '../models/user.model'; // RUTA CRÍTICA: Ajusta si tu modelo no está en ../models/
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
    senderId: string, // ID del usuario que envía, viene del token JWT
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    const { receiverAccountNumber, amount } = createTransactionDto;

    return this.userModel.sequelize!.transaction(async (t) => {
      // 1. Obtener remitente
      const sender = await this.userModel.findByPk(senderId, {
        transaction: t,
      });
      if (!sender) {
        throw new NotFoundException('Usuario remitente no encontrado.');
      }

      // 2. Obtener receptor por número de cuenta
      const receiver = await this.userModel.findOne({
        where: { account_number: receiverAccountNumber },
        transaction: t,
      });

      if (!receiver) {
        throw new NotFoundException(
          'Número de cuenta del receptor no encontrado.',
        );
      }

      // 3. Validar que no se transfiere a sí mismo
      if (sender.id === receiver.id) {
        throw new BadRequestException(
          'No puedes transferir dinero a tu propia cuenta.',
        );
      }

      // 4. Validar saldo insuficiente
      if (parseFloat(sender.balance.toString()) < amount) {
        throw new BadRequestException(
          'Saldo insuficiente para realizar la transacción.',
        );
      }

      // 5. Actualizar saldo del remitente
      await sender.update(
        { balance: parseFloat(sender.balance.toString()) - amount },
        { transaction: t },
      );

      // 6. Actualizar saldo del receptor
      await receiver.update(
        { balance: parseFloat(receiver.balance.toString()) + amount },
        { transaction: t },
      );

      // 7. Crear el registro de la transacción
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
