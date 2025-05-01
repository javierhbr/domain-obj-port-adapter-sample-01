// src/config/dependencies.js
const { createTransactionRepository } = require('../adapters/transactionRepository');
const { TransactionService } = require('core-domain');

// Create repository adapters
const transactionRepository = createTransactionRepository();

// Create domain services with pure dependency injection (but using the class from core-domain)
const transactionService = new TransactionService(transactionRepository);

module.exports = { transactionRepository, transactionService };
