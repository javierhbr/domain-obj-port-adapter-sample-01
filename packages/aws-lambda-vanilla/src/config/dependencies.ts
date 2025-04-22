// src/config/dependencies.ts
import { TransactionService } from 'core-domain';
import { InMemoryTransactionRepository } from '@adapters/InMemoryTransactionRepository';

// Manual Dependency Injection Setup
const transactionRepository = new InMemoryTransactionRepository();
export const transactionService = new TransactionService(transactionRepository);
