// src/users/dto/deposit-funds.dto.ts
import { IsNumber, IsPositive } from 'class-validator';
// Eliminamos la línea: import { ApiProperty } from '@nestjs/swagger';

export class DepositFundsDto {
  // Eliminamos: @ApiProperty({ description: 'Monto a depositar en la cuenta del usuario', example: 100.50 })
  @IsNumber()
  @IsPositive()
  amount: number;
}
