import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  receiverAccountNumber: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0.01)
  amount: number;
}
