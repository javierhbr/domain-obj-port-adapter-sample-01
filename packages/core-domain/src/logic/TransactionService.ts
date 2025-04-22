// src/logic/TransactionService.ts
import { Transaction } from '../domain/Transaction'; // Relative path
import { TransactionRepository } from '../ports/TransactionRepository'; // Relative path

export class TransactionService {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async createTransaction(
    data: Omit<Transaction, 'id' | 'timestamp'>
  ): Promise<Transaction> {
    // Basic validation or business rule example
    if (data.amount <= 0) {
      throw new Error('Transaction amount must be positive.');
    }
    // More complex business logic could go here
    return this.transactionRepository.save(data);
  }

  async getTransactionDetails(id: string): Promise<Transaction | null> {
    return this.transactionRepository.findById(id);
  }
}
