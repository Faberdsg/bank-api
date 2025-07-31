// src/transactions/transactions.controller.ts
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
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // RUTA CRÍTICA: Ajusta si tu guardia no está en ../auth/

@Controller('api/transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @UseGuards(JwtAuthGuard) // Protege esta ruta
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createTransaction(
    @Request() req, // Accede al usuario autenticado via req.user
    @Body() createTransactionDto: CreateTransactionDto,
  ) {
    const senderId = req.user.id; // ID del usuario que está autenticado
    const transaction = await this.transactionsService.createTransaction(
      senderId,
      createTransactionDto,
    );
    return { message: 'Transacción realizada exitosamente', transaction };
  }

  @UseGuards(JwtAuthGuard) // Protege esta ruta
  @Get() // GET a /api/transactions (sin :id)
  @HttpCode(HttpStatus.OK)
  async getTransactionHistory(@Request() req) {
    const userId = req.user.id; // ID del usuario autenticado
    const history =
      await this.transactionsService.getTransactionHistory(userId);
    return {
      message: 'Historial de transacciones obtenido exitosamente',
      history,
    };
  }

  @UseGuards(JwtAuthGuard) // Protege esta ruta
  @Get(':id') // GET a /api/transactions/:id
  @HttpCode(HttpStatus.OK)
  async getTransactionDetails(
    @Param('id') transactionId: string,
    @Request() req,
  ) {
    const userId = req.user.id; // ID del usuario autenticado
    const transaction =
      await this.transactionsService.findTransactionById(transactionId);

    if (!transaction) {
      throw new NotFoundException('Transacción no encontrada.');
    }

    // Opcional: Asegurarse de que el usuario autenticado es parte de la transacción
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
