// src/transactions/dto/create-transaction.dto.ts
import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  receiverAccountNumber: string; // Número de cuenta del receptor

  @IsNumber()
  @IsNotEmpty()
  @Min(0.01) // Mínimo de monto para una transferencia
  amount: number;
}
