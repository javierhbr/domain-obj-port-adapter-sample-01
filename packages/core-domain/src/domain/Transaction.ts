// src/domain/Transaction.ts
export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  description: string;
  timestamp: Date;
}
