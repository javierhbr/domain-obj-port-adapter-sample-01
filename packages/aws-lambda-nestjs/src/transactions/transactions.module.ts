// src/transactions/transactions.module.ts
import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller'; // Correct import
import { TransactionRepositoryProvider, TransactionServiceProvider } from '@config/dependencies.provider';

@Module({
  controllers: [TransactionsController],
  providers: [
    TransactionRepositoryProvider, // Provides the repository implementation
    TransactionServiceProvider,    // Provides the service, injecting the repository
  ],
})
export class TransactionsModule {}
