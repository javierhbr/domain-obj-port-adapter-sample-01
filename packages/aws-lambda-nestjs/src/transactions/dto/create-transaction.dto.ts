// src/transactions/dto/create-transaction.dto.ts
import { IsNotEmpty, IsNumber, IsPositive, IsString, Length, MaxLength } from 'class-validator';

export class CreateTransactionDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @Length(3, 3) // Ensures exactly 3 characters, e.g., 'USD'
  @IsNotEmpty()
  currency: string;

  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  description: string;
}
