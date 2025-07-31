import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  Get,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createTransaction(
    @Request() req,
    @Body() createTransactionDto: CreateTransactionDto,
  ) {
    const senderId = req.user.id;
    const transaction = await this.transactionsService.createTransaction(
      senderId,
      createTransactionDto,
    );
    return { message: 'Transacción realizada exitosamente', transaction };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async getTransactionHistory(@Request() req) {
    const userId = req.user.id;
    const history =
      await this.transactionsService.getTransactionHistory(userId);
    return {
      message: 'Historial de transacciones obtenido exitosamente',
      history,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getTransactionDetails(
    @Param('id') transactionId: string,
    @Request() req,
  ) {
    const userId = req.user.id;
    const transaction =
      await this.transactionsService.findTransactionById(transactionId);

    if (!transaction) {
      throw new NotFoundException('Transacción no encontrada.');
    }

    if (
      transaction.sender_id !== userId &&
      transaction.receiver_id !== userId
    ) {
      throw new NotFoundException(
        'Transacción no encontrada o no tienes acceso.',
      );
    }

    return {
      message: 'Detalles de la transacción obtenidos exitosamente',
      transaction,
    };
  }
}
