// src/transactions/dto/transaction-details.dto.ts
// Reusing a similar structure, could also use class-transformer for mapping
export class TransactionDetailsDto {
  id: string;
  amount: number;
  currency: string;
  description: string;
  processedAt: string; // ISO Date string
}
