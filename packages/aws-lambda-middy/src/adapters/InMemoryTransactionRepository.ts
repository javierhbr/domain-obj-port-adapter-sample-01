// src/adapters/InMemoryTransactionRepository.ts
// Reusing the same simple in-memory adapter
import { Transaction, TransactionRepository } from 'core-domain';
import { v4 as uuidv4 } from 'uuid';

const transactionStore: Map<string, Transaction> = new Map();

export class InMemoryTransactionRepository implements TransactionRepository {
  async save(transactionData: Omit<Transaction, 'id' | 'timestamp'>): Promise<Transaction> {
    const newTransaction: Transaction = {
      ...transactionData,
      id: uuidv4(),
      timestamp: new Date(),
    };
    transactionStore.set(newTransaction.id, newTransaction);
    console.log('[Middy] Saved transaction:', newTransaction);
    return newTransaction;
  }

  async findById(id: string): Promise<Transaction | null> {
    const transaction = transactionStore.get(id) || null;
    console.log(`[Middy] Finding transaction by ID ${id}:`, transaction);
    return transaction;
  }
}
