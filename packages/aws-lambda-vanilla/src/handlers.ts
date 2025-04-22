// src/handlers.ts
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { transactionService } from '@config/dependencies';
import { CreateTransactionSchema, CreateTransactionDto } from '@dto/CreateTransaction.dto';
import { TransactionDetailsDto } from '@dto/TransactionDetails.dto';
import { ZodError } from 'zod';

function createErrorResponse(statusCode: number, message: string, details?: any): APIGatewayProxyResult {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, details }),
  };
}

function createSuccessResponse(statusCode: number, body: any): APIGatewayProxyResult {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}

export const createTransactionHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log('Received event for createTransaction:', JSON.stringify(event));

  if (!event.body) {
    return createErrorResponse(400, 'Missing request body');
  }

  let requestBody: CreateTransactionDto;
  try {
    // 1. Parse and Validate DTO
    requestBody = CreateTransactionSchema.parse(JSON.parse(event.body));
  } catch (error) {
    if (error instanceof ZodError) {
      return createErrorResponse(400, 'Invalid request body', error.errors);
    } else if (error instanceof SyntaxError) {
       return createErrorResponse(400, 'Invalid JSON format');
    }
    console.error('Error parsing request body:', error);
    return createErrorResponse(500, 'Internal Server Error');
  }

  try {
    // 2. Call Core Domain Logic
    const newTransaction = await transactionService.createTransaction(requestBody);

    // 3. Map to Response DTO
    const responseDto: TransactionDetailsDto = {
      id: newTransaction.id,
      amount: newTransaction.amount,
      currency: newTransaction.currency,
      description: newTransaction.description,
      processedAt: newTransaction.timestamp.toISOString(),
    };

    return createSuccessResponse(201, responseDto);
  } catch (error: any) {
    console.error('Error creating transaction:', error);
    // Handle specific domain errors if needed
    if (error.message === 'Transaction amount must be positive.') {
        return createErrorResponse(400, error.message);
    }
    return createErrorResponse(500, 'Failed to create transaction');
  }
};

export const getTransactionDetailsHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log('Received event for getTransactionDetails:', JSON.stringify(event));

  const transactionId = event.pathParameters?.transactionId;

  if (!transactionId) {
    return createErrorResponse(400, 'Missing transactionId path parameter');
  }

  try {
    // 1. Call Core Domain Logic
    const transaction = await transactionService.getTransactionDetails(transactionId);

    if (!transaction) {
      return createErrorResponse(404, `Transaction with ID ${transactionId} not found`);
    }

    // 2. Map to Response DTO
    const responseDto: TransactionDetailsDto = {
      id: transaction.id,
      amount: transaction.amount,
      currency: transaction.currency,
      description: transaction.description,
      processedAt: transaction.timestamp.toISOString(),
    };

    return createSuccessResponse(200, responseDto);
  } catch (error) {
    console.error(`Error fetching transaction ${transactionId}:`, error);
    return createErrorResponse(500, 'Failed to fetch transaction details');
  }
};
