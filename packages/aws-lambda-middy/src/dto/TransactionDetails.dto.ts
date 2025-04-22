// src/dto/TransactionDetails.dto.ts
// Reusing the same DTO structure as the vanilla lambda
export interface TransactionDetailsDto {
  id: string;
  amount: number;
  currency: string;
  description: string;
  processedAt: string; // ISO Date string
}
