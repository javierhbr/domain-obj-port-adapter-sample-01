// src/config/dependencies.js
const { createTransactionRepository } = require('../adapters/transactionRepository');
const { TransactionService } = require('core-domain');

/**
 * Pure dependency injection configuration
 * This wires our adapters into the core domain services without using classes
 */

// Create repository adapters
const transactionRepository = createTransactionRepository();

// Create domain services with pure DI
const transactionService = new TransactionService(transactionRepository);

module.exports = { transactionRepository, transactionService };
