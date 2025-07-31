// src/users/dto/deposit.dto.ts
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class DepositDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(0.01) // Asegura que el monto sea positivo y significativo
  amount: number;
}
