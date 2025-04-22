// src/dto/TransactionDetails.dto.ts
export interface TransactionDetailsDto {
  id: string;
  amount: number;
  currency: string;
  description: string;
  processedAt: string; // ISO Date string
}
