// src/ports/TransactionRepository.ts
import { Transaction } from '../domain/Transaction';

export interface TransactionRepository {
  save(transaction: Omit<Transaction, 'id' | 'timestamp'>): Promise<Transaction>;
  findById(id: string): Promise<Transaction | null>;
}
