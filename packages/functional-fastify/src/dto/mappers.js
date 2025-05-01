// src/dto/mappers.js

/**
 * Maps a domain Transaction object to a TransactionDetailsDto for API responses
 * @param {Object} transaction - Domain Transaction object
 * @returns {Object} TransactionDetailsDto object
 */
const toTransactionDetailsDto = (transaction) => {
  return {
    id: transaction.id,
    amount: transaction.amount,
    currency: transaction.currency,
    description: transaction.description,
    processedAt: transaction.timestamp.toISOString(),
  };
};

module.exports = { toTransactionDetailsDto };
