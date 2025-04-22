// src/config/dependencies.provider.ts
import { FactoryProvider } from '@nestjs/common';
import { TransactionService, TransactionRepository } from 'core-domain';
import { InMemoryTransactionRepositoryAdapter } from '@adapters/InMemoryTransactionRepository.adapter'; // Use relative path if needed

// Define injection tokens (can also use strings or classes)
export const TRANSACTION_REPOSITORY = 'TRANSACTION_REPOSITORY';
export const TRANSACTION_SERVICE = 'TRANSACTION_SERVICE';

// Provider for the repository implementation
export const TransactionRepositoryProvider: FactoryProvider<TransactionRepository> = {
  provide: TRANSACTION_REPOSITORY,
  useFactory: () => {
    // Here you could add logic to choose different repository implementations
    // based on environment variables, etc.
    return new InMemoryTransactionRepositoryAdapter();
  },
};

// Provider for the domain service, injecting the repository
export const TransactionServiceProvider: FactoryProvider<TransactionService> = {
  provide: TRANSACTION_SERVICE,
  useFactory: (repository: TransactionRepository) => {
    return new TransactionService(repository);
  },
  inject: [TRANSACTION_REPOSITORY], // Inject the repository provider
};
