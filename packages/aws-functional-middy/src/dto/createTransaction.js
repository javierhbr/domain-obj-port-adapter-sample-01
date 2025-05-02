// src/dto/createTransaction.js

/**
 * Structure of a request to create a transaction
 * Used for validation and documentation
 */
const createTransactionSchema = {
  type: 'object',
  properties: {
    body: {
      type: 'object',
      properties: {
        amount: { 
          type: 'number', 
          exclusiveMinimum: 0 
        },
        currency: { 
          type: 'string', 
          minLength: 3, 
          maxLength: 3 
        },
        description: { 
          type: 'string', 
          minLength: 1, 
          maxLength: 255 
        }
      },
      required: ['amount', 'currency', 'description'],
      additionalProperties: false
    }
  },
  required: ['body']
};

/**
 * Maps validated request data to format expected by domain service
 * @param {Object} requestBody - Validated request body
 * @returns {Object} Data in format expected by domain
 */
const toCreateTransactionRequest = (requestBody) => ({
  amount: requestBody.amount,
  currency: requestBody.currency,
  description: requestBody.description
});

module.exports = { 
  createTransactionSchema,
  toCreateTransactionRequest
};
