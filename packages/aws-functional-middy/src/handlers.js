// src/handlers.js
const middy = require('@middy/core');
const httpJsonBodyParser = require('@middy/http-json-body-parser');
const httpErrorHandler = require('@middy/http-error-handler');
const validator = require('@middy/validator');
const createError = require('http-errors');

// Import dependencies
const { transactionService } = require('./config/dependencies');
const { createTransactionSchema, toCreateTransactionRequest } = require('./dto/createTransaction');
const { toTransactionDetailsResponse } = require('./dto/transactionDetails');

/**
 * Base handler function for creating a transaction
 * This is wrapped with middy middleware
 */
const createTransactionBaseHandler = async (event) => {
  console.log('[Functional Middy] Received validated body for createTransaction:', event.body);

  try {
    // Convert the API request to domain format using our mapper function
    const domainRequest = toCreateTransactionRequest(event.body);
    
    // Use the domain service to create the transaction
    const newTransaction = await transactionService.createTransaction(domainRequest);
    
    // Map domain response to API format
    const responseDto = toTransactionDetailsResponse(newTransaction);
    
    // Return success response
    return {
      statusCode: 201,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(responseDto)
    };
  } catch (error) {
    console.error('[Functional Middy] Error creating transaction:', error);
    
    // Handle domain validation errors
    if (error.message === 'Transaction amount must be positive.') {
      throw createError(400, error.message);
    }
    
    throw createError(500, 'Failed to create transaction');
  }
};

/**
 * Base handler function for getting transaction details
 * This is wrapped with middy middleware
 */
const getTransactionDetailsBaseHandler = async (event) => {
  console.log('[Functional Middy] Received event for getTransactionDetails:', JSON.stringify(event));
  
  const transactionId = event.pathParameters?.transactionId;
  
  if (!transactionId) {
    throw createError(400, 'Missing transactionId path parameter');
  }
  
  try {
    // Use the domain service to get transaction details
    const transaction = await transactionService.getTransactionDetails(transactionId);
    
    if (!transaction) {
      throw createError(404, `Transaction with ID ${transactionId} not found`);
    }
    
    // Map domain response to API format
    const responseDto = toTransactionDetailsResponse(transaction);
    
    // Return success response
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(responseDto)
    };
  } catch (error) {
    console.error(`[Functional Middy] Error fetching transaction ${transactionId}:`, error);
    
    // Re-throw HTTP errors, otherwise wrap as 500
    if (error.statusCode) {
      throw error;
    }
    
    throw createError(500, 'Failed to fetch transaction details');
  }
};

// Apply Middy middleware to our base handlers using functional composition
const createTransactionHandler = middy(createTransactionBaseHandler)
  .use(httpJsonBodyParser())
  .use(validator({ eventSchema: createTransactionSchema }))
  .use(httpErrorHandler());

const getTransactionDetailsHandler = middy(getTransactionDetailsBaseHandler)
  .use(httpErrorHandler());

module.exports = {
  createTransactionHandler,
  getTransactionDetailsHandler
};
