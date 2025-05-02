// src/adapters/transactionRepository.js
const { v4: uuidv4 } = require('uuid');

// In-memory storage using a simple Map
const transactionStore = new Map();

/**
 * Creates a transaction repository adapter that fulfills the core-domain port contract
 * @returns {Object} Transaction repository implementation 
 */
const createTransactionRepository = () => ({
  /**
   * Saves a transaction and returns it with generated ID and timestamp
   * @param {Object} transactionData - Transaction data without ID and timestamp
   * @returns {Promise<Object>} Complete transaction object
   */
  save: async (transactionData) => {
    const newTransaction = {
      ...transactionData,
      id: uuidv4(),
      timestamp: new Date()
    };
    
    // Store the transaction in our in-memory map
    transactionStore.set(newTransaction.id, newTransaction);
    console.log('[Functional Middy] Saved transaction:', newTransaction);
    
    return newTransaction;
  },
  
  /**
   * Finds a transaction by ID
   * @param {string} id - Transaction ID
   * @returns {Promise<Object|null>} Found transaction or null
   */
  findById: async (id) => {
    const transaction = transactionStore.get(id) || null;
    console.log(`[Functional Middy] Finding transaction by ID ${id}:`, transaction);
    
    return transaction;
  }
});

module.exports = { createTransactionRepository };
