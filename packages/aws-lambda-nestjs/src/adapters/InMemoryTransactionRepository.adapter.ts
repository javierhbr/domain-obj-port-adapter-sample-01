// src/adapters/InMemoryTransactionRepository.adapter.ts
import { Injectable } from '@nestjs/common';
import { Transaction, TransactionRepository } from 'core-domain';
import { v4 as uuidv4 } from 'uuid';

// Simple in-memory store for demonstration
const transactionStore: Map<string, Transaction> = new Map();

@Injectable()
export class InMemoryTransactionRepositoryAdapter implements TransactionRepository {
  async save(transactionData: Omit<Transaction, 'id' | 'timestamp'>): Promise<Transaction> {
    const newTransaction: Transaction = {
      ...transactionData,
      id: uuidv4(),
      timestamp: new Date(),
    };
    transactionStore.set(newTransaction.id, newTransaction);
    console.log('[NestJS] Saved transaction:', newTransaction);
    return newTransaction;
  }

  async findById(id: string): Promise<Transaction | null> {
    const transaction = transactionStore.get(id) || null;
    console.log(`[NestJS] Finding transaction by ID ${id}:`, transaction);
    return transaction;
  }
}
