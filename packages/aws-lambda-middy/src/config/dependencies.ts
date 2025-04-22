// src/config/dependencies.ts
// Reusing the same dependency setup
import { TransactionService } from 'core-domain';
import { InMemoryTransactionRepository } from '@adapters/InMemoryTransactionRepository';

const transactionRepository = new InMemoryTransactionRepository();
export const transactionService = new TransactionService(transactionRepository);
