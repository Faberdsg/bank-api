import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class DepositDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(0.01)
  amount: number;
}
