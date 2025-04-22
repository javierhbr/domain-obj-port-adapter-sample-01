// src/handlers.ts
import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpErrorHandler from '@middy/http-error-handler';
import validator from '@middy/validator';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { transactionService } from '@config/dependencies';
import { CreateTransactionDto } from '@dto/CreateTransaction.dto';
import { TransactionDetailsDto } from '@dto/TransactionDetails.dto';
import createHttpError from 'http-errors';

// Define the JSON Schema for validation, wrapped in a function
const getValidationSchema = () => ({
  type: 'object',
  properties: {
    body: {
      type: 'object',
      properties: {
        amount: { type: 'number', exclusiveMinimum: 0 },
        currency: { type: 'string', minLength: 3, maxLength: 3 },
        description: { type: 'string', minLength: 1, maxLength: 255 },
      },
      required: ['amount', 'currency', 'description'],
    },
  },
  required: ['body'],
});

// Base handler for creating a transaction
const createTransactionBaseHandler = async (
  // Type assertion is still useful for type safety within the handler
  event: APIGatewayProxyEvent & { body: CreateTransactionDto }
): Promise<APIGatewayProxyResult> => {
  console.log('[Middy] Received validated body for createTransaction:', event.body);

  try {
    const newTransaction = await transactionService.createTransaction(event.body);

    const responseDto: TransactionDetailsDto = {
      id: newTransaction.id,
      amount: newTransaction.amount,
      currency: newTransaction.currency,
      description: newTransaction.description,
      processedAt: newTransaction.timestamp.toISOString(),
    };

    return {
      statusCode: 201,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(responseDto),
    };
  } catch (error: any) {
    console.error('[Middy] Error creating transaction:', error);
     if (error.message === 'Transaction amount must be positive.') {
        throw createHttpError(400, error.message);
    }
    throw createHttpError(500, 'Failed to create transaction');
  }
};

// Base handler for getting transaction details
const getTransactionDetailsBaseHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log('[Middy] Received event for getTransactionDetails:', JSON.stringify(event));
  const transactionId = event.pathParameters?.transactionId;

  if (!transactionId) {
     throw createHttpError(400, 'Missing transactionId path parameter');
  }

  try {
    const transaction = await transactionService.getTransactionDetails(transactionId);

    if (!transaction) {
      throw createHttpError(404, `Transaction with ID ${transactionId} not found`);
    }

    const responseDto: TransactionDetailsDto = {
      id: transaction.id,
      amount: transaction.amount,
      currency: transaction.currency,
      description: transaction.description,
      processedAt: transaction.timestamp.toISOString(),
    };

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(responseDto),
    };
  } catch (error: any) {
    console.error(`[Middy] Error fetching transaction ${transactionId}:`, error);
    // Re-throw known http errors, otherwise wrap as 500
    if (createHttpError.isHttpError(error)) {
        throw error;
    }
    throw createHttpError(500, 'Failed to fetch transaction details');
  }
};

// Apply Middy middleware
export const createTransactionHandler = middy()
  .use(httpJsonBodyParser()) // Parses JSON request body into event.body
  // Use a function that returns the schema object
  .use(validator({ eventSchema: getValidationSchema }))
  .use(httpErrorHandler()) // Handles http-errors
  .handler(createTransactionBaseHandler);

export const getTransactionDetailsHandler = middy()
  .use(httpErrorHandler()) // Handles http-errors
  .handler(getTransactionDetailsBaseHandler);

